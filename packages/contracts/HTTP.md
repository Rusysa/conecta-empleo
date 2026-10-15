# Contrato HTTP v1 — diseño acordable antes de implementar

Base: `/api/v1`. JSON UTF-8, fechas ISO 8601 UTC, IDs UUID. Las rutas de negocio existen como placeholders y responden `501`; este documento define su comportamiento futuro. `/health` ya devuelve `200 {"status":"ok","version":"0.1.0"}`.

## Convenciones

- Resultado individual: `{ "data": { ... } }`.
- Listado: `{ "data": [...], "meta": { "page": 1, "pageSize": 12, "total": 0 } }`.
- Error: `{ "error": { "code": "VALIDATION_ERROR", "message": "Revisa los campos.", "fields": { "title": "Obligatorio" } } }`. `fields` es opcional.
- `400` cuerpo inválido; `401` sin sesión; `403` rol/CSRF inválido; `404` inexistente o recurso privado ajeno; `409` duplicado/conflicto de estado; `422` validación; `429` límite; `500` error genérico sin detalles internos.
- Autenticación prevista mediante sesión y cookie del mismo origen. Mutaciones requieren `X-CSRF-Token`; `GET /auth/session` devuelve token también para visitante (no requiere sesión autenticada).
- Toda respuesta autenticada usa `Cache-Control: no-store`. El servidor ignora IDs de propietario y rol enviados en cuerpos ajenos a registro.

## Modelos públicos previstos

```json
{
  "User": {
    "id": "UUID", "name": "Ana Pérez", "email": "ana@example.com",
    "role": "candidate", "bio": "", "resumeUrl": "", "createdAt": "ISO8601"
  },
  "Job": {
    "id": "UUID", "employerId": "UUID", "title": "Desarrollador web",
    "company": "Empresa", "location": "Ciudad de México", "workMode": "hybrid",
    "employmentType": "full_time", "description": "Texto plano", "requirements": "Texto plano",
    "salary": { "min": 20000, "max": 30000, "currency": "MXN" },
    "status": "published", "createdAt": "ISO8601", "updatedAt": "ISO8601", "publishedAt": "ISO8601"
  },
  "Application": {
    "id": "UUID", "jobId": "UUID", "candidateId": "UUID",
    "coverLetter": "Presentación", "resumeUrl": "https://example.com/cv",
    "status": "submitted", "createdAt": "ISO8601", "updatedAt": "ISO8601"
  }
}
```

`Job.salary` puede ser `null`; `publishedAt` es `null` en borradores. Los hashes y sesiones nunca forman parte de `User`. Campos de entrada en camelCase; adaptadores de repositorio traducen snake_case de SQL.

## Identidad y perfil

| Método y ruta | Cuerpo/consulta | Respuesta prevista | Permiso |
| --- | --- | --- | --- |
| `POST /auth/register` | `{name,email,password,role}` | 201 `{data:User}` + sesión | Visitante + CSRF |
| `POST /auth/login` | `{email,password}` | 200 `{data:User}` + sesión | Visitante + CSRF |
| `POST /auth/logout` | Sin cuerpo | 204 sin cuerpo | Autenticado + CSRF |
| `GET /auth/session` | — | 200 `{data:{user:User\|null,csrfToken:string}}` | Todos |
| `GET /users/me` | — | 200 `{data:User}` | Autenticado |
| `PATCH /users/me` | `{name?,bio?,resumeUrl?}` | 200 `{data:User}` | Autenticado + CSRF |

## Vacantes

| Método y ruta | Cuerpo/consulta | Respuesta prevista | Permiso |
| --- | --- | --- | --- |
| `GET /jobs` | `q`, `workMode`, `employmentType`, `page`, `pageSize`, `mine` | 200 listado de Job | Todos; `mine=true` sólo empleador |
| `GET /jobs/:jobId` | — | 200 `{data:Job}` | Publicadas/cerradas: todos; borrador: propietario |
| `POST /jobs` | Campos editables de Job; sin ID, autor ni fechas | 201 `{data:Job}`; siempre borrador | Empleador + CSRF |
| `PATCH /jobs/:jobId` | Campos editables opcionales y/o `status` | 200 `{data:Job}` | Propietario + CSRF |

Para crear: `title`, `company`, `location`, `workMode`, `employmentType`, `description`, `requirements`; `salary` opcional. Para editar, al menos un campo. Transiciones: `draft→published`, `published→closed`, `closed→published`. Al publicar por primera vez se asigna `publishedAt`; reabrir conserva esa fecha. `mine=true` devuelve todas las vacantes del propietario y admite filtro `status`; el listado público sólo devuelve publicadas. La búsqueda es literal, máximo 100 caracteres. Orden fijo por `publishedAt DESC, id DESC`; en listado propio por `createdAt DESC, id DESC`.

## Postulaciones

| Método y ruta | Cuerpo/consulta | Respuesta prevista | Permiso |
| --- | --- | --- | --- |
| `POST /applications` | `{jobId,coverLetter,resumeUrl?}` | 201 `{data:Application}` | Candidato + CSRF |
| `GET /applications/mine` | `page`, `pageSize` | 200 listado con `job:{id,title,company,status}` | Candidato |
| `GET /applications/received` | `jobId` obligatorio, `page`, `pageSize` | 200 listado con `candidate:{id,name,email}` | Propietario de vacante |
| `PATCH /applications/:applicationId/status` | `{status}` | 200 `{data:Application}` | Propietario de vacante o candidato dueño para retirar + CSRF |

La URL del CV se copia en la candidatura al enviarla; cambiar el perfil no modifica postulaciones anteriores. `resumeUrl` omitida copia la del perfil o `""`; un `""` explícito no adjunta enlace. Las candidaturas se ordenan por `createdAt DESC, id DESC`. El servidor comprueba unicidad y estado de la vacante en la misma transacción. Las transiciones canónicas están en `src/index.js`; la autorización depende además del actor.
