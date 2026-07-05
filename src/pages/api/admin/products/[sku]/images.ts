import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';
import { cloudinary } from '../../../../../lib/cloudinary';
import { triggerPublish } from '../../../../../lib/publish';

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const sku = params.sku as string;
  const form = await request.formData();
  const file = form.get('file');

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'Falta el archivo' }), { status: 400 });
  }

  const { data: existing } = await supabaseAdmin
    .from('imagenes_productos')
    .select('orden')
    .eq('producto_sku', sku)
    .order('orden', { ascending: false })
    .limit(1);

  const nextOrden = (existing?.[0]?.orden ?? 0) + 1;

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicId = `catalogo_t3r/admin/${sku}-${Date.now()}`;

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ public_id: publicId }, (err, result) =>
      err ? reject(err) : resolve(result)
    );
    stream.end(buffer);
  }).catch((e: Error) => ({ error: e.message }));

  if (uploadResult.error) {
    return new Response(JSON.stringify({ error: uploadResult.error }), { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('imagenes_productos')
    .insert({ producto_sku: sku, url: uploadResult.secure_url, orden: nextOrden })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  await triggerPublish();

  return new Response(JSON.stringify({ image: data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
