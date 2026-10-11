import { supabase } from './client';
import type { Product, ProductSummary } from '@app-types/product';

const SUMMARY_FIELDS = 'nombre, sku, subcategoria, categoria, descripcion_corta';

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from('productos_t3r')
    .select('*')
    .eq('activo', true)
    .order('categoria', { ascending: true });

  if (error) console.error('Supabase productos error:', error.message);
  return (data ?? []) as Product[];
}

export async function getActiveSkus() {
  const { data } = await supabase.from('productos_t3r').select('sku').eq('activo', true);
  return (data ?? []).map((p: { sku: string }) => p.sku);
}

export async function getActiveProductSummaries() {
  const { data } = await supabase
    .from('productos_t3r')
    .select('nombre, descripcion_corta, sku, categoria, subcategoria')
    .eq('activo', true);
  return (data ?? []) as ProductSummary[];
}

export async function getProductBySku(sku: string) {
  const { data } = await supabase.from('productos_t3r').select('*').eq('sku', sku).single();
  return data as Product | null;
}

// Hasta 4 de la misma subcategoría; si faltan, se completa con la misma categoría.
export async function getRelatedProducts(product: Product, limit = 4) {
  const { data: sameSub } = await supabase
    .from('productos_t3r')
    .select(SUMMARY_FIELDS)
    .eq('subcategoria', product.subcategoria)
    .eq('activo', true)
    .neq('sku', product.sku)
    .limit(limit);

  let related = (sameSub ?? []) as ProductSummary[];
  if (related.length >= limit) return related;

  const { data: sameCat } = await supabase
    .from('productos_t3r')
    .select(SUMMARY_FIELDS)
    .eq('categoria', product.categoria)
    .eq('activo', true)
    .limit(12);

  const seen = new Set([product.sku, ...related.map((p) => p.sku)]);
  const fill = ((sameCat ?? []) as ProductSummary[]).filter((p) => !seen.has(p.sku));
  return [...related, ...fill].slice(0, limit);
}
