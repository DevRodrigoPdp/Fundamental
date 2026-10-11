import { SITE } from './site';
import { collectionPageSchema } from '@lib/seo/schema';
import { cld } from '@lib/cloudinary/url';

export const T3R_HERO_IMAGE = 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166514/catalogo_t3r/combos/combos_3.jpg';
export const HOME_HERO_IMAGE = 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166518/catalogo_t3r/combos/combos_9.jpg';

// Metadatos SEO de las páginas estáticas.
export const PAGE_SEO = {
  home: {
    title: 'Fundamental Bike Parts | Distribuidora de ciclismo',
    description: 'Distribuidora de T3R, Whipp-Off y Transfer: componentes para bicicleta, ropa MTB, cuadros y bicicletas para tiendas y ciclistas.',
    heroImage: cld(HOME_HERO_IMAGE, { width: 1920 }),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: { '@id': `${SITE.url}/#organization` },
      inLanguage: 'es',
    },
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
  t3r: {
    title: 'T3R Bike Components | Recambios para bicicletas',
    description: 'Descubre T3R Bike Components: componentes y recambios para bicicleta probados por riders, pensados para tiendas, talleres y ciclistas.',
    heroImage: cld(T3R_HERO_IMAGE, { width: 1920 }),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      name: 'T3R Bike Components',
      alternateName: 'The Three Riders',
      url: `${SITE.url}/t3r`,
      logo: `${SITE.url}/logo_t3r.png`,
      description: 'Recambios y componentes para bicicletas probados por riders.',
    },
  },
};
