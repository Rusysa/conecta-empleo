# Especificaciones del producto

## Objetivo y alcance

Conectar candidatos con empleadores mediante un tablero de vacantes. Idioma inicial: español. Diseño adaptable a móvil y escritorio. Una cuenta tiene un rol fijo en el MVP; cambiarlo requerirá una decisión posterior.

## Roles y permisos

| Acción | Visitante | Candidato | Empleador |
| --- | --- | --- | --- |
| Consultar vacantes publicadas | Sí | Sí | Sí |
| Registrarse e iniciar sesión | Sí | Sí | Sí |
| Editar su perfil | No | Sí | Sí |
| Crear y editar sus vacantes | No | No | Sí |
| Publicar, cerrar y reabrir sus vacantes | No | No | Sí |
| Postularse y retirar su propia candidatura | No | Sí | No |
| Ver sus propias postulaciones | No | Sí | No |
| Ver y evaluar candidatos de sus vacantes | No | No | Sí |

Todo permiso debe comprobarse en el servidor. Los identificadores enviados por el navegador no prueban propiedad. No hay administración ni moderación implementada en esta base.

## Funcionalidades y aceptación

### Registro y acceso

- Nombre: 2–100 caracteres. Correo válido normalizado a minúsculas y único. Contraseña: 12–128 caracteres, sin truncar. Rol: candidato o empleador.
- El servidor almacena hash de contraseña con Argon2id y parámetros versionados; jamás contraseña en texto plano.
- Inicio de sesión con error genérico y límites de intentos. Regenerar sesión al autenticar; cerrar sesión invalida el registro en el servidor.
- Sesión en cookie HttpOnly, Secure en producción, SameSite=Lax. Caducidad propuesta: 8 horas de inactividad.
- Recuperación y verificación de correo son tareas posteriores, obligatorias antes de apertura pública.

### Perfil

- Usuario consulta y cambia su nombre y biografía. Los candidatos pueden guardar un enlace HTTPS a su CV o portafolio.
- El correo, hash y rol no se modifican a través del endpoint de perfil en el MVP.
- El perfil de candidato y sus datos de contacto no aparecen en el tablero público.

### Vacantes

- Campos: título (5–120), empresa (2–120), ubicación (2–120), modalidad, tipo de empleo, descripción (50–10,000), requisitos (20–10,000), salario opcional.
- Modalidades: remoto, híbrido, presencial. Tipos: tiempo completo, medio tiempo, por proyecto, prácticas.
- Salario: rango mensual bruto opcional, moneda ISO `MXN`, `USD` o `EUR`; mínimo no negativo y máximo mayor o igual al mínimo. Ambos importes se informan juntos.
- Flujo: borrador → publicada → cerrada; cerrada → publicada permite reabrir. Un borrador sólo es visible para su propietario.
- Búsqueda por título, empresa y ubicación; filtros de modalidad y tipo de empleo; paginación por defecto de 12, máximo 50; orden por fecha de publicación e ID descendentes.
- Las vacantes cerradas conservan su detalle si fueron publicadas; no admiten postulaciones.
- No se borran vacantes con candidaturas en el MVP. Publicar una edición no elimina postulaciones existentes.

### Postulaciones

- Sólo un candidato autenticado puede postularse a una vacante publicada.
- Presentación de 30–5,000 caracteres; CV/portafolio opcional mediante URL HTTPS, máximo 2,048 caracteres. El servidor no descarga el enlace.
- Una candidatura por candidato y vacante, garantizada por restricción única en la base de datos. Una candidatura retirada tampoco se duplica.
- Estado inicial `submitted`. El empleador puede pasar a `reviewing`, luego `interview`, luego `hired`. Desde los tres primeros estados puede rechazar.
- El candidato puede retirar una candidatura desde `submitted`, `reviewing` o `interview`. Estados `hired`, `rejected` y `withdrawn` son finales.
- Sólo el empleador propietario de la vacante consulta las candidaturas recibidas, nombres, correos, presentación y enlaces.
- El candidato ve estado y fechas de sus candidaturas en su panel.
- Validar publicación y crear candidatura dentro de una transacción con bloqueo de la vacante para evitar una postulación concurrente al cierre.

## Requisitos de calidad

- Validación de entrada en servidor, consultas parametrizadas, autorización por rol y propiedad, protección CSRF para cookies y límites de solicitudes.
- Sin renderizado de HTML arbitrario en descripciones. Sin exposición de hashes, sesiones o datos personales en logs.
- Formularios con etiquetas, navegación por teclado, estados de carga/error/vacío y contraste accesible.
- Pruebas de integración para registro, sesión, permisos, duplicados, cierre y cambios de estado; pruebas del frontend para flujos principales.
- Objetivo inicial: una instancia de API con PostgreSQL; medir latencia y carga antes de fijar un SLA.

## Fuera del MVP

Pagos, chat, archivos adjuntos, IA, red social, scraping de vacantes, múltiples miembros de una empresa y aplicaciones móviles nativas.
