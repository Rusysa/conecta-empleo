import { createApp } from './app.js';
import { readConfig } from './shared/config.js';
import { createDatabase } from './shared/database.js';

const port = Number(process.env.PORT || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT no válido.');
const config = readConfig();
const database = createDatabase(config.databaseUrl, config.databaseCaFile);
await database.query('SELECT user_id FROM public.sessions LIMIT 0');
const server = createApp({ database, config }).listen(port, () => console.log(`API: http://localhost:${port}/api/v1/health`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  server.close(async () => { await database.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10000).unref();
});
