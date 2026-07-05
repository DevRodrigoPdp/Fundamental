import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { cloudinary } from '../../../../lib/cloudinary';
import { triggerPublish } from '../../../../lib/publish';

export const prerender = false;

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

export const DELETE: APIRoute = async ({ params }) => {
  const { data: image } = await supabaseAdmin
    .from('imagenes_productos')
    .select('url')
    .eq('id', params.id)
    .single();

  const { error } = await supabaseAdmin.from('imagenes_productos').delete().eq('id', params.id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (image?.url) {
    const publicId = extractPublicId(image.url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
  }

  await triggerPublish();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
