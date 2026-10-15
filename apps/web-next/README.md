# @conecta/web-next

Propuesta de frontend en **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui (Radix)**.

**Estado:** registro, login, logout y perfil conectados a `apps/api`, con correo/contraseña y JWT/JWS en cookie HttpOnly, sin OAuth. El catálogo de vacantes conserva los datos de demostración de la propuesta original; las postulaciones todavía no se envían.

## Ejecutar

Desde la raíz del repositorio:

```bash
pnpm install
pnpm dev:web-next      # http://localhost:3000
pnpm build:web-next
```

Ejecutar también `pnpm dev:api` con PostgreSQL y `apps/api/.env` configurados. Ver [Supabase y autenticación](../../docs/SUPABASE.md). El selector de roles simulados fue retirado: la sesión y el rol se verifican en el servidor.

## Pantallas incluidas

- `/`: landing con vacantes recientes
- `/vacantes`: listado con búsqueda, filtros (`?q=&ciudad=&modalidad=&page=`) y paginación
- `/vacantes/[id]`: detalle con botón Aplicar y todos sus estados
- `/empresas/[slug]`: perfil público de empresa
- `/login`, `/registro`, `/privacidad`
- `/candidato/perfil`, `/empresa/perfil`: perfil persistente y acceso por rol.

## Dónde conectar el backend

- `src/server/queries/*`: lecturas. Hoy usan `src/lib/mock-data.ts`.
- `src/lib/session.ts`: verificación de la sesión real contra la API, sin caché de identidad.
- Busca `TODO(backend)` y `TODO(auth)` en el código.

## Diferencias con `packages/contracts`

`CLAUDE.md` conserva la propuesta original para funciones futuras. Identidad/perfil ya se alinearon con `packages/contracts`: `CANDIDATE` ↔ `candidate`, `COMPANY` ↔ `employer`, y CV mediante enlace HTTPS. Las diferencias del catálogo y de las postulaciones se resolverán cuando se integren esos módulos; no duplicar la autenticación con Prisma/Auth.js.
