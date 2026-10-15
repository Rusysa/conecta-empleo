import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

test('health devuelve la versión y las cabeceras de seguridad', async () => {
  const res = await request(createApp()).get('/api/v1/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.equal(res.headers['x-powered-by'], undefined);
});

test('todos los módulos pendientes responden 501 sin simular operaciones exitosas', async () => {
  const app = createApp();
  const routes = [
    ['get', '/jobs'], ['post', '/jobs'],
    ['get', '/jobs/1'], ['patch', '/jobs/1'], ['post', '/applications'],
    ['get', '/applications/mine'], ['get', '/applications/received'], ['patch', '/applications/1/status'],
  ];
  for (const [method, path] of routes) {
    const res = await request(app)[method](`/api/v1${path}`);
    assert.equal(res.status, 501, `${method} ${path}`);
    assert.equal(res.body.error.code, 'NOT_IMPLEMENTED');
  }
});

test('sin persistencia no simula una autenticación exitosa', async () => {
  assert.equal((await request(createApp()).get('/api/v1/auth/session')).status, 503);
});

test('rutas inexistentes y JSON inválido devuelven errores estructurados', async () => {
  const app = createApp();
  assert.equal((await request(app).get('/api/v1/missing')).status, 404);
  const res = await request(app).post('/api/v1/jobs').set('Content-Type', 'application/json').send('{');
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'INVALID_BODY');
});
