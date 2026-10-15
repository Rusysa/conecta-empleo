import { readConfig } from '../src/shared/config.js';
import { createDatabase } from '../src/shared/database.js';

const config = readConfig();
const database = createDatabase(config.databaseUrl, config.databaseCaFile);
try {
  const result = await database.query('DELETE FROM public.sessions WHERE expires_at <= now()');
  console.log(`Sesiones caducadas eliminadas: ${result.rowCount}`);
} finally { await database.end(); }
