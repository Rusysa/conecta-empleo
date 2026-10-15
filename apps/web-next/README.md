# @conecta/web-next

Propuesta de frontend en **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui (Radix)**.

**Estado:** solo frontend, con datos simulados. No consume todavía la API de `apps/api`.

## Ejecutar

Desde la raíz del repositorio:

```bash
pnpm install
pnpm dev:web-next      # http://localhost:3000
pnpm build:web-next
```

En desarrollo, el pie de página incluye un selector **"Vista previa como"** para ver la interfaz como visitante, candidato (con o sin CV) o empresa.

## Pantallas incluidas

- `/`: landing con vacantes recientes
- `/vacantes`: listado con búsqueda, filtros (`?q=&ciudad=&modalidad=&page=`) y paginación
- `/vacantes/[id]`: detalle con botón Aplicar y todos sus estados
- `/empresas/[slug]`: perfil público de empresa
- `/login`, `/registro`, `/privacidad`

## Dónde conectar el backend

- `src/server/queries/*`: lecturas. Hoy usan `src/lib/mock-data.ts`.
- `src/lib/mock-session.ts`: sesión simulada con una cookie. Hay que reemplazarla por la sesión real.
- Busca `TODO(backend)` y `TODO(auth)` en el código.

## Diferencias con `packages/contracts`

`CLAUDE.md` describe un modelo propio (roles `CANDIDATE`/`COMPANY`, estados de postulación `SUBMITTED/VIEWED/IN_PROCESS/REJECTED/HIRED`, carga de CV). Hay que alinearlo con `packages/contracts` antes de conectar la API.
