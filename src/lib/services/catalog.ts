import { DISK_FAMILIES } from '@config/productTaxonomy';
import { getActiveProducts } from '@lib/supabase/products';
import { getCoverImages } from '@lib/supabase/images';
import { diskSize } from '@lib/utils/sku';
import type { CatalogItem } from '@app-types/product';
import type { EstadoStock } from '@config/stockStates';

// Las medidas de una familia de discos se muestran como una sola tarjeta (representante: 140 mm).
function groupDiskFamilies(items: CatalogItem[]) {
  const groupedPrefixes = new Set<string>();
  return items.flatMap((item) => {
    const family = DISK_FAMILIES.find(({ prefix }) => item.sku.startsWith(prefix));
    if (!family) return [item];
    if (groupedPrefixes.has(family.prefix)) return [];
    groupedPrefixes.add(family.prefix);

    const variants = items
      .filter((candidate) => candidate.sku.startsWith(family.prefix))
      .sort((a, b) => diskSize(a.sku) - diskSize(b.sku));
    const representative = variants.find((variant) => variant.sku.endsWith('-140')) ?? variants[0];
    const sizes = variants.map((variant) => variant.sku.match(/(\d+)$/)?.[1]).filter(Boolean);

    return [{
      ...representative,
      nombre: family.nombre,
      descripcion: `Disponible en ${sizes.join(', ')} mm. Selecciona la medida dentro del producto.`,
      refLabel: `${sizes.join(' · ')} mm`,
      searchSku: variants.map((variant) => variant.sku).join(' '),
    }];
  });
}

// Catálogo completo para /catalogo, ordenado por nombre.
export async function getCatalog() {
  const products = await getActiveProducts();
  const covers = await getCoverImages(products.map((p) => p.sku));

  const items: CatalogItem[] = products.map((p) => ({
    nombre: p.nombre,
    categoria: p.categoria,
    subcategoria: p.subcategoria,
    descripcion: p.descripcion_corta,
    sku: p.sku,
    imagen: covers[p.sku] ?? null,
    estadoStock: (p.estado_stock ?? 'disponible') as EstadoStock,
  }));

  return groupDiskFamilies(items).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
  );
}
