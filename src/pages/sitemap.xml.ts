import type { APIRoute } from 'astro';
import { buildSitemap } from '@lib/seo/sitemap';

export const GET: APIRoute = async () => {
  return new Response(await buildSitemap(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
