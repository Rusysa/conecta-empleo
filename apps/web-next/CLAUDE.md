# CLAUDE.md — Bolsa de Trabajo (Job Board)

> Integración 2026-10-15: identidad y perfil se implementaron mediante la API Express existente, PostgreSQL/Supabase y JWT firmado con JWS, sin OAuth. Para esa parte prevalecen `../../packages/contracts/HTTP.md` y `../../docs/SUPABASE.md`. Los roles visuales se adaptan a `candidate`/`employer`; no duplicar cuentas con Prisma/Auth.js. El resto de este documento conserva la propuesta original para funcionalidades futuras (archivos de CV, vacantes, postulaciones, correo).

> Documento de contexto para Claude Code. Describe el producto, el stack, el modelo de datos, los flujos y el plan de desarrollo. Léelo completo antes de escribir código y síguelo como fuente de verdad. Si algo no está definido aquí, pregunta antes de inventarlo.

---

## 1. Visión del producto

Aplicación web donde **negocios publican vacantes** y **candidatos registrados aplican con su CV**. Al aplicar, la empresa recibe los datos de contacto del candidato: **nombre, correo, teléfono, CV y vacante a la que aplicó**.

### Objetivos del MVP
- Cualquier visitante puede **ver vacantes sin registrarse**.
- Para **aplicar**, el candidato debe registrarse y tener perfil completo + CV.
- La empresa ve, por vacante, la lista de postulantes con sus datos de contacto y puede descargar el CV.
- Idioma de la interfaz: **español (México)**.

---

## 2. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | **Next.js** (App Router, última versión estable) + **TypeScript** (modo `strict`) |
| UI | **Tailwind CSS** + **shadcn/ui** (Radix) + **lucide-react** (iconos) |
| Formularios | **react-hook-form** + **zod** (esquemas compartidos cliente/servidor) |
| Base de datos | **PostgreSQL** (local con Docker; producción en Supabase o Neon) |
| ORM | **Prisma** |
| Autenticación | **Auth.js (NextAuth v5)** con proveedor Credentials (email + contraseña) y adaptador Prisma; sesiones JWT con `role` en el token |
| Hash de contraseñas | **bcryptjs** (o argon2) |
| Almacenamiento de CV | **Supabase Storage** (bucket **privado** `cvs`) con URLs firmadas temporales. Alternativa: AWS S3 |
| Correos | **Resend** + **React Email** |
| Validación de archivos | Solo `application/pdf` y `.docx`, máx. **5 MB** |
| Testing | **Vitest** (unit) + **Playwright** (e2e de flujos críticos) |
| Calidad | ESLint + Prettier |
| Package manager | **pnpm** |
| Deploy | **Vercel** (app) + Supabase/Neon (BD y storage) |

**Mutaciones:** usar **Server Actions** para formularios internos. Usar **Route Handlers** (`app/api/...`) solo cuando haga falta (descarga de CV, webhooks, endpoints de Auth.js).

---

## 3. Roles y permisos

| Rol | Permisos |
|---|---|
| `CANDIDATE` | Gestionar su perfil y CV, aplicar a vacantes activas, ver sus postulaciones y su estado |
| `COMPANY` | Gestionar perfil de empresa, CRUD de **sus** vacantes, ver postulantes de **sus** vacantes, cambiar estado de postulaciones, descargar CV de **sus** postulantes |
| `ADMIN` (fase 3) | Verificar empresas, moderar vacantes, ver todo |

**Reglas de autorización (obligatorias en el servidor, nunca solo en UI):**
- Toda Server Action / Route Handler valida sesión **y** rol **y** pertenencia del recurso.
- Una empresa solo accede a vacantes donde `job.companyId === session.companyId`.
- Un candidato solo accede a postulaciones donde `application.candidateId === session.candidateId`.
- El CV solo se entrega mediante URL firmada (expira en ~5 min) al candidato dueño o a la empresa dueña de la vacante a la que aplicó.

---

## 4. Modelo de datos (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CANDIDATE
  COMPANY
  ADMIN
}

enum JobStatus {
  DRAFT
  ACTIVE
  PAUSED
  CLOSED
}

enum WorkMode {
  ONSITE
  REMOTE
  HYBRID
}

enum EmploymentType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
}

enum ApplicationStatus {
  SUBMITTED
  VIEWED
  IN_PROCESS
  REJECTED
  HIRED
}

model User {
  id            String     @id @default(cuid())
  email         String     @unique
  passwordHash  String
  role          Role
  emailVerified DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  candidate     Candidate?
  company       Company?
}

