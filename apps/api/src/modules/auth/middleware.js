import { randomBytes } from 'node:crypto';
import { HttpError } from '../../shared/errors.js';
import { SESSION_SECONDS } from './service.js';

export function authMiddleware(service, config) {
  const cookieName = config.production ? '__Host-conecta_session' : 'conecta_session';
  const csrfCookie = config.production ? '__Host-conecta_csrf' : 'conecta_csrf';
  const cookieOptions = { httpOnly: true, secure: config.production, sameSite: 'lax', path: '/' };
  return {
    async loadSession(req, res, next) {
      res.set('Cache-Control', 'no-store');
      req.auth = await service.authenticate(req.cookies[cookieName]);
      next();
    },
    async csrf(req, _res, next) {
      const origin = req.get('origin');
      if ((origin && !config.origins.includes(origin)) || req.get('sec-fetch-site') === 'cross-site' ||
        !await service.verifyCsrf(req.get('x-csrf-token'), req.cookies[csrfCookie], req.auth?.sid)) {
        throw new HttpError(403, 'CSRF_INVALID', 'Actualiza la página e inténtalo de nuevo.');
      }
      next();
    },
    async session(req, res) {
      const binding = req.cookies[csrfCookie] || randomBytes(32).toString('base64url');
      res.cookie(csrfCookie, binding, { ...cookieOptions, maxAge: 3600000 });
      res.json({ data: { user: req.auth?.user ?? null, csrfToken: await service.csrfToken(binding, req.auth?.sid) } });
    },
    setSession(res, token) { res.cookie(cookieName, token, { ...cookieOptions, maxAge: SESSION_SECONDS * 1000 }); },
    clearSession(res) { res.clearCookie(cookieName, cookieOptions); res.clearCookie(csrfCookie, cookieOptions); },
  };
}

export function requireUser(req, _res, next) {
  if (!req.auth) throw new HttpError(401, 'UNAUTHENTICATED', 'Inicia sesión para continuar.');
  next();
}

export function requireRole(role) {
  return (req, res, next) => requireUser(req, res, () => {
    if (req.auth.user.role !== role) throw new HttpError(403, 'FORBIDDEN', 'No tienes permiso para esta acción.');
    next();
  });
}
