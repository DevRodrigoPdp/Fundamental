import { SITE } from './site';
import { collectionPageSchema } from '@lib/seo/schema';

// Metadatos SEO de las páginas estáticas.
export const PAGE_SEO = {
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
};
