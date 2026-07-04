import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const map = JSON.parse(await readFile('scripts/cloudinary-map.json', 'utf-8'));
const apply = process.argv.includes('--apply');

const { data: rows, error } = await supabase.from('imagenes_productos').select('id, url');
if (error) throw error;

let matched = 0;
let unmatched = 0;
const updates = [];

for (const row of rows) {
  const key = '/' + row.url.replace(/^\/+/, '');
  const cloudUrl = map[key];
  if (!cloudUrl) {
    console.warn(`SIN MATCH id=${row.id} url=${row.url}`);
    unmatched++;
    continue;
  }
  matched++;
  updates.push({ id: row.id, from: row.url, to: cloudUrl });
}

console.log(`\nFilas totales: ${rows.length}  Con match: ${matched}  Sin match: ${unmatched}`);

if (!apply) {
  console.log('\n--- DRY RUN (no se aplicó nada). Ejemplos: ---');
  updates.slice(0, 5).forEach((u) => console.log(`id=${u.id}: ${u.from} -> ${u.to}`));
  console.log('\nRelanza con --apply para escribir en Supabase.');
} else {
  let done = 0;
  for (const u of updates) {
    const { error: updErr } = await supabase.from('imagenes_productos').update({ url: u.to }).eq('id', u.id);
    if (updErr) {
      console.error(`ERROR id=${u.id}:`, updErr.message);
    } else {
      done++;
    }
  }
  console.log(`\nActualizadas: ${done}/${updates.length}`);
}
