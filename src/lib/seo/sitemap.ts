import { SITE } from '@config/site';
import { STATIC_PATHS } from '@config/routes';
import { catalogFamilies } from '@config/catalogFamilies';
import { getActiveSkus } from '@lib/supabase/products';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

// sitemap.xml: páginas estáticas, familias y fichas de producto activas.
export async function buildSitemap() {
  const skus = await getActiveSkus();
  const productPaths = skus.map((sku) => `/catalogo/${encodeURIComponent(sku)}/`);
  const familyPaths = catalogFamilies.map(({ slug }) => `/catalogo/familia/${slug}/`);
  const urls = [...STATIC_PATHS, ...familyPaths, ...productPaths];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => {
  const normalizedPath = path === '/' || path.endsWith('/') ? path : `${path}/`;
  return `  <url><loc>${escapeXml(new URL(normalizedPath, SITE.url).toString())}</loc></url>`;
}).join('\n')}
</urlset>
`;
}
