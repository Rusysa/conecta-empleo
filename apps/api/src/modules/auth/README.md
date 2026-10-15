# Autenticación

Responsable de registro, hash de contraseñas, acceso, cierre, sesiones y CSRF. Ver AUTH-01 y AUTH-02 en `docs/ROADMAP.md`.

Implementado en rutas, validación, servicio y repositorio. `middleware.js` expone `requireUser` y `requireRole`; el contexto es `req.auth = {user, sid}`. Otros módulos no deben consultar sesiones ni hashes directamente.

La creación de cuenta utiliza la fachada pública de `users` dentro de la misma transacción que la sesión. JWT/JWS HS256 en cookie HttpOnly, contraseñas Argon2id y sesiones persistidas revocables, sin OAuth. Ver `docs/SUPABASE.md` y `packages/contracts/HTTP.md` para configuración y flujo CSRF.
