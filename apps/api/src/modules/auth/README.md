# Autenticación

Responsable de registro, hash de contraseñas, acceso, cierre, sesiones y CSRF. Ver AUTH-01 y AUTH-02 en `docs/ROADMAP.md`.

Implementar aquí controladores, validaciones y servicio de identidad. Exponer middleware `requireUser`, `requireRole` y contexto `{id, role}`; otros módulos no deben consultar sesiones ni hashes directamente.

Coordinar la creación transaccional de cuentas con el servicio público de `users`. Las rutas actuales son placeholders 501.
