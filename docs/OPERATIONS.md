# Operación y despliegue previsto

## Estado actual

La API y Next.js ya implementan identidad y perfil con PostgreSQL/Supabase. `pnpm test` verifica registro, login, CSRF, tokens, revocación, perfiles y restricciones SQL. El catálogo Next.js todavía es de demostración y las APIs de vacantes/postulaciones siguen pendientes. Configuración y comandos completos en [SUPABASE.md](SUPABASE.md).

CI se entrega como plantilla en `docs/ci.example.yml`; su activación en `.github/workflows/ci.yml` requiere una credencial con permiso `workflow`, ausente en la cuenta conectada durante la inicialización.

## Desarrollo

Instalar desde la raíz con `pnpm install --frozen-lockfile`. Ejecutar API y web en terminales independientes según el README. Los workspaces comparten un único lockfile. Node 24 es la versión de referencia de CI.

## Producción después de completar el MVP

1. Ejecutar CI con `pnpm install --frozen-lockfile`, `pnpm test` y `pnpm build`.
2. Provisionar PostgreSQL con usuario de privilegios mínimos y conexiones cifradas.
3. Ejecutar `pnpm db:check`, revisar `supabase db push --dry-run` y aplicar con `pnpm db:push` desde un único proceso de despliegue.
4. Configurar `JWT_SECRET`, `DATABASE_URL`, `DATABASE_SSL_CA_FILE`, `APP_ORIGINS` y el proveedor de correo cuando se implemente.
5. Servir `apps/web/dist` y enrutar `/api/*` a la API bajo el mismo origen mediante proxy HTTPS. Configurar fallback a `index.html` si se añade navegación cliente.
6. Usar `NODE_ENV=production` y orígenes HTTPS; cookies Secure y CSRF ya están implementados. Configurar explícitamente el proxy de confianza y un almacén compartido de límites al escalar.
7. Comprobar salud de API y conectividad real a la base; el endpoint actual sólo comprueba que el proceso HTTP responde.
8. Ejecutar los flujos de aceptación con cuentas de prueba antes de recibir usuarios.

## Copias y diagnóstico

- Diseñar copias diarias cifradas, retención y pruebas de restauración antes de almacenar postulaciones reales.
- Logs estructurados con ID de solicitud, código HTTP y duración; sin contraseñas, cookies, tokens, CV ni cartas de presentación.
- Vigilar errores, intentos de acceso, latencia y caducidad de sesiones. Programar `pnpm db:cleanup` para eliminar sesiones expiradas.
- Ante una migración fallida, detener la publicación y restaurar desde una copia verificada o aplicar una migración correctiva. No editar una migración ya aplicada.

Se creó el proyecto Supabase para PostgreSQL. Frontend y API se ejecutan localmente; todavía no hay despliegue público de la aplicación.
