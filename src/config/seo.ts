import { SITE } from './site';
import { brands } from './brands';
import { collectionPageSchema } from '@lib/seo/schema';
import { cld } from '@lib/cloudinary/url';

export const T3R_HERO_IMAGE = 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166514/catalogo_t3r/combos/combos_3.jpg';

// Metadatos SEO de las páginas estáticas.
export const PAGE_SEO = {
  // Home = landing única de T3R (URL canónica de la marca; /t3r redirige aquí con 301).
  home: {
    title: 'T3R Components | Fundamental Bike Parts',
    description: 'T3R Components: componentes y recambios para bicicleta directos de fábrica y probados por riders. Distribuidos en España por Fundamental Bike Parts.',
    // Primer frame del hero scroll (preload LCP); la imagen social sigue siendo la foto T3R.
    heroImage: '/hero-frames/frame_0001.webp',
    image: cld(T3R_HERO_IMAGE, { width: 1200 }),
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        publisher: { '@id': `${SITE.url}/#organization` },
        inLanguage: 'es',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Brand',
        '@id': `${SITE.url}/#brand-t3r`,
        name: 'T3R Bike Components',
        alternateName: 'The Three Riders',
        url: SITE.url,
        logo: `${SITE.url}/logo_t3r.png`,
        description: 'Recambios y componentes para bicicletas probados por riders.',
      },
    ],
  },
  catalog: {
    title: 'Catálogo T3R | Componentes para bicicleta',
    description: 'Consulta el catálogo T3R de componentes para bicicleta: frenos, pedales, pedalieres, puños, válvulas, cables, bolsas y accesorios.',
    image: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166514/catalogo_t3r/combos/combos_3.jpg',
    structuredData: collectionPageSchema({
      name: 'Catálogo T3R',
      description: 'Catálogo de recambios y componentes T3R para bicicletas.',
      url: `${SITE.url}/catalogo`,
    }),
  },
  brands: {
    title: 'T3R | Marca distribuida por Fundamental',
    description: 'Conoce T3R Components, la marca distribuida por Fundamental: componentes y recambios para bicicleta probados por riders.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Marcas de Fundamental Bike Parts',
      url: `${SITE.url}/marcas`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: brands.map((brand, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: brand.name,
          url: new URL(brand.href, SITE.url).toString(),
        })),
      },
    },
  },
  about: {
    title: 'Nosotros | Fundamental Bike Parts',
    description: 'Conoce Fundamental Bike Parts, distribuidora ciclista de T3R creada por riders para tiendas, talleres y ciclistas.',
    // Sin preload: el hero usa WebP distinto según pantalla (AboutHero.astro); el JPG queda para redes.
    image: '/nosotros-hero.jpg',
  },
  contact: {
    title: 'Contacto | Fundamental Bike Parts',
    description: 'Contacta con Fundamental Bike Parts para consultar productos, disponibilidad, pedidos o convertirte en punto de venta.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contacto Fundamental Bike Parts',
      url: `${SITE.url}/contacto`,
      mainEntity: { '@id': `${SITE.url}/#organization` },
    },
  },
  stores: {
    title: 'Puntos de venta | Fundamental Bike Parts',
    description: 'Encuentra tiendas físicas donde comprar productos T3R distribuidos por Fundamental Bike Parts.',
  },
};
