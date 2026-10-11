export type CatalogFamily = {
  slug: string;
  cat: string;
  tag: string;
  text: string;
  description: string;
  details: string[];
  img: string;
  skuPrefixes: string[];
  subcategories?: string[];
};

export const catalogFamilies: CatalogFamily[] = [
  {
    slug: 'discos-de-freno',
    cat: 'Discos de freno',
    tag: 'Frenada',
    text: 'Que frenar no te cueste. Selección de discos de diferentes medidas, diferentes anclajes.',
    description: 'Discos de freno pensados para ofrecer un tacto firme y consistente con cualquier tipo de pastilla. Distintos diámetros y sistemas de fijación para cubrir la mayoría de bicicletas de tienda.',
    details: [
      'Discos de acero inoxidable en espesor 2.0 para otorgar un tacto firme, orientados tanto para pastillas orgánicas, semimetálicas y metálicas.',
      'Diámetros disponibles: 140, 160, 180, 203 y 220 mm.',
      'Sistema de fijación en 6 tornillos y sistema Center Lock.',
    ],
    img: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166520/catalogo_t3r/cutouts/disco_freno.png',
    skuPrefixes: ['T3R-DISCO-'],
  },
  {
    slug: 'pastillas-de-freno',
    cat: 'Pastillas de freno',
    tag: 'Frenada',
    text: 'Pastillas para casi todos los modelos y para casi todos los modelos de freno de las marcas más usadas.',
    description: 'Pastillas de freno de disco compatibles con las marcas y modelos de freno más usados en tienda. Distintos compuestos y acabados para adaptarse al uso: ciudad, montaña, carretera o e-bike.',
    details: [
      'Semimetálicas: junto a la resina del ferodo se mezclan metales para otorgar una potencia excepcional y una disipación del calor también muy buena.',
      'Metálicas: hechas de metales (cobre/acero), otorgan potencia de frenada en frenadas prolongadas o bajo situaciones de lluvia, barro o altas temperaturas.',
      'Ventiladas o con disipador de calor: pensadas para disipar el calor generado por la fricción al frenar, mediante los aletines que llevan en la parte superior.',
    ],
    img: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166521/catalogo_t3r/cutouts/pastillas_freno.png',
    skuPrefixes: ['T3R-PAST-'],
  },
  {
    slug: 'pedales',
    cat: 'Pedales',
    tag: 'Contacto',
    text: 'Pedales automáticos de carretera y xco hasta plataforma de varios tipos y precios.',
    description: 'Gama completa de pedales: plataforma para ciudad y e-bike, automáticos para montaña y uso mixto, y carretera para road. Referencias claras, construcción pensada para durar.',
    details: ['Plataforma, automático y carretera', 'Opciones para cada tipo de uso', 'Ejes y cuerpos pensados para durar'],
    img: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166523/catalogo_t3r/cutouts/pedal_automatico.png',
    skuPrefixes: ['T3R-PED-'],
    subcategories: ['Plataforma', 'Automáticos', 'Mixtos', 'Carretera'],
  },
  {
    slug: 'pedalier-bb',
    cat: 'Pedalier / BB',
    tag: 'Transmisión',
    text: 'Para casi cualquier cuadro diametro de eje de biela, seleccion de cajas de pedalier.',
    description: 'Pedalieres para los estándares más habituales, organizados para encontrar rápido la combinación correcta entre cuadro y eje de biela.',
    details: ['Compatibilidades identificadas por estándar', 'Rodamientos protegidos', 'Opciones roscadas y press-fit'],
    img: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166522/catalogo_t3r/cutouts/pedalier.png',
    skuPrefixes: ['T3R-EJE-'],
    subcategories: ['Ejes'],
  },
  {
    slug: 'punos',
    cat: 'Puños',
    tag: 'Control',
    text: 'Tacto, comodidad y durabilidad para los puntos donde la bici se siente de verdad.',
    description: 'Puños creados para mantener control y comodidad durante más tiempo. La forma, textura y material cambian según el tipo de conducción.',
    details: [
      'Puños de silicona: perfectos para mtb, otorgan muy buena absorción de las vibraciones y absorben muy bien el sudor.',
      'Puños de goma: indicados para casi todas las bicis (menos carretera), generan muy buen agarre, evitan ampollas y absorben muy bien las vibraciones.',
      'Puños de goma ergonómicos: ideales para generar confort y descanso a las manos, perfectos para un uso relajado y cómodo. Previenen el entumecimiento de las manos.',
    ],
    img: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166526/catalogo_t3r/cutouts/puno.png',
    skuPrefixes: ['T3R-PUNO-'],
    subcategories: ['Puños'],
  },
  {
    slug: 'valvulas-tubeless',
    cat: 'Válvulas tubeless',
    tag: 'Tubeless',
    text: 'Pequeñas piezas que tienen que funcionar siempre.',
    description: 'Válvulas y recambios para montajes tubeless, con distintas longitudes para adaptarse al perfil de la llanta y facilitar el mantenimiento.',
    details: ['Cuerpo resistente y ligero', 'Longitudes para distintos perfiles', 'Obuses reemplazables'],
    img: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166527/catalogo_t3r/cutouts/valvula.png',
    skuPrefixes: ['T3R-VLV-', 'T3R-OBUS-'],
    subcategories: ['Válvulas', 'Obuses'],
  },
  {
    slug: 'transmision',
    cat: 'Transmisión',
    tag: 'Transmisión',
    text: 'Desde platos a topes de funda, todo lo necesario para que tu bici cambie perfectamente.',
    description: 'Cables de cambio y topes para completar el surtido de transmisión en tienda. Distintos acabados y medidas para cubrir las referencias más habituales.',
    details: [
      'Cables galvanizados: los más sencillos de la gama, cables de acero con tratamiento de zinc entrelazados entre sí. Compatibles con grupos Shimano/Sram/Tektro.',
      'Cables de cambio Slick: sometidos a un proceso de estirado o nanopulido que elimina las asperezas del acero, ofreciendo un tacto directo, preciso y suave.',
      'Cable normal: el cable convencional, a medio camino entre el galvanizado más sencillo y el Slick. Duradero y preciso.',
    ],
    img: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166676/catalogo_t3r/topes_cable_cambio/topes_negros_nuevo_1.png',
    skuPrefixes: ['T3R-TOPE-', 'T3R-CBL-'],
    subcategories: ['Topes de cable', 'Cables'],
  },
  {
    slug: 'herramientas',
    cat: 'Herramientas',
    tag: 'Taller',
    text: 'Kit de purgado para casi cualquier freno, para que no te quedes sin freno cuando mas lo necesitas.',
    description: 'Herramientas y kits pensados para el trabajo en taller: purgado de frenos, mantenimiento hidráulico y accesorios de servicio.',
    details: ['Compatibilidades identificadas', 'Kits completos para taller', 'Materiales resistentes a fluidos de freno'],
    img: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166563/catalogo_t3r/herramientas/kit_purga_cutout.png',
    skuPrefixes: ['T3R-KIT-'],
    subcategories: ['Kits de purga'],
  },
];

export function productBelongsToFamily(product: any, family: CatalogFamily) {
  if (family.skuPrefixes.some((prefix) => product.sku?.startsWith(prefix))) return true;
  return family.subcategories?.includes(product.subcategoria) ?? false;
}
