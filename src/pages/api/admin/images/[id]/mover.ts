import type { APIRoute } from 'astro';
import { triggerPublish } from '@lib/admin/publish';
import { moveImage } from '@lib/admin/images';
import { handle, json } from '@lib/admin/http';

export const prerender = false;

export const POST: APIRoute = handle(async ({ params, request }) => {
  const { direction } = await request.json();
  if (direction !== 'up' && direction !== 'down') {
    return json({ error: 'direction debe ser up o down' }, 400);
  }

  if (await moveImage(params.id as string, direction)) await triggerPublish();
  return json({ ok: true });
});
