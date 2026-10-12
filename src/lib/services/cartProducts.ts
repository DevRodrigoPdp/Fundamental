import { rest } from '@lib/supabase/rest';
import { cld } from '@lib/cloudinary/url';
import type { CartProduct } from '@app-types/cart';

// Productos de la cesta consultados en vivo, cacheados por id durante la visita.
const productCache = new Map<number, CartProduct>();

// Solo fotos de nuestro Cloudinary o rutas locales del sitio.
function safeImage(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith('https://res.cloudinary.com/')) return cld(url, { width: 200 });
  return /^\/[\w\-./]+$/.test(url) ? url : null;
}

export function getCachedProduct(id: number) {
  return productCache.get(id);
}

export async function loadProducts(ids: number[]) {
  const missing = ids.filter((id) => !productCache.has(id));
  if (missing.length === 0) return;

  const products = await rest<Omit<CartProduct, 'imagen'>[]>(
    `productos_t3r?select=id,nombre,sku,subcategoria,precio,stock,activo,estado_stock&id=in.(${missing.join(',')})`
  );
  const skus = products.map((p) => `"${p.sku}"`).join(',');
  const images = skus
    ? await rest<{ producto_sku: string; url: string }[]>(
        `imagenes_productos?select=producto_sku,url&orden=eq.1&producto_sku=in.(${encodeURIComponent(skus)})`
      )
    : [];
  const imageBySku = new Map(images.map((i) => [i.producto_sku, i.url]));

  for (const p of products) {
    productCache.set(p.id, { ...p, imagen: safeImage(imageBySku.get(p.sku)) });
  }
}

export function priceCents(p: CartProduct) {
  return Math.round(Number(p.precio) * 100);
}
