# Seguridad

La base inicial no implementa registro ni sesiones y no debe usarse aún para procesar datos personales. Las rutas pendientes responden 501.

Al implementar: Argon2id, sesiones persistentes, regeneración al autenticar, cookies HttpOnly/Secure, CSRF, límites de intentos, consultas parametrizadas, permisos por rol y propiedad, validación de entradas y enlaces HTTPS. No descargar URLs de CV desde el servidor ni renderizar HTML arbitrario.

No publicar vulnerabilidades con secretos o datos personales en issues. Contactar al propietario del repositorio por un canal privado acordado. Si se publica el repositorio, configurar un canal de reporte privado antes del lanzamiento.
