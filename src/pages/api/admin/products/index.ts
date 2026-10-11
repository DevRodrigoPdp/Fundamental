import type { APIRoute } from 'astro';
import { triggerPublish } from '@lib/admin/publish';
import { createProduct, listProductsWithImageCounts } from '@lib/admin/products';
import { handle, json } from '@lib/admin/http';

export const prerender = false;

export const GET: APIRoute = handle(async () => {
  return json({ products: await listProductsWithImageCounts() });
});

export const POST: APIRoute = handle(async ({ request }) => {
  const product = await createProduct(await request.json());
  await triggerPublish();
  return json({ product }, 201);
});
