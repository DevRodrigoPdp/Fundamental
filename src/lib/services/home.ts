import { supabase } from '@lib/supabase/client';

export interface NewProduct {
  category: string;
  name: string;
  ref: string;
  imagen: string | null;
}

type ProductRow = { nombre: string; categoria: string; sku: string };

// Reparte los productos alternando categorías (uno de cada, luego el segundo de cada…)
// para que el carrusel no empiece con varios del mismo tipo seguidos.
function interleaveByCategory(rows: ProductRow[]): ProductRow[] {
  const groups = new Map<string, ProductRow[]>();
  rows.forEach((r) => groups.set(r.categoria, [...(groups.get(r.categoria) ?? []), r]));
  const queues = [...groups.values()];
  const out: ProductRow[] = [];
  for (let i = 0; out.length < rows.length; i++) {
    queues.forEach((q) => { if (q[i]) out.push(q[i]); });
  }
  return out;
}

// Novedades del carrusel de la home (12 productos activos con su primera foto, variados por categoría).
// Corre en build: el HTML ya lleva los productos, indexable por Google y visible en previews.
export async function getNewProducts(limit = 12): Promise<NewProduct[]> {
  const { data: rows, error } = await supabase
    .from('productos_t3r')
    .select('nombre, categoria, descripcion_corta, sku')
    .eq('activo', true);

  if (error) console.error('Supabase productos error:', error.message);

  const products = interleaveByCategory((rows ?? []) as ProductRow[]).slice(0, limit);
  const skus = products.map((p) => p.sku);
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

  return products.map((p) => ({
    category: p.categoria,
    name: p.nombre,
    ref: p.sku,
    imagen: firstImage[p.sku] ?? null,
  }));
}
