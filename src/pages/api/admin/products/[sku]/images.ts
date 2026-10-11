import type { APIRoute } from 'astro';
import { triggerPublish } from '@lib/admin/publish';
import { uploadProductImage } from '@lib/admin/images';
import { handle, json } from '@lib/admin/http';

export const prerender = false;

export const POST: APIRoute = handle(async ({ params, request }) => {
  const file = (await request.formData()).get('file');
  if (!(file instanceof File)) return json({ error: 'Falta el archivo' }, 400);

  const image = await uploadProductImage(params.sku as string, file);
  await triggerPublish();
  return json({ image }, 201);
});
