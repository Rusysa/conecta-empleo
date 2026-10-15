# Conecta Empleo

Tablero de empleo donde las empresas podrán publicar vacantes y los candidatos podrán postularse y consultar su proceso.

**Estado:** registro, acceso, cierre de sesión y perfil implementados sobre PostgreSQL/Supabase. El frontend Next.js de `apps/web-next` conserva el trabajo de `feat/web-nextjs-frontend` y consume la API real para identidad. Autenticación por correo y contraseña con JWT firmado mediante JWS (HS256), sin OAuth. Vacantes y postulaciones siguen pendientes en la API (`501`); el catálogo Next.js conserva datos de demostración y no envía postulaciones ficticias.

## Organización

```text
apps/
  web/                         # React + Vite: interfaz del usuario
    src/app/                   # Composición de pantallas
    src/features/              # auth, users, jobs, applications
    src/shared/                # Cliente HTTP, estilos y componentes comunes
  api/                         # Node.js + Express: servidor
    src/modules/
      auth/                    # Registro, acceso y sesiones
      users/                   # Perfil del usuario
      jobs/                    # Publicación y consulta de vacantes
      applications/            # Postulaciones y estados
    src/shared/                # Infraestructura transversal
    test/                      # Pruebas de integración
packages/contracts/            # Enumeraciones y contrato HTTP compartido
database/migrations/           # SQL propuesto para PostgreSQL
docs/                          # Producto, arquitectura y reparto del trabajo
.github/                       # Plantillas de colaboración
```

## Ejecutar la base

Requisitos: Node.js 24.14 o superior dentro de la versión 24, pnpm 10.34.7 y Git.

Si pnpm no está en el PATH, habilitarlo con `corepack enable`. La versión está fijada en `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev:api
```

En otra terminal:

```bash
pnpm dev:web
```

- Interfaz: `http://localhost:5173`.
- Salud de la API: `http://localhost:3001/api/v1/health`.
- Vite redirige `/api` al backend durante desarrollo.
- La API requiere PostgreSQL con las migraciones aplicadas y `apps/api/.env` configurado. Ver [configuración Supabase](docs/SUPABASE.md).
- Copiar `apps/api/.env.example` a `apps/api/.env` y generar `JWT_SECRET` aleatorio. No subir secretos.
- Para los formularios reales ejecutar `pnpm dev:web-next` y abrir `http://localhost:3000`; `dev:web` conserva el frontend Vite inicial.

```bash
pnpm test
pnpm build
pnpm build:web-next
pnpm --filter @conecta/web-next lint
pnpm db:check
```

El build genera `apps/web/dist`. No es un despliegue ni incluye el servidor API. Para producción se requiere servir frontend y `/api` bajo el mismo origen y completar los controles indicados en la documentación.

La configuración de CI está en `docs/ci.example.yml`. Para activarla, copiarla a `.github/workflows/ci.yml` usando una credencial de GitHub con permiso `workflow`. La credencial disponible al crear el repositorio no tiene ese permiso; las comprobaciones se ejecutaron localmente.

## Trabajar en equipo

1. Revisar [especificaciones](docs/SPECIFICATIONS.md) y [contrato HTTP](packages/contracts/HTTP.md).
2. Elegir una tarea del [plan de trabajo](docs/ROADMAP.md).
3. Crear una rama `feat/<modulo>-<tarea>` desde `main`.
4. Trabajar dentro del módulo asignado. Proponer cambios a contratos compartidos antes de consumirlos.
5. Abrir un pull request siguiendo [CONTRIBUTING.md](CONTRIBUTING.md).

El frontend puede avanzar con mocks del contrato mientras cada módulo del backend implementa sus rutas. Los módulos se conectan mediante servicios públicos; no acceden directamente a repositorios ajenos.

## Documentación

- [Producto y criterios de aceptación](docs/SPECIFICATIONS.md)
- [Arquitectura y límites de los módulos](docs/ARCHITECTURE.md)
- [Contrato de la API y estructuras de datos](packages/contracts/HTTP.md)
- [Tareas para trabajo simultáneo](docs/ROADMAP.md)
- [Despliegue y operación](docs/OPERATIONS.md)
- [Seguridad](SECURITY.md)

## Decisiones pendientes

Antes de una apertura pública: recuperación y verificación de correo, revisión de políticas de privacidad, moderación, retención de datos, proveedor de correo, alojamiento y licencia del proyecto. No se incluyen pagos, chat, carga de archivos ni recomendaciones automáticas en el MVP.
