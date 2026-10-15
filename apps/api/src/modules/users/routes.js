import { Router } from 'express';
import { requireUser } from '../auth/middleware.js';
import { HttpError } from '../../shared/errors.js';
import { updateProfile } from './repository.js';

export function usersRouter(database, middleware) {
  const router = Router();
  router.use(requireUser);
  router.get('/me', (req, res) => res.json({ data: req.auth.user }));
  router.patch('/me', middleware.csrf, async (req, res) => {
    const body = req.body;
    const fields = {};
    const errors = {};
    if (!body || typeof body !== 'object' || Array.isArray(body) || !Object.keys(body).length || Object.keys(body).some((key) => !['name', 'bio', 'resumeUrl'].includes(key))) {
      throw new HttpError(422, 'VALIDATION_ERROR', 'Envía nombre, biografía o enlace al CV.');
    }
    for (const [key, value] of Object.entries(body)) {
      if (typeof value !== 'string') { errors[key] = 'Debe ser texto.'; continue; }
      fields[key] = value.trim();
      if (key === 'name' && (fields[key].length < 2 || fields[key].length > 100)) errors.name = 'Usa entre 2 y 100 caracteres.';
      if (key === 'bio' && fields[key].length > 2000) errors.bio = 'Máximo 2000 caracteres.';
      if (key === 'resumeUrl') {
        if (req.auth.user.role !== 'candidate') errors.resumeUrl = 'Solo candidatos pueden adjuntar un CV.';
        if (value.length > 2048) errors.resumeUrl = 'Máximo 2048 caracteres.';
        if (fields[key]) {
          try { if (new URL(fields[key]).protocol !== 'https:') throw new Error(); }
          catch { errors.resumeUrl = 'Usa una URL HTTPS válida.'; }
        }
      }
    }
    if (Object.keys(errors).length) throw new HttpError(422, 'VALIDATION_ERROR', 'Revisa los campos.', errors);
    res.json({ data: await updateProfile(database, req.auth.user.id, fields) });
  });
  return router;
}
