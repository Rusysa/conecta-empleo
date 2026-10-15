# Arquitectura y límites de responsabilidad

## Decisión

Monorepo pnpm con aplicaciones independientes y contratos compartidos. Frontend React + Vite; backend Node.js + Express; persistencia prevista en PostgreSQL. Es un monolito modular: un despliegue de API y módulos separados por dominio, evitando infraestructura adicional en esta etapa.

```text
Navegador → apps/web → HTTP /api/v1 → apps/api → PostgreSQL
                 ↘ packages/contracts ↗
```

## Dependencias permitidas

- `apps/web` consume `packages/contracts` y la API HTTP. Nunca importa código de `apps/api`.
- `apps/api` consume `packages/contracts`. Nunca importa código de `apps/web`.
- `packages/contracts` contiene datos y contratos; no importa aplicaciones, React, Express, secretos ni acceso a la base.
- Cada módulo de API expone rutas y, cuando se implemente, una fachada de servicios. No importa repositorios internos de otro módulo.
- `shared/` sólo contiene infraestructura transversal; las reglas de vacantes o candidaturas permanecen en su módulo.

## Capas dentro de cada módulo de API

```text
modules/<dominio>/
  routes.js          # URL, método y middleware
  controller.js      # Entrada HTTP, respuesta y códigos de error
  validation.js      # Validación de datos de entrada
  service.js         # Reglas de negocio, permisos y transacciones
  repository.js      # Consultas parametrizadas; recibe conexión o transacción
  index.js           # Fachada pública entre módulos, cuando haga falta
```

En esta base existen las rutas y documentación de cada módulo; las demás capas se crean al implementar su primera tarea. Evitar archivos vacíos que aparenten lógica ya construida.

| Módulo | Dueño de datos | Responsabilidades | Interfaz para otros módulos |
| --- | --- | --- | --- |
| auth | hash de contraseña, sesiones | Registro, acceso, cierre, identidad autenticada, CSRF | Middleware `requireUser`, `requireRole` y usuario `{id, role}` |
| users | nombre, correo, biografía, URL del CV | Perfil propio y consulta limitada de candidato | `getCandidateSummary(id)`; nunca devolver hashes |
| jobs | vacantes | Autoría, búsqueda, publicación, cierre | `getPublishedJobForApplication(id, transaction)` y `assertJobOwner(id, userId, transaction)` |
| applications | postulaciones | Unicidad, retirada, transición de estado | Rutas del candidato y del empleador |

`auth` crea la cuenta y el perfil en una transacción mediante el servicio público de usuarios. `applications` consulta vacantes mediante la fachada de `jobs` y candidatos mediante la de `users`. Las fachadas aceptan una transacción compartida cuando la operación necesita atomicidad. La instancia de conexión se inyectará al construir módulos en `app.js`.

## Frontend por funcionalidad

Cada `src/features/<dominio>/` contiene sus componentes, hooks, adaptadores HTTP y pruebas. `src/app/` compone pantallas y navegación. `src/shared/` contiene controles reutilizables y el cliente HTTP. Crear mocks del contrato HTTP dentro de las pruebas del módulo; no introducir mocks en la ejecución de producción.

## Integración sin conflictos

- Frontend y API acuerdan primero el contrato en `packages/contracts/HTTP.md`.
- Quien cambia una estructura compartida incluye ejemplo y adaptación de consumidores en el mismo PR o coordina cambios compatibles.
- `pnpm-lock.yaml` se genera desde la raíz. No crear locks dentro de workspaces.
- Reservar cambios de `app.js`, dependencias raíz y migraciones compartidas para PRs pequeños de integración.
- Migraciones versionadas con prefijo temporal UTC: `YYYYMMDDHHMMSS_descripcion.sql`. Una migración ya aplicada se corrige con otra migración.
- Cambios incompatibles de rutas requieren una nueva versión de API; cambios aditivos pueden mantenerse en `/api/v1`.

## Fuentes técnicas

- [Express: recomendaciones de seguridad](https://expressjs.com/en/advanced/best-practice-security.html)
- [Express: sesiones y cookies](https://expressjs.com/en/resources/middleware/session.html)
- [pnpm workspaces](https://pnpm.io/workspaces)

Auth y perfil ya usan PostgreSQL mediante `pg`; las migraciones se aplican con Supabase CLI. Next.js consume `/api/v1` mediante un proxy del mismo origen y adapta los roles visuales `CANDIDATE`/`COMPANY` a `candidate`/`employer`. No hay una segunda base de usuarios en Prisma, Auth.js ni Supabase Auth. Los JWT firmados mediante JWS viven en cookies HttpOnly y las sesiones revocables en PostgreSQL. La propuesta histórica de `apps/web-next/CLAUDE.md` no sustituye estos contratos; los módulos de vacantes y postulaciones siguen pendientes.
