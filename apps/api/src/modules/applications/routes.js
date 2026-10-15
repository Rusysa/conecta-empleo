import { Router } from 'express';
import { notImplemented } from '../../shared/not-implemented.js';

export function applicationsRouter() {
  const router = Router();
  router.post('/', notImplemented('applications'));
  router.get('/mine', notImplemented('applications'));
  router.get('/received', notImplemented('applications'));
  router.patch('/:applicationId/status', notImplemented('applications'));
  return router;
}
