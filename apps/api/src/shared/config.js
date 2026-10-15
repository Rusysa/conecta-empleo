export function readConfig(env = process.env) {
  if (!env.DATABASE_URL) throw new Error('Configura DATABASE_URL en apps/api/.env.');
  if (!env.JWT_SECRET || Buffer.byteLength(env.JWT_SECRET) < 32) throw new Error('JWT_SECRET debe tener al menos 32 bytes aleatorios.');
  const origins = (env.APP_ORIGINS || 'http://localhost:3000,http://localhost:5173').split(',').map((s) => s.trim());
  for (const origin of origins) {
    const url = new URL(origin);
    if (url.origin !== origin || (env.NODE_ENV === 'production' && url.protocol !== 'https:')) throw new Error('APP_ORIGINS debe contener orígenes completos; HTTPS en producción.');
  }
  const databaseUrl = new URL(env.DATABASE_URL);
  if (env.NODE_ENV === 'production' && !env.DATABASE_SSL_CA_FILE && databaseUrl.searchParams.get('sslmode') !== 'verify-full') throw new Error('Producción requiere TLS verificado: DATABASE_SSL_CA_FILE o sslmode=verify-full.');
  return { databaseUrl: env.DATABASE_URL, databaseCaFile: env.DATABASE_SSL_CA_FILE, jwtSecret: env.JWT_SECRET, production: env.NODE_ENV === 'production', origins };
}
