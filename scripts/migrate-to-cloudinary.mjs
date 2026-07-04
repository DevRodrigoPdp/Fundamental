import { v2 as cloudinary } from 'cloudinary';
import { readdir, stat, writeFile } from 'fs/promises';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOTS = ['public/catalogo_t3r', 'public/catalogo_whipoff', 'public/catalogo_transferbike'];
const MAP_FILE = 'scripts/cloudinary-map.json';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function toPublicId(relPath) {
  const noExt = relPath.replace(/\.[^.]+$/, '');
  return noExt.replace(/\\/g, '/');
}

const map = {};
let uploaded = 0;
let skipped = 0;

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const rel = path.relative('public', file).replace(/\\/g, '/');
    if (rel.includes('#')) {
      console.warn(`SKIP (nombre inválido para Cloudinary): ${rel}`);
      skipped++;
      continue;
    }
    const publicId = toPublicId(rel);
    try {
      const res = await cloudinary.uploader.upload(file, {
        public_id: publicId,
        overwrite: false,
        unique_filename: false,
        use_filename: false,
      });
      map['/' + rel] = res.secure_url;
      uploaded++;
      console.log(`${rel} -> ${res.secure_url}`);
    } catch (e) {
      console.error(`ERROR ${rel}:`, e.message);
    }
  }
}

await writeFile(MAP_FILE, JSON.stringify(map, null, 2));
console.log(`\n--- RESUMEN ---`);
console.log(`Subidas: ${uploaded}  Saltadas: ${skipped}`);
console.log(`Mapping guardado en ${MAP_FILE}`);
