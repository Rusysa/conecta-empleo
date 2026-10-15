import express from 'express';
import helmet from 'helmet';
import { API_PREFIX } from '@conecta/contracts';
import { authRouter } from './modules/auth/routes.js';
import { usersRouter } from './modules/users/routes.js';
import { jobsRouter } from './modules/jobs/routes.js';
import { applicationsRouter } from './modules/applications/routes.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '32kb' }));
  app.get(`${API_PREFIX}/health`, (_req, res) => res.json({ status: 'ok', version: '0.1.0' }));
  app.use(`${API_PREFIX}/auth`, authRouter());
  app.use(`${API_PREFIX}/users`, usersRouter());
  app.use(`${API_PREFIX}/jobs`, jobsRouter());
  app.use(`${API_PREFIX}/applications`, applicationsRouter());
  app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ruta no encontrada.' } }));
  app.use((error, _req, res, _next) => {
    const status = error.status === 400 || error.status === 413 ? error.status : 500;
    res.status(status).json({ error: { code: status === 500 ? 'INTERNAL_ERROR' : 'INVALID_BODY', message: status === 500 ? 'Error inesperado.' : 'El cuerpo de la solicitud no es válido.' } });
  });
  return app;
}
