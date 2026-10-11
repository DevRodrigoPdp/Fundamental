import { SITE } from './site';
import { brands } from './brands';
import { TRANSFER_HERO_IMAGE } from './transfer';
import { WHIPP_OFF_HERO_IMAGE } from './whippOff';
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
  brands: {
    title: 'Marcas de ciclismo | T3R, Whipp-Off y Transfer',
    description: 'Conoce las marcas distribuidas por Fundamental: componentes T3R, ropa MTB Whipp-Off y bicicletas y cuadros Transfer.',
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
    description: 'Conoce Fundamental Bike Parts, distribuidora ciclista de T3R, Whipp-Off y Transfer creada por riders para tiendas, talleres y ciclistas.',
    heroImage: '/nosotros-hero.jpg',
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
    description: 'Encuentra tiendas físicas donde comprar productos T3R. Próximamente añadiremos puntos de venta de Whipp-Off y Transfer.',
  },
  transfer: {
    title: 'Transfer Bikes | Bicicletas y cuadros',
    description: 'Descubre Transfer Bikes y el modelo Kanaya: bicicletas y cuadros distribuidos por Fundamental Bike Parts.',
    heroImage: cld(TRANSFER_HERO_IMAGE, { width: 1920 }),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      name: 'Transfer Bikes',
      url: `${SITE.url}/transfer`,
      logo: `${SITE.url}/logo_transfer.png`,
      description: 'Fabricante de bicicletas y cuadros.',
    },
  },
  whippOff: {
    title: 'Whipp-Off | Ropa y equipamiento MTB',
    description: 'Descubre Whipp-Off: ropa técnica y equipamiento MTB para riders, disponible a través de Fundamental Bike Parts.',
    heroImage: cld(WHIPP_OFF_HERO_IMAGE, { width: 1920 }),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      name: 'Whipp-Off',
      url: `${SITE.url}/whipp-off`,
      logo: `${SITE.url}/logo_whipoff.png`,
      description: 'Ropa técnica y equipamiento para ciclismo MTB.',
    },
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
