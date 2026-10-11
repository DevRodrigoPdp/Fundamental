import type { APIRoute } from 'astro';
import { triggerPublish } from '@lib/admin/publish';
import { deleteImage } from '@lib/admin/images';
import { handle, json } from '@lib/admin/http';

export const prerender = false;

export const DELETE: APIRoute = handle(async ({ params }) => {
  await deleteImage(params.id as string);
  await triggerPublish();
  return json({ ok: true });
});
