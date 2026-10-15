# Conecta Empleo

Tablero de empleo donde las empresas podrán publicar vacantes y los candidatos podrán postularse y consultar su proceso.

**Estado: base inicial para desarrollo colaborativo.** Incluye frontend ejecutable, API modular, contratos compartidos, esquema de datos propuesto y especificaciones. El registro, las vacantes y las postulaciones **todavía no están implementados**; sus rutas responden `501 NOT_IMPLEMENTED`.

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
- La base actual no necesita base de datos; PostgreSQL se integrará en las tareas de persistencia.
- Variables futuras documentadas en `apps/api/.env.example`; copiar a `apps/api/.env` cuando sean necesarias. No subir secretos.

```bash
pnpm test
pnpm build
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
