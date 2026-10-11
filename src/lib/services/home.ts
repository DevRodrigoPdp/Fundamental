import { supabase } from '@lib/supabase/client';

export interface NewProduct {
  category: string;
  name: string;
  ref: string;
  imagen: string | null;
}

// Novedades del carrusel de la home (8 productos activos con su primera foto).
// Corre en build: el HTML ya lleva los productos, indexable por Google y visible en previews.
export async function getNewProducts(limit = 8): Promise<NewProduct[]> {
  const { data: products, error } = await supabase
    .from('productos_t3r')
    .select('nombre, categoria, descripcion_corta, sku')
    .eq('activo', true)
    .limit(limit);

  if (error) console.error('Supabase productos error:', error.message);

  const skus = (products ?? []).map((p: { sku: string }) => p.sku);
  const { data: imagenes, error: imgError } = await supabase
    .from('imagenes_productos')
    .select('producto_sku, url, orden')
    .in('producto_sku', skus)
    .order('orden', { ascending: true });

  if (imgError) console.error('Supabase imagenes error:', imgError.message);

  const firstImage: Record<string, string> = {};
  (imagenes ?? []).forEach((i: { producto_sku: string; url: string }) => {
    if (!firstImage[i.producto_sku]) firstImage[i.producto_sku] = i.url;
  });

  return (products ?? []).map((p: { nombre: string; categoria: string; sku: string }) => ({
    category: p.categoria,
    name: p.nombre,
    ref: p.sku,
    imagen: firstImage[p.sku] ?? null,
  }));
}
