import { readFile, writeFile } from 'fs/promises';

const map = JSON.parse(await readFile('scripts/cloudinary-map.json', 'utf-8'));
const files = [
  'src/pages/whipp-off.astro',
  'src/pages/transfer.astro',
  'src/pages/index.astro',
  'src/pages/t3r.astro',
  'src/pages/catalogo.astro',
  'src/components/Nav.astro',
  'src/data/catalog-families.ts',
];

const entries = Object.entries(map).sort((a, b) => b[0].length - a[0].length);

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const file of files) {
  let content = await readFile(file, 'utf-8');
  let count = 0;
  for (const [localPath, cloudUrl] of entries) {
    // solo reemplaza cuando localPath está entre comillas/paréntesis (no dentro de otra URL ya migrada)
    const re = new RegExp(`(["'(])${escapeRegExp(localPath)}(["')])`, 'g');
    content = content.replace(re, (_match, pre, post) => {
      count++;
      return pre + cloudUrl + post;
    });
  }
  await writeFile(file, content);
  console.log(`${file}: ${count} reemplazos`);
}
