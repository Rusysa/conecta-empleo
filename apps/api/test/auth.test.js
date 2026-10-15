import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import request from 'supertest';
import { SignJWT } from 'jose';
import { createApp } from '../src/app.js';
import { readConfig } from '../src/shared/config.js';
import { requireRole } from '../src/modules/auth/middleware.js';

let db, database, app;
const config = { jwtSecret: 'test-only-secret-'.repeat(4), production: false, origins: ['http://localhost:3000'] };
const input = { name: 'Ana Pérez', email: ' ANA@EXAMPLE.COM ', password: 'Una contraseña segura 123', role: 'candidate', acceptPrivacy: true };

before(async () => {
  db = new PGlite();
  const directory = new URL('../../../database/migrations/', import.meta.url);
  // Transactions must use one connection; serialize checkout just like a pool of size 1.
  let queue = Promise.resolve();
  database = {
    query: (...args) => db.query(...args),
    async connect() {
      const previous = queue;
      let release;
      queue = new Promise((resolve) => { release = resolve; });
      await previous;
      return { query: (...args) => db.query(...args), release };
    },
  };
  await db.exec('CREATE ROLE anon; CREATE ROLE authenticated;');
  for (const name of (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort()) {
    await db.exec(await readFile(new URL(name, directory), 'utf8'));
  }
  app = createApp({ database, config, authLimit: 200 }).listen(0);
});
after(async () => { if (app) await new Promise((resolve) => app.close(resolve)); await db?.close(); });

async function csrf(agent) {
  const response = await agent.get('/api/v1/auth/session');
  assert.equal(response.status, 200);
  assert.equal(response.headers['cache-control'], 'no-store');
  return response.body.data.csrfToken;
}
async function register(agent, data = input) {
  return mutate(agent, '/auth/register', data);
}
async function mutate(agent, path, data, method = 'post') {
  const token = await csrf(agent);
  return agent[method](`/api/v1${path}`).set('X-CSRF-Token', token).send(data);
}

test('registro persistente, hash Argon2id, perfil, login, rotación y logout revocable', async () => {
  const agent = request.agent(app);
  const response = await register(agent);
  assert.equal(response.status, 201, JSON.stringify(response.body));
  assert.equal(response.body.data.email, 'ana@example.com');
  assert.equal(response.body.data.password_hash, undefined);
  const cookie = response.headers['set-cookie'][0].split(';')[0];
  assert.match(response.headers['set-cookie'][0], /HttpOnly/);
  assert.match(response.headers['set-cookie'][0], /SameSite=Lax/);
  const stored = (await db.query('SELECT * FROM users WHERE id=$1', [response.body.data.id])).rows[0];
  assert.match(stored.password_hash, /^\$argon2id\$/);
  assert.ok(stored.privacy_accepted_at);
  assert.equal((await agent.get('/api/v1/users/me')).body.data.name, input.name);
  const changed = await mutate(agent, '/users/me', { bio: 'Desarrolladora', resumeUrl: 'https://example.com/cv' }, 'patch');
  assert.equal(changed.status, 200);
  assert.equal(changed.body.data.bio, 'Desarrolladora');
  // A new app instance recovers the session from the database.
  assert.equal((await request(createApp({ database, config })).get('/api/v1/users/me').set('Cookie', cookie)).status, 200);
  const login = await mutate(agent, '/auth/login', input);
  assert.equal(login.status, 200);
  assert.equal((await request(app).get('/api/v1/users/me').set('Cookie', cookie)).status, 401);
  const rotatedCookie = login.headers['set-cookie'][0].split(';')[0];
  assert.equal((await mutate(agent, '/auth/logout')).status, 204);
  assert.equal((await request(app).get('/api/v1/users/me').set('Cookie', rotatedCookie)).status, 401);
});

test('duplicados normalizados, validación, consentimiento y roles no escalables', async () => {
  const agent = request.agent(app);
  assert.equal((await register(agent, { ...input, email: 'ana@example.com' })).status, 409);
  for (const patch of [{ role: 'admin' }, { password: 'short' }, { acceptPrivacy: false }, { email: [] }, { name: '' }, { password: 'a'.repeat(129) }]) {
    const res = await register(agent, { ...input, ...patch });
    assert.equal(res.status, 422);
  }
  const employer = await register(agent, { ...input, email: 'empresa@example.com', role: 'employer' });
  assert.equal(employer.status, 201);
  for (const body of [{ role: 'candidate' }, { email: 'other@example.com' }, { resumeUrl: 'https://example.com/cv' }]) {
    assert.equal((await mutate(agent, '/users/me', body, 'patch')).status, 422);
  }
});

test('CSRF rechaza ausencia, otro navegador, origen ajeno y token de visitante después de login', async () => {
  const agent = request.agent(app);
  assert.equal((await agent.post('/api/v1/auth/register').send(input)).status, 403);
  const token = await csrf(agent);
  assert.equal((await request(app).post('/api/v1/auth/login').set('X-CSRF-Token', token).send(input)).status, 403);
  assert.equal((await agent.post('/api/v1/auth/login').set('Origin', 'https://evil.example').set('X-CSRF-Token', token).send(input)).status, 403);
  assert.equal((await agent.post('/api/v1/auth/login').set('X-CSRF-Token', token).send(input)).status, 200);
  assert.equal((await agent.post('/api/v1/auth/logout').set('X-CSRF-Token', token)).status, 403);
});

test('credenciales incorrectas devuelven el mismo error y los intentos están limitados', async () => {
  const agent = request.agent(createApp({ database, config, authLimit: 2 }));
  const token = await csrf(agent);
  const wrong = await agent.post('/api/v1/auth/login').set('X-CSRF-Token', token).send({ ...input, password: 'incorrecta' });
  const absent = await agent.post('/api/v1/auth/login').set('X-CSRF-Token', token).send({ ...input, email: 'missing@example.com' });
  assert.equal(wrong.status, 401);
  assert.deepEqual(wrong.body, absent.body);
  assert.equal((await agent.post('/api/v1/auth/login').set('X-CSRF-Token', token).send(input)).status, 429);
});

test('firma alterada, expiración, audiencia equivocada y sesión eliminada no autentican', async () => {
  const agent = request.agent(app);
  const res = await register(agent, { ...input, email: 'tokens@example.com' });
  const token = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
  const [header, payload, signature] = token.split('.');
  const invalid = `${header}.${payload}.${signature[0] === 'a' ? 'b' : 'a'}${signature.slice(1)}`;
  assert.equal((await request(app).get('/api/v1/users/me').set('Cookie', `conecta_session=${invalid}`)).status, 401);
  const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
  for (const override of [{ exp: 1 }, { aud: 'csrf' }, { iss: 'other' }, { jti: randomUUID() }]) {
    const forged = await new SignJWT({ ...claims, ...override }).setProtectedHeader({ alg: 'HS256', typ: 'JWT' }).sign(new TextEncoder().encode(config.jwtSecret));
    assert.equal((await request(app).get('/api/v1/users/me').set('Cookie', `conecta_session=${forged}`)).status, 401);
  }
  await db.query("UPDATE sessions SET expires_at=now()-interval '1 second' WHERE sid=$1", [claims.jti]);
  assert.equal((await agent.get('/api/v1/users/me')).status, 401);
});

test('dos registros simultáneos del mismo correo crean una sola cuenta y sesión', async () => {
  const attempts = await Promise.all([
    register(request.agent(app), { ...input, email: 'race@example.com' }),
    register(request.agent(app), { ...input, email: 'RACE@example.com' }),
  ]);
  assert.deepEqual(attempts.map((response) => response.status).sort(), [201, 409]);
  const { rows } = await db.query("SELECT count(*)::int AS count FROM sessions s JOIN users u ON u.id=s.user_id WHERE u.email='race@example.com'");
  assert.equal(rows[0].count, 1);
});

test('registro revierte la cuenta si falla la creación de su sesión', async () => {
  const brokenDatabase = {
    ...database,
    async connect() {
      const client = await database.connect();
      return { ...client, query(sql, parameters) {
        if (sql.startsWith('INSERT INTO public.sessions')) throw new Error('Simulated storage failure');
        return client.query(sql, parameters);
      } };
    },
  };
  const server = createApp({ database: brokenDatabase, config }).listen(0);
  try {
    const response = await register(request.agent(server), { ...input, email: 'rollback@example.com' });
    assert.equal(response.status, 500);
    assert.equal(response.body.error.message, 'Error inesperado.');
    assert.equal((await db.query("SELECT id FROM users WHERE email='rollback@example.com'")).rows.length, 0);
  } finally { await new Promise((resolve) => server.close(resolve)); }
});

test('perfil propio rechaza URLs inseguras y no modifica otra cuenta', async () => {
  const agent = request.agent(app);
  const user = await register(agent, { ...input, email: 'own-profile@example.com' });
  assert.equal(user.status, 201);
  for (const body of [{ resumeUrl: 'javascript:alert(1)' }, { resumeUrl: 'http://example.com' }, { bio: 'a'.repeat(2001) }, { id: randomUUID(), name: 'Otro' }]) {
    assert.equal((await mutate(agent, '/users/me', body, 'patch')).status, 422);
  }
  assert.equal((await mutate(agent, '/users/me', { name: 'Solo mi perfil' }, 'patch')).status, 200);
  assert.equal((await db.query("SELECT name FROM users WHERE email='ana@example.com'")).rows[0].name, input.name);
});

test('middleware exige sesión y el rol leído del servidor', () => {
  assert.throws(() => requireRole('employer')({}, {}, () => {}), { status: 401 });
  assert.throws(() => requireRole('employer')({ auth: { user: { role: 'candidate' } } }, {}, () => {}), { status: 403 });
  let allowed = false;
  requireRole('employer')({ auth: { user: { role: 'employer' } } }, {}, () => { allowed = true; });
  assert.equal(allowed, true);
});

test('RLS y privilegios impiden acceso directo de anon/authenticated a tablas privadas', async () => {
  for (const role of ['anon', 'authenticated']) {
    for (const table of ['users', 'sessions', 'jobs', 'applications']) {
      const { rows } = await db.query('SELECT has_table_privilege($1,$2,\'SELECT\') AS allowed', [role, table]);
      assert.equal(rows[0].allowed, false);
    }
  }
  const { rows } = await db.query("SELECT relrowsecurity FROM pg_class WHERE relname IN ('users','sessions','jobs','applications') AND relnamespace='public'::regnamespace");
  assert.equal(rows.length, 4);
  assert.ok(rows.every((row) => row.relrowsecurity));
});

test('producción exige secretos y orígenes HTTPS, usa cookies __Host Secure', async () => {
  assert.throws(() => readConfig({ DATABASE_URL: 'postgres://localhost/db', JWT_SECRET: 'short' }));
  assert.throws(() => readConfig({ DATABASE_URL: 'postgres://localhost/db', JWT_SECRET: config.jwtSecret, NODE_ENV: 'production' }));
  const response = await request(createApp({ database, config: { ...config, production: true } })).get('/api/v1/auth/session');
  assert.match(response.headers['set-cookie'][0], /^__Host-conecta_csrf=/);
  assert.match(response.headers['set-cookie'][0], /Secure/);
});
