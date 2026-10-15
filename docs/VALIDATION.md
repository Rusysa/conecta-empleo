# Verificación de identidad y persistencia

Rama: `codex/database-jws-auth`, basada en
`origin/feat/web-nextjs-frontend` (`b150837`).

Comprobaciones realizadas:

- 15 pruebas de API: persistencia, hash Argon2id, login/logout, rotación, tokens
  inválidos/caducados, CSRF, límites de intentos, permisos, validación de perfiles,
  duplicados concurrentes, rollback de registro y RLS/privilegios.
- Prueba de redirecciones seguras después de login.
- ESLint y build con TypeScript de Next.js; build del frontend Vite original.
- Sincronización de las dos migraciones canónicas y sus copias para Supabase CLI.
- Proyecto remoto creado, migraciones aplicadas y SSL obligatorio activado.
- Conexión real de Express a PostgreSQL remoto verificando CA y hostname.
- Navegador contra Next.js + Express + Supabase: registro de cuenta ficticia,
  edición persistente de perfil, logout con retorno al estado de visitante,
  rechazo de contraseña incorrecta, nuevo login y redirección por rol al intentar
  abrir el perfil de empresa con una cuenta candidata. Cuenta ficticia eliminada
  al terminar la verificación.

Las pruebas SQL se ejecutan en PGlite con las migraciones reales. No prueban todos
los servicios internos de Supabase ni el despliegue distribuido. Los módulos de
vacantes y postulaciones siguen pendientes; no se declara un flujo completo del
MVP ni un despliegue público de la aplicación.
