import { Router } from 'express';
import { notImplemented } from '../../shared/not-implemented.js';

export function usersRouter() {
  const router = Router();
  router.get('/me', notImplemented('users'));
  router.patch('/me', notImplemented('users'));
  return router;
}
