import { SITE, absoluteUrl } from '@config/site';
import type { Product } from '@app-types/product';

type Crumb = { name: string; item: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })),
  };
}

export function collectionPageSchema({ name, description, url }: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    isPartOf: { '@id': `${SITE.url}/#website` },
  };
}

export function productDescription(product: Product) {
  return (
    product.descripcion_corta
    ?? product.descripcion
    ?? `${product.nombre} de T3R. Consulta características, medidas y disponibilidad en Fundamental Bike Parts.`
  ).replace(/\s+/g, ' ').trim().slice(0, 160);
}

// Product + BreadcrumbList para la ficha de producto.
export function productSchemas(product: Product, images: string[]) {
  const productUrl = absoluteUrl(`/catalogo/${product.sku}/`);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${productUrl}#product`,
      name: product.nombre,
      description: productDescription(product),
      sku: product.sku,
      category: [product.categoria, product.subcategoria].filter(Boolean).join(' > '),
      url: productUrl,
      image: images.map((image) => absoluteUrl(image)),
      brand: {
        '@type': 'Brand',
        name: 'T3R',
      },
      manufacturer: {
        '@id': `${SITE.url}/#organization`,
      },
    },
    breadcrumbSchema([
      { name: 'Inicio', item: SITE.url },
      { name: 'Catálogo T3R', item: absoluteUrl('/catalogo') },
      { name: product.nombre, item: productUrl },
    ]),
  ];
}
