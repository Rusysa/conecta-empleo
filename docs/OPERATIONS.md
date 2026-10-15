# Operación y despliegue previsto

## Estado actual

El starter ejecuta una interfaz y una API sin persistencia ni autenticación. No está listo para recibir cuentas o datos reales. `pnpm test` verifica las rutas base y placeholders; no verifica funcionalidades de negocio pendientes.

CI se entrega como plantilla en `docs/ci.example.yml`; su activación en `.github/workflows/ci.yml` requiere una credencial con permiso `workflow`, ausente en la cuenta conectada durante la inicialización.

## Desarrollo

Instalar desde la raíz con `pnpm install --frozen-lockfile`. Ejecutar API y web en terminales independientes según el README. Los workspaces comparten un único lockfile. Node 24 es la versión de referencia de CI.

## Producción después de completar el MVP

1. Ejecutar CI con `pnpm install --frozen-lockfile`, `pnpm test` y `pnpm build`.
2. Provisionar PostgreSQL con usuario de privilegios mínimos y conexiones cifradas.
3. Implementar y ejecutar el runner de migraciones con bloqueo y transacciones antes de habilitar tráfico. El SQL incluido es una propuesta, no un runner.
4. Configurar secretos de sesión, conexión a la base y proveedor de correo en el alojamiento.
5. Servir `apps/web/dist` y enrutar `/api/*` a la API bajo el mismo origen mediante proxy HTTPS. Configurar fallback a `index.html` si se añade navegación cliente.
6. Activar cookies Secure, CSRF, límites de solicitudes y configuración explícita del proxy de confianza en la implementación de auth.
7. Comprobar salud de API y conectividad real a la base; el endpoint actual sólo comprueba que el proceso HTTP responde.
8. Ejecutar los flujos de aceptación con cuentas de prueba antes de recibir usuarios.

## Copias y diagnóstico

- Diseñar copias diarias cifradas, retención y pruebas de restauración antes de almacenar postulaciones reales.
- Logs estructurados con ID de solicitud, código HTTP y duración; sin contraseñas, cookies, tokens, CV ni cartas de presentación.
- Vigilar errores, intentos de acceso, latencia y caducidad de sesiones. La eliminación periódica de sesiones expiradas es una tarea pendiente.
- Ante una migración fallida, detener la publicación y restaurar desde una copia verificada o aplicar una migración correctiva. No editar una migración ya aplicada.

No se ha contratado alojamiento ni publicado un sitio en esta tarea.