model Candidate {
  id           String        @id @default(cuid())
  userId       String        @unique
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName     String
  phone        String
  city         String?
  headline     String?       // ej. "Desarrollador Frontend"
  cvPath       String?       // ruta en el bucket privado, NO URL pública
  cvFileName   String?
  cvUpdatedAt  DateTime?
  applications Application[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Company {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  slug        String   @unique
  description String?
  logoUrl     String?
  website     String?
  location    String?
  verified    Boolean  @default(false)
  jobs        Job[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Job {
  id             String         @id @default(cuid())
  companyId      String
  company        Company        @relation(fields: [companyId], references: [id], onDelete: Cascade)
  title          String
  slug           String
  description    String         // texto/markdown
  requirements   String
  location       String?
  workMode       WorkMode
  employmentType EmploymentType
  salaryMin      Int?
  salaryMax      Int?
  currency       String         @default("MXN")
  status         JobStatus      @default(DRAFT)
  publishedAt    DateTime?
  closedAt       DateTime?
  applications   Application[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  @@unique([companyId, slug])
  @@index([status, publishedAt])
}

model Application {
  id          String            @id @default(cuid())
  jobId       String
  job         Job               @relation(fields: [jobId], references: [id], onDelete: Cascade)
  candidateId String
  candidate   Candidate         @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  // Snapshot de los datos al momento de aplicar (no cambian si el candidato edita su perfil)
  fullName    String
  email       String
  phone       String
  cvPath      String            // copia del archivo del CV en el momento de aplicar
  message     String?           // mensaje opcional / carta de presentación
  status      ApplicationStatus @default(SUBMITTED)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@unique([jobId, candidateId]) // no se puede aplicar dos veces a la misma vacante
  @@index([jobId, status])
}
```

**Decisión clave:** `Application` guarda un **snapshot** (nombre, correo, teléfono y una **copia** del CV en `applications/{applicationId}/cv.pdf`). Así la empresa siempre ve lo que recibió, aunque el candidato actualice su perfil después.

---

## 5. Flujos

### 5.1 Registro y login
```
/registro → elegir tipo de cuenta: [Busco empleo] [Soy empresa]
  → email + contraseña (+ aceptar aviso de privacidad)
  → crear User con role
  → crear registro vacío Candidate o Company
  → iniciar sesión
  → redirigir a onboarding:
       CANDIDATE → /candidato/perfil   (nombre, teléfono, ciudad, CV)
       COMPANY   → /empresa/perfil     (nombre empresa, descripción, ubicación, logo)
```
- El middleware protege `/candidato/*` (solo CANDIDATE) y `/empresa/*` (solo COMPANY).
- Si el perfil está incompleto, redirigir a onboarding.
- Fase 2: verificación de correo con token.

### 5.2 Candidato aplica a una vacante
```
/vacantes (público) → /vacantes/[id] (detalle público)
  → clic "Aplicar"
     ├─ sin sesión          → /login?callbackUrl=/vacantes/[id]
     ├─ sesión COMPANY      → mensaje "Solo candidatos pueden aplicar"
     ├─ perfil/CV incompleto → /candidato/perfil?next=/vacantes/[id]
     ├─ ya aplicó           → botón deshabilitado "Ya aplicaste" + link a Mis postulaciones
     └─ OK → modal de confirmación:
              muestra nombre, correo, teléfono y CV actual
              campo opcional "Mensaje para la empresa"
              [Enviar postulación]
  → Server Action applyToJob(jobId, message):
       1. validar sesión + rol CANDIDATE
       2. validar que Job.status === ACTIVE
       3. validar perfil completo y CV existente
       4. copiar CV a applications/{id}/...
       5. crear Application con snapshot (en transacción; manejar error P2002 = ya aplicó)
       6. enviar correo de confirmación al candidato
       7. enviar correo de "nuevo postulante" a la empresa
  → toast de éxito → /candidato/postulaciones
```

### 5.3 Empresa publica una vacante
```
/empresa/vacantes → [Nueva vacante]
  → /empresa/vacantes/nueva (formulario validado con zod)
  → Guardar como borrador (DRAFT) o Publicar (ACTIVE, publishedAt = now)
  → /empresa/vacantes muestra tabla: título, estado, # postulantes, fecha, acciones
  → Acciones: editar, pausar/reactivar, cerrar, ver postulantes
```
- Solo las vacantes `ACTIVE` aparecen en el listado público y aceptan postulaciones.

### 5.4 Empresa revisa postulantes
```
/empresa/vacantes/[id]/postulantes
  → tabla: nombre, correo, teléfono, fecha, estado, [Ver CV]
  → filtros por estado
  → al abrir el detalle de una postulación con estado SUBMITTED → pasa a VIEWED
  → cambiar estado: IN_PROCESS / REJECTED / HIRED
  → [Ver CV] → GET /api/applications/[id]/cv → valida pertenencia → redirige a URL firmada
  → (fase 2) correo al candidato cuando cambia su estado
  → (fase 2) exportar postulantes a CSV
```

### 5.5 Candidato da seguimiento
```
/candidato/postulaciones → lista: vacante, empresa, fecha, estado (badge)
```

---

## 6. Rutas y pantallas (App Router)

```
src/app/
├─ (public)/
│  ├─ page.tsx                         # Landing + vacantes recientes
│  ├─ vacantes/page.tsx                # Listado con búsqueda y filtros (?q=&ciudad=&modalidad=&page=)
│  ├─ vacantes/[id]/page.tsx           # Detalle + botón Aplicar
│  ├─ empresas/[slug]/page.tsx         # Perfil público de empresa + sus vacantes
│  ├─ login/page.tsx
│  ├─ registro/page.tsx
│  └─ privacidad/page.tsx              # Aviso de privacidad
├─ candidato/
│  ├─ layout.tsx                       # Guard de rol CANDIDATE
│  ├─ perfil/page.tsx                  # Datos de contacto + subida de CV
│  └─ postulaciones/page.tsx
├─ empresa/
│  ├─ layout.tsx                       # Guard de rol COMPANY
│  ├─ page.tsx                         # Dashboard (métricas básicas)
│  ├─ perfil/page.tsx
│  ├─ vacantes/page.tsx
│  ├─ vacantes/nueva/page.tsx
│  ├─ vacantes/[id]/editar/page.tsx
│  └─ vacantes/[id]/postulantes/page.tsx
└─ api/
   ├─ auth/[...nextauth]/route.ts
   ├─ candidate/cv/route.ts            # GET URL firmada del CV propio
   └─ applications/[id]/cv/route.ts    # GET URL firmada (empresa dueña o candidato dueño)
```

---

## 7. Estructura de carpetas

```
.
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts                 # datos demo: 2 empresas, 10 vacantes, 3 candidatos
├─ src/
│  ├─ app/                    # rutas (ver sección 6)
│  ├─ components/
│  │  ├─ ui/                  # shadcn/ui
│  │  ├─ jobs/                # JobCard, JobFilters, JobForm, ApplyButton, ApplyDialog
│  │  ├─ applications/        # ApplicantsTable, StatusBadge, StatusSelect
│  │  └─ layout/              # Navbar, Footer, Sidebar
│  ├─ server/
│  │  ├─ actions/             # Server Actions: auth.ts, candidate.ts, company.ts, jobs.ts, applications.ts
│  │  ├─ queries/             # lecturas: jobs.ts, applications.ts
│  │  └─ services/            # storage.ts, email.ts
│  ├─ lib/
│  │  ├─ db.ts                # singleton de PrismaClient
│  │  ├─ auth.ts              # config de Auth.js
│  │  ├─ authz.ts             # requireRole(), requireCompanyOwnsJob(), etc.
│  │  ├─ validations/         # esquemas zod: auth, candidate, company, job, application
│  │  └─ utils.ts
│  ├─ emails/                 # plantillas React Email
│  └─ middleware.ts           # protección de rutas por rol
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ docker-compose.yml         # postgres local
├─ .env.example
└─ CLAUDE.md
```

---

## 8. Server Actions principales

| Acción | Rol | Descripción |
|---|---|---|
| `registerUser(data)` | público | Crea User + Candidate/Company vacío |
| `updateCandidateProfile(data)` | CANDIDATE | Nombre, teléfono, ciudad, headline |
| `uploadCv(formData)` | CANDIDATE | Valida tipo/tamaño, sube a `cvs/candidates/{candidateId}/...`, reemplaza el anterior |
| `updateCompanyProfile(data)` | COMPANY | Datos de la empresa, genera `slug` |
| `createJob(data)` / `updateJob(id, data)` | COMPANY | CRUD de vacantes propias |
| `setJobStatus(id, status)` | COMPANY | Publicar, pausar, cerrar |
| `applyToJob(jobId, message?)` | CANDIDATE | Ver flujo 5.2 |
| `setApplicationStatus(id, status)` | COMPANY | Solo de sus vacantes |

Todas las acciones:
1. Validan entrada con **zod**.
2. Llaman a un helper de `lib/authz.ts`.
3. Devuelven `{ ok: true, data } | { ok: false, error }` (sin lanzar errores hacia el cliente).
4. Ejecutan `revalidatePath` en las rutas afectadas.

---

## 9. Seguridad y privacidad

- Bucket de CV **privado**. Nunca guardar ni exponer URLs públicas, solo `cvPath`. Generar URL firmada al momento de descargar.
- Validar el archivo en el servidor por **MIME y extensión**, máx. 5 MB. Renombrar al subir (no confiar en el nombre original).
- Contraseñas con hash (bcrypt, cost ≥ 10). Política mínima: 8 caracteres.
- Rate limiting en login, registro y aplicar (fase 2; ej. Upstash Ratelimit).
- Nunca exponer correo/teléfono de candidatos en páginas públicas.
- **Aviso de privacidad** y checkbox de consentimiento en el registro (LFPDPPP, México).
- Permitir que el candidato elimine su cuenta: cascade de sus datos y borrado de archivos en storage.
- Variables sensibles solo del lado del servidor (`SUPABASE_SERVICE_ROLE_KEY` nunca en el cliente).

---

## 10. Variables de entorno (`.env.example`)

```bash
# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobboard"

# Auth.js
AUTH_SECRET=""                 # generar con: npx auth secret
AUTH_URL="http://localhost:3000"

# Supabase Storage
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""   # solo servidor
SUPABASE_CV_BUCKET="cvs"

# Correo
RESEND_API_KEY=""
EMAIL_FROM="Bolsa de Trabajo <no-reply@tudominio.com>"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 11. Comandos

```bash
pnpm install
docker compose up -d            # Postgres local
pnpm prisma migrate dev         # aplicar migraciones
pnpm prisma db seed             # datos demo
pnpm dev                        # http://localhost:3000
pnpm lint
pnpm test                       # Vitest
pnpm test:e2e                   # Playwright
```

---

## 12. Plan de desarrollo (seguir en orden)

### Fase 0 — Setup
- [ ] Crear proyecto Next.js con TypeScript, Tailwind, ESLint, `src/` y App Router (pnpm)
- [ ] Inicializar shadcn/ui y agregar componentes base (button, input, form, card, dialog, table, badge, select, toast/sonner)
- [ ] `docker-compose.yml` con Postgres
- [ ] Prisma con el schema de la sección 4 + primera migración + seed
- [ ] `.env.example` y `lib/db.ts`

### Fase 1 — MVP
- [ ] Auth.js con Credentials, registro con selección de rol, login/logout
- [ ] Middleware y guards por rol (`lib/authz.ts`)
- [ ] Onboarding y perfil de candidato + subida de CV a Supabase Storage
- [ ] Perfil de empresa
- [ ] CRUD de vacantes para empresa + cambio de estado
- [ ] Listado público de vacantes con búsqueda, filtros y paginación
- [ ] Detalle de vacante con botón Aplicar (todos los casos del flujo 5.2)
- [ ] `applyToJob` con snapshot y copia de CV
- [ ] Panel de postulantes por vacante + descarga de CV con URL firmada
- [ ] "Mis postulaciones" del candidato
- [ ] Tests e2e: registro candidato → aplicar; registro empresa → publicar → ver postulante

### Fase 2
- [ ] Correos transaccionales (confirmación, nuevo postulante, cambio de estado)
- [ ] Verificación de correo y recuperación de contraseña
- [ ] Cambios de estado de la postulación con notificación
- [ ] Dashboard de empresa (vistas, # postulantes por vacante)
- [ ] Exportar postulantes a CSV
- [ ] Rate limiting
- [ ] Eliminar cuenta (candidato)

### Fase 3
- [ ] Rol ADMIN: verificar empresas, moderar vacantes
- [ ] Alertas de vacantes por correo para candidatos
- [ ] Vacantes destacadas / planes de pago para empresas
- [ ] SEO: metadata dinámica y JSON-LD `JobPosting` en el detalle de vacante

---

## 13. Convenciones de código

- Código, nombres de variables, modelos y commits en **inglés**. Textos visibles al usuario en **español**.
- Componentes en PascalCase. Archivos de componentes en `kebab-case.tsx` (estilo shadcn).
- Server Components por defecto; `"use client"` solo cuando haya interactividad.
- No hacer consultas a Prisma desde componentes cliente; pasar por `server/queries` o `server/actions`.
- Esquemas zod en `lib/validations` reutilizados en el formulario (cliente) y en la acción (servidor).
- Manejar estados de carga, vacío y error en cada pantalla.
- UI responsiva (mobile first) y accesible (labels, focus visible, contraste).
- Commits pequeños por funcionalidad (Conventional Commits: `feat:`, `fix:`, `chore:`...).

---

## 14. Criterios de aceptación del MVP

1. Un visitante ve el listado y el detalle de vacantes activas sin iniciar sesión.
2. Un candidato se registra, completa nombre/teléfono, sube un PDF y aplica a una vacante.
3. El mismo candidato **no puede** aplicar dos veces a la misma vacante.
4. La empresa ve en el panel de esa vacante: nombre, correo, teléfono, fecha y puede descargar el CV.
5. Una empresa **no puede** ver postulantes ni CV de vacantes de otra empresa (probar accediendo por URL directa → 403/404).
6. Las vacantes pausadas o cerradas no aparecen en el listado público y no aceptan postulaciones.
7. El candidato ve sus postulaciones con el estado actual.
