import { argon2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(argon2);
const parameters = { memory: 65536, passes: 3, parallelism: 1, tagLength: 32 };

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await derive('argon2id', { ...parameters, message: password, nonce: salt });
  return `$argon2id$v=19$m=65536,t=3,p=1$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(password, encoded) {
  const parts = encoded.split('$');
  if (parts.length !== 6 || parts[1] !== 'argon2id' || parts[2] !== 'v=19' || parts[3] !== 'm=65536,t=3,p=1') return false;
  const expected = Buffer.from(parts[5], 'base64');
  const actual = await derive('argon2id', { ...parameters, message: password, nonce: Buffer.from(parts[4], 'base64') });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
