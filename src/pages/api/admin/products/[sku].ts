import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { triggerPublish } from '../../../../lib/publish';

export const prerender = false;

const EDITABLE_FIELDS = [
  'nombre',
  'categoria',
  'subcategoria',
  'descripcion',
  'descripcion_corta',
  'descripcion_homepage',
  'especificaciones',
  'stock',
  'precio',
  'activo',
] as const;

export const GET: APIRoute = async ({ params }) => {
  const { data: product, error } = await supabaseAdmin
    .from('productos_t3r')
    .select('*')
    .eq('sku', params.sku)
    .single();

  if (error || !product) {
    return new Response(JSON.stringify({ error: 'Producto no encontrado' }), { status: 404 });
  }

  const { data: images } = await supabaseAdmin
    .from('imagenes_productos')
    .select('*')
    .eq('producto_sku', params.sku)
    .order('orden', { ascending: true });

  return new Response(JSON.stringify({ product, images: images ?? [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) updates[field] = body[field];
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('productos_t3r')
    .update(updates)
    .eq('sku', params.sku)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  await triggerPublish();

  return new Response(JSON.stringify({ product: data }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  await supabaseAdmin.from('imagenes_productos').delete().eq('producto_sku', params.sku);
  const { error } = await supabaseAdmin.from('productos_t3r').delete().eq('sku', params.sku);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  await triggerPublish();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
