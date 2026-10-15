# Conecta Empleo — Frontend (Next.js)

Bolsa de trabajo donde **las empresas publican vacantes** y **los candidatos registrados aplican con su CV**. Al aplicar, la empresa recibe el nombre, correo, teléfono y CV del candidato.

> **Estado actual:** frontend completo con **datos simulados** (sin backend). Todas las pantallas, formularios, validaciones, permisos por rol y pruebas funcionan. El acceso a la base de datos, la autenticación real, el almacenamiento de archivos y los correos todavía no están conectados. Para conectarlos, consulta [Conectar el backend](#conectar-el-backend).

La especificación completa del producto está en `CLAUDE.md`.

---

## Índice

1. [Stack](#stack)
2. [Requisitos](#requisitos)
3. [Instalación y ejecución](#instalación-y-ejecución)
4. [Cómo probar la app (roles simulados)](#cómo-probar-la-app-roles-simulados)
5. [Funcionamiento por rol](#funcionamiento-por-rol)
6. [Mapa de rutas](#mapa-de-rutas)
7. [Reglas de validación](#reglas-de-validación)
8. [Seguridad y permisos](#seguridad-y-permisos)
9. [Estructura del proyecto](#estructura-del-proyecto)
10. [Datos de demostración](#datos-de-demostración)
11. [Pruebas](#pruebas)
12. [Calidad de código y CI](#calidad-de-código-y-ci)
13. [Conectar el backend](#conectar-el-backend)
14. [Limitaciones conocidas](#limitaciones-conocidas)
15. [Convenciones](#convenciones)

---

## Stack

| Capa               | Tecnología                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Framework          | **Next.js 16** (App Router, Cache Components) + **React 19** + **TypeScript** (`strict`) |
| Estilos y UI       | **Tailwind CSS v4** + **shadcn/ui** (Radix) + **lucide-react**                           |
| Formularios        | **react-hook-form** + **zod v4** (los esquemas se comparten entre cliente y servidor)    |
| Notificaciones     | **sonner** (toasts)                                                                      |
| Tema               | **next-themes** (claro / oscuro / sistema)                                               |
| Contenido          | **react-markdown** (descripción de vacantes)                                             |
| Correos            | **React Email** (plantillas listas; el envío llegará con Resend)                         |
| Pruebas            | **Vitest** (unitarias) + **Playwright** (e2e) + **axe-core** (accesibilidad)             |
| Calidad            | ESLint + Prettier                                                                        |
| Gestor de paquetes | **pnpm** (workspace del monorepo)                                                        |

---

## Requisitos

- **Node.js 24** (≥ 24.14 y < 25)
- **pnpm 10.34.7** (si no está instalado, ejecuta `corepack enable`; la versión está fijada en el `package.json` de la raíz)
- Git

---

## Instalación y ejecución

Todos los comandos se ejecutan **desde la raíz del repositorio** (`conecta-empleo/`).

```bash
# 1. Instalar dependencias de todo el monorepo
pnpm install

# 2. Variables de entorno (opcional en esta fase)
cp apps/web-next/.env.example apps/web-next/.env.local

# 3. Levantar en modo desarrollo
pnpm dev:web-next            # http://localhost:3000
```

### Comandos disponibles

| Desde la raíz            | Equivalente dentro de `apps/web-next` | Qué hace                                                      |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------- |
| `pnpm dev:web-next`      | `pnpm dev`                            | Servidor de desarrollo en `:3000`                             |
| `pnpm build:web-next`    | `pnpm build`                          | Compilación de producción                                     |
| —                        | `pnpm start`                          | Sirve la compilación de producción                            |
| `pnpm test:web-next`     | `pnpm test`                           | Pruebas unitarias (Vitest)                                    |
| `pnpm test:e2e:web-next` | `pnpm test:e2e`                       | Pruebas e2e (Playwright), compila y levanta la app en `:3100` |
| —                        | `pnpm lint`                           | ESLint                                                        |
| —                        | `pnpm format` / `pnpm format:check`   | Prettier (escribe / solo verifica)                            |

Para ejecutar un comando de la app desde la raíz sin atajo, usa el filtro: `pnpm --filter @conecta/web-next <comando>`.

### Variables de entorno

| Variable              | Uso                                                              | Valor por defecto       |
| --------------------- | ---------------------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_APP_URL` | URL base para metadatos, URLs canónicas, `sitemap.xml` y JSON-LD | `http://localhost:3000` |

Las variables de base de datos, Auth.js, Supabase y Resend están documentadas en `CLAUDE.md` (sección 10) y se agregarán al conectar el backend. **Nunca subas `.env.local` al repositorio.**

---

## Cómo probar la app (roles simulados)

Como todavía no hay autenticación real, la sesión se simula con una cookie `mock_role`.

En **modo desarrollo**, el pie de página tiene un selector **"Vista previa como"** para cambiar de rol al instante:

| Rol simulado         | Quién eres                                            | Qué puedes probar                                                             |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Visitante**        | Sin sesión                                            | Ver vacantes y empresas; al aplicar te manda a `/login`                       |
| **Candidato**        | Ana López, perfil completo con CV y correo verificado | Aplicar, ver postulaciones, crear alertas                                     |
| **Candidato sin CV** | Ana López, perfil incompleto y correo sin verificar   | Onboarding, banner de verificación; al aplicar te manda a completar el perfil |
| **Empresa**          | Tecnologías Norte (`rh@tecnologiasnorte.mx`)          | Panel, perfil, vacantes, postulantes                                          |
| **Administrador**    | `admin@bolsadetrabajo.mx`                             | Verificar empresas, moderar vacantes                                          |

Los formularios también fijan el rol simulado al enviarse:

- **Login:** entra como candidato y vuelve a `callbackUrl`, o a `/vacantes` si no hay.
- **Registro:**
  - Como "Busco empleo", queda como candidato sin CV y va a `/candidato/perfil`.
  - Como "Soy empresa", va a `/empresa/perfil`.

> El selector **solo aparece en desarrollo** (`pnpm dev`). En producción (`pnpm start`) no se muestra.

**Simular un error de límite de intentos:** usa cualquier correo que termine en `@ratelimit.test` en login, registro o recuperación de contraseña. Verás el mensaje "Demasiados intentos" con el tiempo de espera.

**Los cambios no se guardan:** todo vive en memoria. Al recargar la página, los datos vuelven a su estado inicial.

---

## Funcionamiento por rol

### Visitante (sin sesión)

- **Inicio (`/`)**: presentación y vacantes recientes. Las destacadas aparecen primero.
- **Vacantes (`/vacantes`)**:
  - Búsqueda por texto y filtros por ciudad y modalidad (presencial, remoto o híbrido), con paginación.
  - Los filtros viven en la URL (`?q=&ciudad=&modalidad=&page=`), así que se pueden compartir.
  - Solo se listan vacantes **activas**.
- **Detalle (`/vacantes/[id]`)**:
  - Descripción en Markdown, requisitos, salario, modalidad y empresa.
  - Incluye metadatos SEO y JSON-LD `JobPosting`.
  - Una vacante pausada, cerrada o en borrador muestra la página 404.
- **Empresa (`/empresas/[slug]`)**: perfil público con sus vacantes activas e insignia de verificada.
- **Planes (`/planes`)**: plan Básico y Vacante destacada. Los precios son de ejemplo.
- **Cuenta**: `/registro`, `/login`, `/recuperar`, `/recuperar/nueva?token=…`, `/verificar?token=…`. El aviso de privacidad (LFPDPPP) está en `/privacidad`.

### Botón "Aplicar" — todos los casos

| Situación                         | Resultado                                                                                                                                    |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Sin sesión                        | Redirige a `/login?callbackUrl=/vacantes/[id]`                                                                                               |
| Sesión de empresa o administrador | Mensaje "Solo candidatos pueden aplicar a vacantes."                                                                                         |
| Perfil o CV incompleto            | Redirige a `/candidato/perfil?next=/vacantes/[id]`                                                                                           |
| Ya aplicó                         | Botón deshabilitado "Ya aplicaste" + enlace a Mis postulaciones                                                                              |
| Todo correcto                     | Modal con nombre, correo, teléfono y CV actual, más un mensaje opcional (máx. 1000 caracteres) → toast de éxito → `/candidato/postulaciones` |

### Candidato (`/candidato/*`)

- **Perfil (`/candidato/perfil`)**:
  - Datos de contacto: nombre, teléfono, ciudad y titular.
  - **Subida de CV** (PDF o DOCX, máx. 5 MB), con un botón para ver el CV actual.
  - Sección para **eliminar la cuenta**, que exige escribir `ELIMINAR` para confirmar.
- **Postulaciones (`/candidato/postulaciones`)**: lista con vacante, empresa, fecha y estado (Enviada, Vista, En proceso, Rechazada, Contratada).
- **Alertas (`/candidato/alertas`)**:
  - Búsquedas guardadas con frecuencia diaria o semanal; se puede cambiar la frecuencia o eliminar la alerta.
  - Las alertas se crean con el botón **"Crear alerta"** en `/vacantes`, que guarda los filtros actuales.
- Si el correo no está verificado, se muestra un banner con la opción de **reenviar el correo de verificación**.

### Empresa (`/empresa/*`)

- **Panel (`/empresa`)**:
  - Métricas: vacantes activas, postulantes totales y postulantes nuevos.
  - Postulantes por vacante y los postulantes más recientes.
- **Perfil (`/empresa/perfil`)**: nombre, descripción, ubicación, sitio web y **logo** (PNG, JPG o WebP, máx. 2 MB). Incluye una vista previa de la URL pública (`/empresas/[slug]`).
- **Vacantes (`/empresa/vacantes`)**:
  - Tabla con título, estado, número de postulantes, fecha y acciones.
  - Acciones: editar, publicar, pausar, reactivar, cerrar, ver postulantes y destacar (lleva a `/planes`).
- **Nueva o editar vacante**: formulario validado. Puedes **guardar como borrador** o **publicar**.
- **Postulantes (`/empresa/vacantes/[id]/postulantes`)**:
  - Tabla con nombre, correo, teléfono, fecha, estado y botón **Ver CV**.
  - Filtros por estado y cambio de estado (En proceso, Rechazada, Contratada).
  - **Exportación a CSV**: compatible con Excel y protegida contra inyección de fórmulas.
- Una empresa **solo** ve sus propias vacantes. Si abre por URL una vacante de otra empresa, obtiene la página 404.

### Administrador (`/admin/*`)

- **Empresas (`/admin`)**: verificar empresas o retirarles la verificación. La insignia se muestra en sus vacantes.
- **Moderación (`/admin/vacantes`)**:
  - Muestra todas las vacantes con filtros por estado.
  - **Despublicar** una vacante exige un motivo de al menos 10 caracteres y la deja en estado **Pausada**.

### Estados de una vacante

```
DRAFT (Borrador) ──publicar──▶ ACTIVE (Activa) ◀──reactivar── PAUSED (Pausada)
                                 │   └────────pausar──────────▶
                                 └──cerrar──▶ CLOSED (Cerrada)
```

Solo las vacantes **ACTIVE** aparecen en el sitio público y aceptan postulaciones.

### Transversal

- **Tema** claro, oscuro o del sistema (botón en la barra superior).
- **Diseño responsivo**: en móvil, la navegación pasa a un menú lateral.
- **Estados de carga, vacío y error en cada pantalla**: esqueletos de carga, mensajes de "sin resultados", `error.tsx` con reintento y una página 404 propia.
- **Plantillas de correo** en `src/emails/`:
  - Confirmación de postulación.
  - Nuevo postulante (nunca adjunta el CV, solo un enlace al panel).
  - Cambio de estado de la postulación.

---

## Mapa de rutas

| Ruta                                 | Acceso          | Descripción                                  |
| ------------------------------------ | --------------- | -------------------------------------------- |
| `/`                                  | Público         | Inicio y vacantes recientes                  |
| `/vacantes`                          | Público         | Listado con búsqueda, filtros y paginación   |
| `/vacantes/[id]`                     | Público         | Detalle y botón Aplicar                      |
| `/empresas/[slug]`                   | Público         | Perfil público de empresa                    |
| `/planes`                            | Público         | Planes para empresas                         |
| `/login`, `/registro`                | Público         | Acceso y creación de cuenta                  |
| `/recuperar`, `/recuperar/nueva`     | Público         | Recuperación de contraseña                   |
| `/verificar`                         | Público         | Verificación de correo                       |
| `/privacidad`                        | Público         | Aviso de privacidad                          |
| `/candidato/perfil`                  | Candidato       | Perfil, CV y eliminar cuenta                 |
| `/candidato/postulaciones`           | Candidato       | Mis postulaciones                            |
| `/candidato/alertas`                 | Candidato       | Mis alertas de vacantes                      |
| `/empresa`                           | Empresa         | Panel con métricas                           |
| `/empresa/perfil`                    | Empresa         | Perfil de la empresa                         |
| `/empresa/vacantes`                  | Empresa         | Gestión de vacantes                          |
| `/empresa/vacantes/nueva`            | Empresa         | Crear vacante                                |
| `/empresa/vacantes/[id]/editar`      | Empresa (dueña) | Editar vacante                               |
| `/empresa/vacantes/[id]/postulantes` | Empresa (dueña) | Postulantes de la vacante                    |
| `/admin`                             | Administrador   | Verificación de empresas                     |
| `/admin/vacantes`                    | Administrador   | Moderación de vacantes                       |
| `/sitemap.xml`, `/robots.txt`        | Público         | SEO; `robots.txt` excluye las áreas privadas |

---

## Reglas de validación

Los esquemas están en `src/lib/validations/` y se reutilizarán en el servidor.

| Campo                 | Regla                                                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Contraseña (registro) | Mínimo 8 caracteres; la confirmación debe coincidir                                                                           |
| Registro              | Hay que elegir el tipo de cuenta y aceptar el aviso de privacidad                                                             |
| Nombre del candidato  | 3 a 100 caracteres                                                                                                            |
| Teléfono              | Solo números, espacios, `()`, `+` y `-`; de 10 a 13 dígitos                                                                   |
| CV                    | **PDF o DOCX**, se valida por extensión **y** tipo MIME, máx. **5 MB**                                                        |
| Logo                  | PNG, JPG o WebP, máx. 2 MB                                                                                                    |
| Vacante               | Título de 3 a 120 caracteres, descripción de 20 a 5000, requisitos de 10 a 5000; el salario mínimo no puede superar al máximo |
| Mensaje al aplicar    | Opcional, máx. 1000 caracteres                                                                                                |
| Motivo de moderación  | Mínimo 10 caracteres                                                                                                          |

---

## Seguridad y permisos

La autorización se valida en varias capas, nunca solo en la interfaz:

1. **`src/proxy.ts`** (el antiguo `middleware.ts` en Next.js 16):
   - Protege `/candidato/*`, `/empresa/*` y `/admin/*` por rol.
   - Un visitante va a `/login?callbackUrl=…`; un rol incorrecto vuelve a `/`.
2. **Guards en cada página** (`src/lib/authz.ts`): `requireCandidate`, `requireCompany` y `requireAdmin`.
3. **Consultas filtradas por dueño** (`src/server/queries/*`): una empresa solo obtiene vacantes donde `job.companyId === session.companyId`; si no, la página es 404.

Otras medidas ya aplicadas en el frontend:

- **Contacto de candidatos:** el correo y el teléfono nunca se muestran en páginas públicas.
- **Redirecciones:** `callbackUrl` y `next` se sanean para evitar redirecciones abiertas (`src/lib/safe-redirect.ts`).
- **CSV:** escapa fórmulas para evitar inyección en Excel (`src/lib/csv.ts`).
- **JSON-LD:** se serializa escapando `<` para evitar XSS.
- **Errores de las acciones:** siguen el contrato `{ ok: true, data } | { ok: false, error: { code, retryAfterSeconds? } }`, con mensajes en español.

---

## Estructura del proyecto

```
apps/web-next/
├─ src/
│  ├─ app/
│  │  ├─ (public)/          # páginas públicas, login, registro, recuperar, verificar, planes, privacidad
│  │  ├─ candidato/         # área del candidato (layout con navegación por secciones)
│  │  ├─ empresa/           # área de la empresa
│  │  ├─ admin/             # área de administración
│  │  ├─ error.tsx, global-error.tsx, not-found.tsx
│  │  ├─ sitemap.ts, robots.ts
│  │  └─ layout.tsx, globals.css
│  ├─ components/
│  │  ├─ ui/                # shadcn/ui (generado; no se formatea con Prettier)
│  │  ├─ layout/            # Navbar, Footer, menú móvil, menú de usuario, selector de rol
│  │  ├─ jobs/              # JobCard, JobFilters, JobForm, ApplyButton, ApplyDialog, alertas
│  │  ├─ applications/      # ApplicantsTable, StatusBadge, StatusSelect
│  │  ├─ candidate/         # perfil, CV, alertas, eliminar cuenta
│  │  ├─ company/           # perfil, logo, tabla de vacantes
│  │  ├─ admin/             # tablas de administración
│  │  └─ auth/              # formularios de acceso, registro, recuperación y verificación
│  ├─ server/queries/       # lecturas (jobs, candidate, company, admin), hoy con datos simulados
│  ├─ lib/
│  │  ├─ types.ts           # tipos del dominio (alineados con el schema Prisma)
│  │  ├─ mock-data.ts       # datos de demostración
│  │  ├─ mock-session.ts    # sesión simulada (cookie mock_role)
│  │  ├─ authz.ts           # guards por rol
│  │  ├─ validations/       # esquemas zod
│  │  ├─ seo/               # JSON-LD JobPosting
│  │  └─ constants.ts, format.ts, csv.ts, safe-redirect.ts, action-result.ts, …
│  ├─ emails/               # plantillas React Email
│  └─ proxy.ts              # protección de rutas por rol
├─ tests/
│  ├─ unit/                 # Vitest
│  └─ e2e/                  # Playwright (incluye accesibilidad con axe)
├─ playwright.config.ts, vitest.config.ts
├─ .env.example, .prettierrc.json, .prettierignore
└─ package.json
```

---

## Datos de demostración

Definidos en `src/lib/mock-data.ts`, con las mismas cantidades que pide el seed de `CLAUDE.md`:

- **2 empresas:**
  - **Tecnologías Norte**: verificada, vacantes `job_1` a `job_5`.
  - **Café La Esquina**: vacantes `job_6` a `job_10`.
- **10 vacantes:**
  - `job_5` está pausada, `job_9` cerrada y `job_10` en borrador.
  - `job_1` y `job_6` están destacadas.
- **3 candidatos:** Ana López, Luis Hernández y Sofía Ramírez.
- **7 postulaciones** con distintos estados.
- **2 alertas** de vacantes de Ana López.

---

## Pruebas

```bash
pnpm test:web-next        # unitarias
pnpm test:e2e:web-next    # e2e
```

La primera vez, instala el navegador de Playwright:

```bash
pnpm --filter @conecta/web-next exec playwright install chromium
```

- **Unitarias (Vitest, `tests/unit/`)**: validaciones, utilidades (formatos, CSV, redirecciones seguras, parámetros de búsqueda), JSON-LD y plantillas de correo.
- **E2E (Playwright, `tests/e2e/`)**:
  - Corren contra una **compilación de producción** en el puerto **3100**, en escritorio y móvil.
  - Cubren los flujos públicos, del candidato, de la empresa y de administración, los permisos por rol (incluido el acceso a vacantes de otra empresa por URL directa), las alertas y las vacantes destacadas.
- **Accesibilidad (`a11y.spec.ts`)**: revisa WCAG 2.1 A/AA con axe en las páginas principales, en tema claro y oscuro.

Opciones útiles:

```bash
# Usar un servidor que ya está corriendo
E2E_BASE_URL=http://localhost:3000 pnpm --filter @conecta/web-next test:e2e

# Cambiar el puerto del servidor de pruebas
E2E_PORT=3200 pnpm --filter @conecta/web-next test:e2e

# Correr un solo archivo
pnpm --filter @conecta/web-next exec playwright test tests/e2e/candidate.spec.ts
```

En las pruebas, el inicio de sesión se simula con `loginAs(context, "CANDIDATE", baseURL)` de `tests/e2e/helpers.ts`.

---

## Calidad de código y CI

```bash
cd apps/web-next
pnpm lint
pnpm format:check
pnpm exec next typegen && pnpm exec tsc --noEmit
```

- **Prettier:** sin punto y coma, comillas dobles y ancho de 100. Ignora `src/components/ui/`, `CLAUDE.md` y los artefactos de pruebas.
- **CI:** `docs/ci.example.yml` (en la raíz del repo) incluye el job `web-next`, que corre formato, lint, tipos, pruebas unitarias y e2e, y sube los reportes si algo falla. Para activarlo, copia el archivo a `.github/workflows/ci.yml` con una credencial que tenga permiso `workflow`.

---

## Conectar el backend

El frontend está preparado para reemplazar las piezas simuladas sin cambiar las pantallas:

| Pieza simulada                                                        | Reemplazo previsto                                                                                                        |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/mock-session.ts` (cookie `mock_role`)                        | `auth()` de **Auth.js v5** con Credentials y `role` en el JWT                                                             |
| `src/server/queries/*` sobre `mock-data.ts`                           | Consultas **Prisma** con las mismas firmas                                                                                |
| Acciones simuladas en los componentes (`setTimeout` + `console.info`) | **Server Actions** en `src/server/actions/*` que devuelven `ActionResult`                                                 |
| Botón "Ver CV"                                                        | Route Handlers `GET /api/candidate/cv` y `GET /api/applications/[id]/cv` con **URL firmada** de Supabase Storage (≈5 min) |
| Plantillas de `src/emails/`                                           | Envío con **Resend**                                                                                                      |
| `@ratelimit.test`                                                     | Rate limiting real (p. ej. Upstash)                                                                                       |
| Selector "Vista previa como"                                          | Eliminar al tener sesiones reales                                                                                         |

Para encontrar cada punto de integración, busca en el código:

```bash
grep -rn "TODO(backend)\|TODO(auth)" src
```

Hay unos 30 marcadores. Cada uno dice qué Server Action o endpoint va ahí: `applyToJob`, `uploadCv`, `createJob`, `setJobStatus`, `setApplicationStatus`, `moderateJob`, `createJobAlert`, `deleteCandidateAccount`, entre otros.

**Antes de conectar**, hay dos pendientes con el equipo:

- **`packages/contracts`** usa roles (`candidate` y `employer`) y estados distintos a los de `CLAUDE.md`. Hay que decidir cuál es la fuente de verdad.
- La rama **`codex/database-jws-auth`** ya trabaja Supabase y JWT. Conviene revisarla para no duplicar esfuerzo.

---

## Limitaciones conocidas

- **Persistencia:** los datos no se guardan; al recargar, todo vuelve al estado inicial.
- **Funciones que dependen del backend:**
  - El envío de correos (verificación, recuperación, notificaciones y alertas).
  - La subida real de archivos.
  - Los pagos de "Vacante destacada".
- **Código HTTP de las páginas no encontradas:** con streaming, una página inexistente muestra el 404 y se marca `noindex`, pero responde HTTP 200. El estado real llegará con las consultas a la base de datos.
- **Selector de rol:** el selector "Vista previa como" solo existe en desarrollo.

---

## Convenciones

- **Idiomas:** código, nombres y commits en **inglés**; textos visibles en **español (México)**.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`).
- **Componentes:** en PascalCase, en archivos `kebab-case.tsx`. Son Server Components por defecto; usa `"use client"` solo cuando haya interactividad.
- **Lecturas de datos:** sin consultas desde componentes cliente; las lecturas pasan por `src/server/queries`.
- **Requisitos de UI:** cada pantalla maneja los estados de carga, vacío y error, es responsiva (mobile first) y accesible (labels, foco visible, contraste AA).
