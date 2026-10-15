# Plan de trabajo simultáneo

## Reparto sugerido

Los nombres de responsables se asignarán al integrar al equipo. No hay colaboradores invitados automáticamente.

| Frente | Carpetas principales | Primera entrega independiente |
| --- | --- | --- |
| A — Interfaz | `apps/web/src/features/` y `apps/web/src/app/` | Navegación, formularios y tablero con mocks en pruebas |
| B — Identidad | `apps/api/src/modules/auth/`, `users/` | Registro, login, sesiones, perfil y middleware público |
| C — Vacantes | `apps/api/src/modules/jobs/` | Repositorio, búsqueda, CRUD y estados |
| D — Postulaciones | `apps/api/src/modules/applications/` | Unicidad, consulta y transiciones |
| Integración rotativa | `packages/contracts/`, `database/`, `.github/` | Revisar contratos, migraciones y CI |

## Fase 0: fundamento — este repositorio

- [x] Separación frontend/backend/contratos.
- [x] Rutas reservadas por dominio con respuesta explícita 501.
- [x] Contrato HTTP, esquema SQL propuesto y permisos del producto.
- [x] Comandos de desarrollo, pruebas de la base y build del frontend.
- [x] Plantilla de CI y plantillas de issues/PRs.
- [ ] Activar Actions copiando `docs/ci.example.yml` a `.github/workflows/ci.yml` con permiso `workflow`.

## Fase 1: trabajo en paralelo

- [x] **PLAT-01** Cliente PostgreSQL, migraciones versionadas con Supabase CLI y proyecto remoto. Despliegues de migraciones serializados; no lanzar `db push` concurrente.
- [x] **AUTH-01** Registro y normalización de email; Argon2id. Email duplicado rechazado, hashes seguros, roles válidos y consentimiento registrado.
- [x] **AUTH-02** JWT/JWS con sesiones persistidas revocables, CSRF, límites de intentos y middleware de roles.
- [x] **USER-01** Perfil propio: consulta y edición, sin cambiar correo/rol ni editar cuentas ajenas. Fachada de creación pública para auth; consulta de candidatos para empleadores pendiente de APP-02.
- [ ] **JOB-01** Listado público, filtros, paginación y detalle. Aceptación: ningún borrador ajeno es visible.
- [ ] **JOB-02** Crear, editar, publicar, cerrar y reabrir. Aceptación: otro empleador recibe 404 al intentar modificar la vacante.
- [ ] **APP-01** Creación de candidatura y listado propio. Aceptación: duplicado o vacante cerrada devuelve 409.
- [ ] **APP-02** Consulta de candidatos, transiciones y retirada. Aceptación: permisos por autoría y máquina de estados comprobados.
- [x] **WEB-01** Next.js: registro, acceso, logout, navegación y perfil con estados de carga/error y API real.
- [ ] **WEB-02** Tablero, filtros y detalle de oferta.
- [ ] **WEB-03** Panel de empleador y postulaciones de candidato.

Los frentes B, C y D pueden implementar sus servicios y pruebas con dobles de las fachadas vecinas. La integración con persistencia depende de PLAT-01. El frontend puede trabajar desde el contrato sin esperar servicios completos.

## Fase 2: integración

- [ ] Conectar frontend a endpoints reales y sustituir todas las respuestas 501.
- [ ] Pruebas end-to-end: registro de ambos roles → publicar → postular → revisar → entrevista → contratar.
- [ ] Pruebas negativas: acceso cruzado, CSRF, duplicados, carrera entre cierre y postulación.
- [ ] Revisión de accesibilidad y pantallas móviles.

## Fase 3: lanzamiento

- [ ] Verificación de correo y recuperación de contraseña con tokens de un solo uso.
- [ ] Políticas de privacidad, retención y eliminación de cuenta; canal de soporte y moderación.
- [ ] Alojamiento, dominio, HTTPS, secretos, copias de seguridad y prueba de restauración.
- [ ] Revisión de seguridad, dependencias y carga realista; elegir licencia antes de abrir a contribuciones públicas.

## Definición de tarea terminada

Cumple criterios de aceptación, aplica permisos del servidor, añade pruebas de reglas de negocio, mantiene contrato/documentación sincronizados, pasa CI y tiene revisión de otra persona cuando haya equipo disponible.
