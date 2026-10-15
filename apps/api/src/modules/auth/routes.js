import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { validateCredentials } from './validation.js';
import { requireUser } from './middleware.js';

export function authRouter(service, middleware, { limit = 20 } = {}) {
  const router = Router();
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Demasiados intentos. Inténtalo más tarde.' } } });
  router.get('/session', middleware.session);
  for (const operation of ['register', 'login']) {
    router.post(`/${operation}`, limiter, middleware.csrf, async (req, res) => {
      const result = await service[operation](validateCredentials(req.body, operation === 'register'), req.auth?.sid);
      middleware.setSession(res, result.token);
      res.status(operation === 'register' ? 201 : 200).json({ data: result.user });
    });
  }
  router.post('/logout', requireUser, middleware.csrf, async (req, res) => {
    await service.logout(req.auth.sid);
    middleware.clearSession(res);
    res.status(204).end();
  });
  return router;
}
