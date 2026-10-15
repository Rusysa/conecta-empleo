import { HttpError } from '../../shared/errors.js';

export function validateCredentials(body, registration = false) {
  const fields = {};
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = body?.password;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = 'Ingresa un correo válido.';
  if (typeof password !== 'string' || password.length < (registration ? 12 : 1) || password.length > 128) fields.password = 'Usa una contraseña de 12 a 128 caracteres.';
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (registration) {
    if (name.length < 2 || name.length > 100) fields.name = 'El nombre debe tener entre 2 y 100 caracteres.';
    if (!['candidate', 'employer'].includes(body?.role)) fields.role = 'Selecciona candidato o empleador.';
    if (body?.acceptPrivacy !== true) fields.acceptPrivacy = 'Debes aceptar el aviso de privacidad.';
  }
  if (Object.keys(fields).length) throw new HttpError(422, 'VALIDATION_ERROR', 'Revisa los campos.', fields);
  return { email, password, name, role: body?.role };
}
