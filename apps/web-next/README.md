# @conecta/web-next

Propuesta de frontend en **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui (Radix)**.

**Estado:** registro, login, logout y perfil conectados a `apps/api`, con correo/contraseña y JWT/JWS en cookie HttpOnly, sin OAuth. El catálogo de vacantes conserva los datos de demostración de la propuesta original; las postulaciones todavía no se envían.

## Ejecutar

Desde la raíz del repositorio:

```bash
pnpm install
pnpm dev:web-next      # http://localhost:3000
pnpm build:web-next
pnpm test:web-next     # pruebas unitarias (Vitest)
pnpm test:e2e:web-next # pruebas e2e (Playwright), compila y levanta la app en :3100
```

La primera vez, instala el navegador de Playwright con `pnpm --filter @conecta/web-next exec playwright install chromium`.

Variables de entorno: copia `apps/web-next/.env.example` a `apps/web-next/.env.local`.

Ejecutar también `pnpm dev:api` con PostgreSQL y `apps/api/.env` configurados. Ver [Supabase y autenticación](../../docs/SUPABASE.md). El selector de roles simulados fue retirado: la sesión y el rol se verifican en el servidor.

## Pantallas incluidas

- `/`: landing de presentación (GSAP + Lenis) con vacantes reales, búsqueda y accesos a registro/login; usa su propio nav y footer (`src/components/landing/`, `SiteChrome` oculta los globales)
- `/vacantes`: listado con búsqueda, filtros (`?q=&ciudad=&modalidad=&page=`) y paginación, con el mismo shell isleño de la landing (palmeras, mar, nav de píldoras)
- `/vacantes/[id]`: detalle con botón Aplicar y todos sus estados, metadatos y JSON-LD `JobPosting`
- `/empresas/[slug]`: perfil público de empresa
- `/login`, `/registro`, `/recuperar`, `/recuperar/nueva?token=`, `/privacidad`
- `/candidato/perfil`, `/empresa/perfil`: perfil persistente en la API y acceso por rol
- `/candidato/postulaciones`: postulaciones con su estado (datos de demostración)
- `/empresa`: panel con métricas y postulantes recientes (datos de demostración)
- `/empresa/vacantes`, `/empresa/vacantes/nueva`, `/empresa/vacantes/[id]/editar`: gestión de vacantes (datos de demostración)
- `/empresa/vacantes/[id]/postulantes`: postulantes con filtros, cambio de estado y exportación a CSV (datos de demostración)

Las páginas de error (`error.tsx`, `global-error.tsx`) y 404 (`not-found.tsx`) están en `src/app/`.

## Dónde conectar el backend

- `src/server/queries/*`: lecturas. Hoy usan `src/lib/mock-data.ts`.
- `src/lib/session.ts`: verificación de la sesión real contra la API, sin caché de identidad.
- Busca `TODO(backend)` y `TODO(auth)` en el código.

## Diferencias con `packages/contracts`

`CLAUDE.md` conserva la propuesta original para funciones futuras. Identidad/perfil ya se alinearon con `packages/contracts`: `CANDIDATE` ↔ `candidate`, `COMPANY` ↔ `employer`, y CV mediante enlace HTTPS. Las diferencias del catálogo y de las postulaciones se resolverán cuando se integren esos módulos; no duplicar la autenticación con Prisma/Auth.js.
