import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const ROOTS = [
  'public/catalogo_t3r',
  'public/catalogo_whipoff',
  'public/catalogo_transferbike',
];

const MAX_WIDTH_JPG = 2200;
const MAX_WIDTH_PNG = 2000;
const SKIP_UNDER_BYTES = 150 * 1024; // no merece la pena reprocesar archivos ya pequeños

let totalBefore = 0;
let totalAfter = 0;
let processed = 0;
let skipped = 0;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const before = (await stat(file)).size;
  if (before < SKIP_UNDER_BYTES) {
    skipped++;
    totalBefore += before;
    totalAfter += before;
    return;
  }

  const buffer = await sharp(file).rotate().toBuffer();
  const img = sharp(buffer);
  const meta = await img.metadata();

  let pipeline = sharp(buffer).rotate();

  if (ext === '.png') {
    if (meta.width > MAX_WIDTH_PNG) {
      pipeline = pipeline.resize({ width: MAX_WIDTH_PNG, withoutEnlargement: true });
    }
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else {
    if (meta.width > MAX_WIDTH_JPG) {
      pipeline = pipeline.resize({ width: MAX_WIDTH_JPG, withoutEnlargement: true });
    }
    pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true });
  }

  const outBuffer = await pipeline.toBuffer();

  if (outBuffer.length < before) {
    await sharp(outBuffer).toFile(file + '.tmp');
    const fs = await import('fs/promises');
    await fs.rename(file + '.tmp', file);
    totalBefore += before;
    totalAfter += outBuffer.length;
    processed++;
    console.log(`${file}  ${(before/1024).toFixed(0)}KB -> ${(outBuffer.length/1024).toFixed(0)}KB`);
  } else {
    totalBefore += before;
    totalAfter += before;
    skipped++;
  }
}

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    try {
      await processFile(file);
    } catch (e) {
      console.error(`ERROR ${file}:`, e.message);
    }
  }
}

console.log('\n--- RESUMEN ---');
console.log(`Procesados: ${processed}  Saltados (ya pequeños): ${skipped}`);
console.log(`Antes:  ${(totalBefore/1024/1024).toFixed(1)} MB`);
console.log(`Después: ${(totalAfter/1024/1024).toFixed(1)} MB`);
console.log(`Ahorro: ${((1 - totalAfter/totalBefore)*100).toFixed(1)}%`);
