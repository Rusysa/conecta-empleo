import { randomBytes, randomUUID } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { transaction } from '../../shared/database.js';
import { HttpError } from '../../shared/errors.js';
import { createUser } from '../users/index.js';
import { authRepository } from './repository.js';
import { hashPassword, verifyPassword } from './password.js';

export const SESSION_SECONDS = 8 * 60 * 60;
export function createAuthService(database, config) {
  const repository = authRepository(database);
  const key = new TextEncoder().encode(config.jwtSecret);
  const issuer = 'conecta-empleo';
  let dummyHash;
  async function sign(payload, audience, lifetime, subject, jti) {
    let token = new SignJWT(payload).setProtectedHeader({ alg: 'HS256', typ: 'JWT' }).setIssuer(issuer).setAudience(audience).setIssuedAt().setExpirationTime(`${lifetime}s`);
    if (subject) token = token.setSubject(subject);
    if (jti) token = token.setJti(jti);
    return token.sign(key);
  }
  async function verify(token, audience) {
    try { return (await jwtVerify(token, key, { algorithms: ['HS256'], issuer, audience, typ: 'JWT' })).payload; }
    catch { return null; }
  }
  async function newSession(client, user, previousSid) {
    const sid = randomUUID();
    await repository.createSession(client, sid, user.id, new Date(Date.now() + SESSION_SECONDS * 1000));
    if (previousSid) await repository.revokeSession(previousSid, client);
    const token = await sign({}, 'session', SESSION_SECONDS, user.id, sid);
    return { user, token };
  }
  return {
    async register(input, previousSid) {
      const passwordHash = await hashPassword(input.password);
      try { return await transaction(database, async (client) => newSession(client, await createUser(client, { ...input, passwordHash }), previousSid)); }
      catch (error) {
        if (error.code === '23505') throw new HttpError(409, 'EMAIL_EXISTS', 'Ya existe una cuenta con ese correo.');
        throw error;
      }
    },
    async login(input, previousSid) {
      const account = await repository.findCredentials(input.email);
      dummyHash ??= hashPassword(randomBytes(32).toString('hex'));
      const valid = await verifyPassword(input.password, account?.passwordHash ?? await dummyHash);
      if (!account || !valid) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Correo o contraseña incorrectos.');
      return transaction(database, (client) => newSession(client, account.user, previousSid));
    },
    async authenticate(token) {
      if (!token) return null;
      const claims = await verify(token, 'session');
      const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!claims || !uuid.test(claims.sub ?? '') || !uuid.test(claims.jti ?? '')) return null;
      const user = await repository.getSession(claims.jti, claims.sub);
      return user ? { user, sid: claims.jti } : null;
    },
    logout: repository.revokeSession,
    csrfToken(binding, sid) { return sign({ binding, sid: sid ?? null }, 'csrf', 3600); },
    async verifyCsrf(token, binding, sid) {
      if (!token || !binding) return false;
      const claims = await verify(token, 'csrf');
      return !!claims && claims.binding === binding && claims.sid === (sid ?? null);
    },
  };
}
