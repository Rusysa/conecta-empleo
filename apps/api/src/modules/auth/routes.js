import { Router } from 'express';
import { notImplemented } from '../../shared/not-implemented.js';

export function authRouter() {
  const router = Router();
  router.post('/register', notImplemented('auth'));
  router.post('/login', notImplemented('auth'));
  router.post('/logout', notImplemented('auth'));
  router.get('/session', notImplemented('auth'));
  return router;
}
