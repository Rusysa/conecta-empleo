import { Router } from 'express';
import { notImplemented } from '../../shared/not-implemented.js';

export function jobsRouter() {
  const router = Router();
  router.get('/', notImplemented('jobs'));
  router.post('/', notImplemented('jobs'));
  router.get('/:jobId', notImplemented('jobs'));
  router.patch('/:jobId', notImplemented('jobs'));
  return router;
}
