import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { supabase } from '../lib/supabase';

const staticPaths = [
  '/',
  '/t3r',
  '/catalogo',
  '/marcas',
  '/nosotros',
  '/contacto',
  '/transfer',
  '/whipp-off',
];

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async () => {
  const { data: products } = await supabase
    .from('productos_t3r')
    .select('sku')
    .eq('activo', true);

  const productPaths = (products ?? []).map(({ sku }) => `/catalogo/${encodeURIComponent(sku)}/`);
  const urls = [...staticPaths, ...productPaths];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => {
  const normalizedPath = path === '/' || path.endsWith('/') ? path : `${path}/`;
  return `  <url><loc>${escapeXml(new URL(normalizedPath, SITE.url).toString())}</loc></url>`;
}).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
