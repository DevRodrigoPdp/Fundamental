import type { APIRoute } from 'astro';
import { triggerPublish } from '@lib/admin/publish';
import { deleteProduct, getProductWithImages, updateProduct } from '@lib/admin/products';
import { handle, json } from '@lib/admin/http';

export const prerender = false;

export const GET: APIRoute = handle(async ({ params }) => {
  const result = await getProductWithImages(params.sku as string);
  if (!result) return json({ error: 'Producto no encontrado' }, 404);
  return json(result);
});

export const PUT: APIRoute = handle(async ({ params, request }) => {
  const product = await updateProduct(params.sku as string, await request.json());
  await triggerPublish();
  return json({ product });
});

export const DELETE: APIRoute = handle(async ({ params }) => {
  await deleteProduct(params.sku as string);
  await triggerPublish();
  return json({ ok: true });
});
