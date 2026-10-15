import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';

const source = new URL('../database/migrations/', import.meta.url);
const target = new URL('../supabase/migrations/', import.meta.url);
await mkdir(target, { recursive: true });
const names = (await readdir(source)).filter((name) => name.endsWith('.sql')).sort();
for (const name of names) {
  const contents = await readFile(new URL(name, source), 'utf8');
  if (process.argv.includes('--check')) {
    if (await readFile(new URL(name, target), 'utf8') !== contents) throw new Error(`Migración desactualizada: ${name}`);
  } else { await writeFile(new URL(name, target), contents); }
}
const extra = (await readdir(target)).filter((name) => name.endsWith('.sql') && !names.includes(name));
if (extra.length) throw new Error(`Migraciones sin fuente canónica: ${extra.join(', ')}`);
console.log(`${names.length} migraciones sincronizadas.`);
