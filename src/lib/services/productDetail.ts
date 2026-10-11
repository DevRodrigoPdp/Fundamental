import { getActiveSkus, getProductBySku, getRelatedProducts } from '@lib/supabase/products';
import { getCoverImages, getProductImages } from '@lib/supabase/images';
import { diskSize, isDiskSku } from '@lib/utils/sku';
import type { DiskVariant, ProductCardData } from '@app-types/product';

export { getActiveSkus };

// Todo lo que necesita la ficha /catalogo/[sku]. null si el SKU no existe.
export async function getProductDetail(sku: string) {
  const product = await getProductBySku(sku);
  if (!product) return null;

  const images = await getProductImages(sku);
  const relatedRaw = await getRelatedProducts(product);
  const covers = await getCoverImages(relatedRaw.map((p) => p.sku));

  const related: ProductCardData[] = relatedRaw.map((p) => ({ ...p, imagen: covers[p.sku] ?? null }));

  // Los discos muestran selector de medida en lugar de relacionados.
  const isDiskFamily = isDiskSku(product.sku);
  const diskVariants: DiskVariant[] = isDiskFamily
    ? [product, ...relatedRaw]
        .map((variant) => ({ sku: variant.sku, size: diskSize(variant.sku) }))
        .filter((variant) => Number.isFinite(variant.size))
        .sort((a, b) => a.size - b.size)
    : [];

  return { product, images, related, isDiskFamily, diskVariants };
}
