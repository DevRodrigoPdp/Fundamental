import { catalogFamilies } from '@config/catalogFamilies';
import { getActiveProductSummaries } from '@lib/supabase/products';
import { getCoverImages } from '@lib/supabase/images';
import type { CatalogFamily } from '@app-types/catalog';
import type { ProductCardData, ProductSummary } from '@app-types/product';

export function productBelongsToFamily(product: ProductSummary, family: CatalogFamily) {
  if (family.skuPrefixes.some((prefix) => product.sku?.startsWith(prefix))) return true;
  return family.subcategories?.includes(product.subcategoria as string) ?? false;
}

// Una página por familia con sus productos ordenados por nombre.
export async function getFamilyPages() {
  const products = await getActiveProductSummaries();
  const covers = await getCoverImages(products.map((p) => p.sku));

  return catalogFamilies.map((family) => ({
    family,
    products: products
      .filter((product) => productBelongsToFamily(product, family))
      .map((product): ProductCardData => ({ ...product, imagen: covers[product.sku] ?? null }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })),
  }));
}
