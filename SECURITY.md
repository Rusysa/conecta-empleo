# Seguridad

Registro, sesiones y perfil ya están implementados; las APIs de vacantes/postulaciones siguen pendientes (`501`). Ver [configuración y límites actuales](docs/SUPABASE.md) antes de un despliegue público.

Implementado: Argon2id, JWT firmado con JWS HS256 y revocación en PostgreSQL, rotación al autenticar, cookies HttpOnly/Secure, CSRF firmado ligado al navegador/sesión, límite de intentos, consultas parametrizadas, perfil propio y enlaces HTTPS. No se usa OAuth. No descargar URLs de CV desde el servidor ni renderizar HTML arbitrario. Antes de producción faltan verificación/recuperación de correo, aviso de privacidad definitivo, rol SQL de privilegios mínimos y política de operación y backups.

No publicar vulnerabilidades con secretos o datos personales en issues. Contactar al propietario del repositorio por un canal privado acordado. Si se publica el repositorio, configurar un canal de reporte privado antes del lanzamiento.
