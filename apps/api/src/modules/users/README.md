# Usuarios

Responsable de perfil propio: nombre, biografía y enlace al CV. Ver USER-01 en `docs/ROADMAP.md`.

`routes.js` valida consulta/edición del perfil propio; `repository.js` usa SQL parametrizado y transforma solo campos públicos. `index.js` expone creación de usuario para la transacción de auth. Nunca devolver hashes; el perfil HTTP no permite cambiar rol ni correo. La fachada de consulta limitada de candidatos se añadirá al integrar postulaciones y sus permisos.

GET/PATCH `/users/me` requieren sesión real; PATCH además requiere CSRF. Solo candidatos guardan enlaces HTTPS a su CV; no se descargan desde el servidor.
