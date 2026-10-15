import pg from 'pg';
import { readFileSync } from 'node:fs';

export function createDatabase(connectionString, caFile) {
  let ssl;
  if (caFile) {
    const url = new URL(connectionString);
    for (const option of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) url.searchParams.delete(option);
    connectionString = url.toString();
    ssl = { ca: readFileSync(caFile, 'utf8'), rejectUnauthorized: true };
  }
  const pool = new pg.Pool({ connectionString, ssl, max: 10, connectionTimeoutMillis: 10000, idleTimeoutMillis: 30000, statement_timeout: 15000 });
  pool.on('error', () => console.error('Se perdió una conexión inactiva con PostgreSQL.'));
  return pool;
}

export async function transaction(database, operation) {
  const client = await database.connect();
  try {
    await client.query('BEGIN');
    const result = await operation(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
