import { supabaseAdmin } from '@lib/supabase/admin';
import { findSkuPrefix } from '@config/productTaxonomy';
import { AdminError } from './http';

// Campos que el panel puede modificar con PUT.
const EDITABLE_FIELDS = [
  'nombre',
  'categoria',
  'subcategoria',
  'descripcion',
  'descripcion_corta',
  'descripcion_homepage',
  'especificaciones',
  'stock',
  'estado_stock',
  'precio',
  'activo',
] as const;

async function countImagesBySku() {
  const { data } = await supabaseAdmin.from('imagenes_productos').select('producto_sku');
  const counts: Record<string, number> = {};
  (data ?? []).forEach((row: { producto_sku: string }) => {
    counts[row.producto_sku] = (counts[row.producto_sku] ?? 0) + 1;
  });
  return counts;
}

// Listado del dashboard: productos + portada + nº de fotos.
export async function getDashboardData() {
  const { data: products } = await supabaseAdmin
    .from('productos_t3r')
    .select('sku, nombre, categoria, subcategoria, stock, activo')
    .order('categoria', { ascending: true })
    .order('nombre', { ascending: true });

  const { data: covers } = await supabaseAdmin
    .from('imagenes_productos')
    .select('producto_sku, url')
    .eq('orden', 1);

  const coverBySku: Record<string, string> = {};
  (covers ?? []).forEach((row: { producto_sku: string; url: string }) => {
    coverBySku[row.producto_sku] = row.url;
  });

  return { products: products ?? [], coverBySku, imageCountBySku: await countImagesBySku() };
}

export async function listProductsWithImageCounts() {
  const { data: products, error } = await supabaseAdmin
    .from('productos_t3r')
    .select('*')
    .order('categoria', { ascending: true })
    .order('nombre', { ascending: true });

  if (error) throw new AdminError(error.message);

  const counts = await countImagesBySku();
  return (products ?? []).map((p) => ({ ...p, imagenes_count: counts[p.sku] ?? 0 }));
}

// Producto con sus fotos ordenadas. null si no existe.
export async function getProductWithImages(sku: string) {
  const { data: product, error } = await supabaseAdmin
    .from('productos_t3r')
    .select('*')
    .eq('sku', sku)
    .single();

  if (error || !product) return null;

  const { data: images } = await supabaseAdmin
    .from('imagenes_productos')
    .select('*')
    .eq('producto_sku', sku)
    .order('orden', { ascending: true });

  return { product, images: images ?? [] };
}

// Siguiente SKU libre para un prefijo (T3R-PAST → T3R-PAST-012).
async function generateSku(prefix: string): Promise<string> {
  const { data } = await supabaseAdmin.from('productos_t3r').select('sku').ilike('sku', `${prefix}-%`);
  let max = 0;
  (data ?? []).forEach((row: { sku: string }) => {
    const match = row.sku.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

export async function createProduct(body: Record<string, any>) {
  const { nombre, categoria } = body;
  if (!nombre || !categoria) {
    throw new AdminError('nombre y categoria son obligatorios', 400);
  }

  let sku = body.sku;
  if (!sku) {
    const prefix = findSkuPrefix(body.subcategoria ?? null);
    if (!prefix) {
      throw new AdminError('No se pudo generar el SKU: falta indicar el SKU manualmente para este tipo.', 400);
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

  if (error) throw new AdminError(error.message);
  return data;
}

export async function updateProduct(sku: string, body: Record<string, unknown>) {
  const updates: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) updates[field] = body[field];
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('productos_t3r')
    .update(updates)
    .eq('sku', sku)
    .select()
    .single();

  if (error) throw new AdminError(error.message);
  return data;
}

// Borra el producto y sus filas de imágenes.
export async function deleteProduct(sku: string) {
  await supabaseAdmin.from('imagenes_productos').delete().eq('producto_sku', sku);
  const { error } = await supabaseAdmin.from('productos_t3r').delete().eq('sku', sku);
  if (error) throw new AdminError(error.message);
}
