import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';
import { triggerPublish } from '../../../../../lib/publish';

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const { direction } = await request.json();
  if (direction !== 'up' && direction !== 'down') {
    return new Response(JSON.stringify({ error: 'direction debe ser up o down' }), { status: 400 });
  }

  const { data: current } = await supabaseAdmin
    .from('imagenes_productos')
    .select('id, producto_sku, orden')
    .eq('id', params.id)
    .single();

  if (!current) {
    return new Response(JSON.stringify({ error: 'Imagen no encontrada' }), { status: 404 });
  }

  const { data: siblings } = await supabaseAdmin
    .from('imagenes_productos')
    .select('id, orden')
    .eq('producto_sku', current.producto_sku)
    .order('orden', { ascending: true });

  const list = siblings ?? [];
  const index = list.findIndex((row: any) => row.id === current.id);
  const neighborIndex = direction === 'up' ? index - 1 : index + 1;

  if (neighborIndex < 0 || neighborIndex >= list.length) {
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  const neighbor = list[neighborIndex];

  // (producto_sku, orden) tiene un constraint único: hay que pasar por un valor
  // temporal para no chocar con el propio valor que se está liberando.
  const { error: e1 } = await supabaseAdmin.from('imagenes_productos').update({ orden: -1 }).eq('id', current.id);
  const { error: e2 } = await supabaseAdmin.from('imagenes_productos').update({ orden: current.orden }).eq('id', neighbor.id);
  const { error: e3 } = await supabaseAdmin.from('imagenes_productos').update({ orden: neighbor.orden }).eq('id', current.id);

  const error = e1 || e2 || e3;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  await triggerPublish();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
