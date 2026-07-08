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
    .select('url, producto_sku')
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

  if (image?.producto_sku) {
    const { data: remaining } = await supabaseAdmin
      .from('imagenes_productos')
      .select('id, orden')
      .eq('producto_sku', image.producto_sku)
      .order('orden', { ascending: true });

    for (let i = 0; i < (remaining?.length ?? 0); i++) {
      const row = remaining![i];
      const correctOrden = i + 1;
      if (row.orden !== correctOrden) {
        await supabaseAdmin.from('imagenes_productos').update({ orden: -(i + 1) }).eq('id', row.id);
      }
    }
    for (let i = 0; i < (remaining?.length ?? 0); i++) {
      const row = remaining![i];
      const correctOrden = i + 1;
      if (row.orden !== correctOrden) {
        await supabaseAdmin.from('imagenes_productos').update({ orden: correctOrden }).eq('id', row.id);
      }
    }
  }

  await triggerPublish();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
