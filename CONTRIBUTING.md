# Contribuir

1. Elegir tarea de `docs/ROADMAP.md` y acordar quién es responsable del módulo.
2. Crear rama `feat/<modulo>-<tarea>`, `fix/<modulo>-<error>` o `docs/<tema>` desde `main` actualizado.
3. Cambiar sólo los archivos necesarios; coordinar contratos, migraciones y dependencias compartidas.
4. Ejecutar `pnpm install --frozen-lockfile`, `pnpm test` y `pnpm build` desde la raíz.
5. Abrir PR con problema, solución, verificación y dependencias de otros PRs.

## Convenciones

- JavaScript ES modules. Archivos y nombres de código en inglés; interfaz y documentación en español.
- Reglas de negocio en servicios; SQL en repositorios; entrada/salida HTTP en controladores.
- Commits breves: `feat(jobs): add published listing`.
- No subir `.env`, credenciales, datos reales, `node_modules` ni builds.
- Si otra persona modifica el lockfile, integrar su cambio y ejecutar `pnpm install` para regenerar; no resolverlo borrando secciones manualmente.
- Contratos primero: cualquier cambio a campos, enums o estados debe actualizar `packages/contracts` y sus consumidores.

La revisión por otra persona y la protección de `main` se recomiendan cuando el equipo esté incorporado. Esta inicialización no configura restricciones de ramas ni invita usuarios.
