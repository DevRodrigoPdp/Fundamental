import { supabase } from './client';

// Foto de portada (orden 1) de cada SKU.
export async function getCoverImages(skus: string[]) {
  const covers: Record<string, string> = {};
  if (skus.length === 0) return covers;

  const { data } = await supabase
    .from('imagenes_productos')
    .select('producto_sku, url')
    .in('producto_sku', skus)
    .eq('orden', 1);

  (data ?? []).forEach((i: { producto_sku: string; url: string | null }) => {
    if (i.url) covers[i.producto_sku] = i.url;
  });
  return covers;
}

// Todas las fotos de un producto, en orden.
export async function getProductImages(sku: string) {
  const { data } = await supabase
    .from('imagenes_productos')
    .select('url, orden')
    .eq('producto_sku', sku)
    .order('orden', { ascending: true });

  return (data ?? []).map((i: { url: string | null }) => i.url).filter((url): url is string => !!url);
}
