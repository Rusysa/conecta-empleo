# PostgreSQL, Supabase y autenticación

## Proyecto configurado

- Proyecto: **conecta-empleo**.
- Organización: **Rusysa's Org**.
- Referencia: `lcrpqnazwtjxqjhaifmh`.
- Región: `us-east-1`.
- Panel: https://supabase.com/dashboard/project/lcrpqnazwtjxqjhaifmh
- SSL obligatorio, migraciones inicial y de seguridad aplicadas.

Supabase proporciona PostgreSQL. La aplicación registra sus cuentas en
`public.users`; no usa OAuth, Supabase Auth ni una segunda identidad en Auth.js.
El frontend no necesita claves de Supabase. Express usa una conexión privada al
pooler, con la CA pública en `database/certs/supabase-ca.crt` y validación de hostname.

## Ejecutar en este equipo

Las credenciales de este proyecto están en `apps/api/.env`, excluido de Git.
La contraseña original de aprovisionamiento también está en
`.local/supabase-project.json`, excluido de Git. No copiar estos archivos a issues,
PRs ni mensajes. La CLI guarda su propia sesión fuera del repositorio.

```powershell
# Si pnpm todavía no está en PATH, usar los shims locales creados previamente:
$env:COREPACK_HOME = Join-Path (Get-Location) '.local/corepack'
$env:PATH = (Join-Path (Get-Location) '.local/bin') + ';' + $env:PATH
corepack pnpm install --frozen-lockfile
corepack pnpm dev:api
# En otra terminal con la misma configuración de pnpm:
corepack pnpm dev:web-next
```

Abrir http://localhost:3000. Next.js redirige `/api/v1/*` a Express en el puerto
3001. `API_INTERNAL_URL` debe configurarse antes de compilar Next.js si la API
estará en otro host. `apps/web-next/.env.example` documenta esta variable.

En otro equipo, copiar `apps/api/.env.example` a `.env`, configurar el connection
string del pooler, establecer `DATABASE_SSL_CA_FILE=../../database/certs/supabase-ca.crt`
y generar `JWT_SECRET` con al menos 32 bytes aleatorios. No reutilizar secretos de
pruebas. Los comandos de API se ejecutan desde `apps/api` mediante pnpm.

## Migraciones y CLI

La CLI está fijada como dependencia de desarrollo; ejecutar `pnpm exec supabase`.

```bash
pnpm exec supabase login
pnpm exec supabase link --project-ref lcrpqnazwtjxqjhaifmh
pnpm db:check
pnpm exec supabase db push --dry-run
pnpm db:push
pnpm exec supabase migration list
```

La fuente canónica está en `database/migrations/`. Después de añadir una migración,
ejecutar `pnpm db:sync` y versionar también su copia en `supabase/migrations/`.
`db:check` detecta divergencias. La CLI mantiene el historial de versiones remoto;
un segundo `db push` no vuelve a ejecutar lo ya aplicado. No ejecutar migraciones
simultáneamente desde varias máquinas. No modificar migraciones aplicadas: añadir
una nueva. No usar `db reset --linked` sobre este proyecto.

Para PostgreSQL local, instalar Docker, ejecutar `pnpm db:start` y usar el
`DATABASE_URL` del ejemplo, dejando `DATABASE_SSL_CA_FILE` vacío. Supabase Auth
está deshabilitado en la configuración local porque Express implementa la identidad.

## Seguridad y operación

- Contraseña Argon2id: 64 MiB, 3 pasadas, paralelismo 1, salt aleatorio de 16 bytes.
  Usa la API de Node 24 (todavía experimental); la versión de Node está fijada en el proyecto.
- JWT/JWS HS256 en cookie HttpOnly, SameSite=Lax. Producción usa `__Host-` y Secure.
  Emisor y audiencias separados para sesión/CSRF; duración absoluta de sesión: 8 h.
- Cada petición autenticada consulta el `jti` persistido y el usuario. El rol no
  se confía al navegador. Login rota la sesión actual; logout la elimina.
- CSRF firmado, ligado al navegador y a la sesión; `GET /auth/session` lo entrega.
  Se valida el origen contra `APP_ORIGINS`. No habilitar CORS amplio ni guardar JWT en localStorage.
- Registro/login: 20 intentos por IP en 15 minutos, por proceso. El proxy de confianza
  está deshabilitado; detrás de Next.js todos los clientes pueden compartir el límite
  de la IP del proxy. Antes de escalar, configurar explícitamente el proxy de ingreso
  y un almacén compartido de límites, sin confiar indiscriminadamente en X-Forwarded-For.
- RLS activo y sin permisos de tablas para `anon`/`authenticated`. Toda operación
  pasa por la API. La conexión inicial usa `postgres`; antes de producción crear un
  rol dedicado con permisos mínimos y políticas para la API.
- `pnpm db:cleanup` elimina sesiones caducadas. Ejecutarlo periódicamente desde el
  sistema de operación elegido; no hay un scheduler desplegado por este repositorio.
- `.env`, `.local` y `supabase/.temp` no se versionan. La CA pública sí se versiona.

## Alcance y verificación

Implementado: registro de candidato/empresa, login, logout revocable, sesión,
lectura/edición del perfil propio, enlace HTTPS a CV y formularios Next.js reales.
Las pruebas usan PostgreSQL embebido (PGlite), aplicando los mismos SQL, sin necesitar
Docker ni acceso a Supabase. No usan un repositorio de usuarios simulado.

```bash
pnpm test
pnpm db:check
pnpm --filter @conecta/web-next lint
pnpm build:web-next
pnpm build
```

Pendiente: API de vacantes/postulaciones y su conexión con el catálogo de demostración,
almacenamiento privado de archivos de CV, correos, verificación/recuperación de cuenta,
aviso de privacidad definitivo y despliegue de frontend/API. El proyecto Supabase
creado no despliega automáticamente Express ni Next.js.

Referencias: [CLI](https://supabase.com/docs/guides/local-development/cli/getting-started),
[migraciones](https://supabase.com/docs/guides/local-development/cli-workflows),
[TLS](https://supabase.com/docs/guides/platform/ssl-enforcement).
