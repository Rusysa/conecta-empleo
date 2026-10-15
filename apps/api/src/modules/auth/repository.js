import { publicUser } from '../users/index.js';

export function authRepository(database) {
  return {
    async findCredentials(email) {
      const { rows } = await database.query('SELECT * FROM public.users WHERE email=$1', [email]);
      return rows[0] ? { user: publicUser(rows[0]), passwordHash: rows[0].password_hash } : null;
    },
    async createSession(client, sid, userId, expiresAt) {
      await client.query("INSERT INTO public.sessions (sid, data, user_id, expires_at) VALUES ($1,'{}'::jsonb,$2,$3)", [sid, userId, expiresAt]);
    },
    async getSession(sid, userId) {
      const { rows } = await database.query('SELECT u.* FROM public.sessions s JOIN public.users u ON u.id=s.user_id WHERE s.sid=$1 AND s.user_id=$2 AND s.expires_at > now()', [sid, userId]);
      return rows[0] ? publicUser(rows[0]) : null;
    },
    async revokeSession(sid, client = database) { await client.query('DELETE FROM public.sessions WHERE sid=$1', [sid]); },
  };
}
