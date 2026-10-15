import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createAuthService } from './modules/auth/service.js';
import { authMiddleware } from './modules/auth/middleware.js';
import { HttpError } from './shared/errors.js';
import { API_PREFIX } from '@conecta/contracts';
import { authRouter } from './modules/auth/routes.js';
import { usersRouter } from './modules/users/routes.js';
import { jobsRouter } from './modules/jobs/routes.js';
import { applicationsRouter } from './modules/applications/routes.js';

export function createApp({ database, config, authLimit } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());
  app.get(`${API_PREFIX}/health`, (_req, res) => res.json({ status: 'ok', version: '0.1.0' }));
  if (database && config) {
    const service = createAuthService(database, config);
    const middleware = authMiddleware(service, config);
    app.use(API_PREFIX, middleware.loadSession);
    app.use(`${API_PREFIX}/auth`, authRouter(service, middleware, { limit: authLimit }));
    app.use(`${API_PREFIX}/users`, usersRouter(database, middleware));
  } else {
    app.use([`${API_PREFIX}/auth`, `${API_PREFIX}/users`], (_req, _res, next) => next(new HttpError(503, 'DATABASE_UNAVAILABLE', 'Configura la base de datos para usar autenticación.')));
  }
  app.use(`${API_PREFIX}/jobs`, jobsRouter());
  app.use(`${API_PREFIX}/applications`, applicationsRouter());
  app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ruta no encontrada.' } }));
  app.use((error, _req, res, _next) => {
    if (error instanceof HttpError) return res.status(error.status).json({ error: { code: error.code, message: error.message, ...(error.fields ? { fields: error.fields } : {}) } });
    const status = error.status === 400 || error.status === 413 ? error.status : 500;
    res.status(status).json({ error: { code: status === 500 ? 'INTERNAL_ERROR' : 'INVALID_BODY', message: status === 500 ? 'Error inesperado.' : 'El cuerpo de la solicitud no es válido.' } });
  });
  return app;
}
