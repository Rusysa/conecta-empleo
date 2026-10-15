# Certificado público de Supabase

`supabase-ca.crt` se descargó de
https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt.
Es una CA pública, no una credencial ni una clave privada. Se usa para comprobar la
cadena TLS y el nombre del servidor PostgreSQL. No desactivar `rejectUnauthorized`.

Si Supabase cambia su CA, obtener el certificado desde Database Settings del
proyecto y revisar la actualización antes de sustituirlo.

Referencia: https://supabase.com/docs/guides/platform/ssl-enforcement
