import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { triggerPublish } from '../../../../lib/publish';
import { findSkuPrefix } from '../../../../data/product-taxonomy';

async function generateSku(prefix: string): Promise<string> {
  const { data } = await supabaseAdmin.from('productos_t3r').select('sku').ilike('sku', `${prefix}-%`);
  let max = 0;
  (data ?? []).forEach((row: any) => {
    const match = row.sku.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

export const prerender = false;

export const GET: APIRoute = async () => {
  const { data: products, error } = await supabaseAdmin
    .from('productos_t3r')
    .select('*')
    .order('categoria', { ascending: true })
    .order('nombre', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const { data: images } = await supabaseAdmin
    .from('imagenes_productos')
    .select('producto_sku');

  const imageCounts: Record<string, number> = {};
  (images ?? []).forEach((row: any) => {
    imageCounts[row.producto_sku] = (imageCounts[row.producto_sku] ?? 0) + 1;
  });

  const withCounts = (products ?? []).map((p: any) => ({ ...p, imagenes_count: imageCounts[p.sku] ?? 0 }));

  return new Response(JSON.stringify({ products: withCounts }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { nombre, categoria } = body;

  if (!nombre || !categoria) {
    return new Response(JSON.stringify({ error: 'nombre y categoria son obligatorios' }), { status: 400 });
  }

  let sku = body.sku;
  if (!sku) {
    const prefix = findSkuPrefix(body.subcategoria ?? null);
    if (!prefix) {
      return new Response(JSON.stringify({ error: 'No se pudo generar el SKU: falta indicar el SKU manualmente para este tipo.' }), { status: 400 });
    }
    sku = await generateSku(prefix);
  }

  const { data, error } = await supabaseAdmin
    .from('productos_t3r')
    .insert({
      nombre,
      categoria,
      subcategoria: body.subcategoria ?? null,
      descripcion: body.descripcion ?? null,
      descripcion_corta: body.descripcion_corta ?? null,
      descripcion_homepage: body.descripcion_homepage ?? null,
      sku,
      especificaciones: body.especificaciones ?? null,
      stock: body.stock ?? null,
      estado_stock: body.estado_stock ?? 'disponible',
      precio: body.precio ?? null,
      activo: body.activo ?? true,
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  await triggerPublish();

  return new Response(JSON.stringify({ product: data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
