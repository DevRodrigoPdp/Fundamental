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
    text: 'Control, mordida y medidas clave para montar una gama honesta sin inflar el precio.',
    description: 'Discos pensados para ofrecer una frenada consistente y una buena disipación del calor. La gama reúne los sistemas y diámetros habituales para facilitar la elección en tienda y taller.',
    details: ['Acero resistente al desgaste', 'Opciones de 6 tornillos y Center Lock', 'Diferentes diámetros disponibles'],
    img: '/catalogo_t3r/cutouts/disco_freno.png',
    skuPrefixes: ['T3R-DISCO-'],
  },
  {
    slug: 'pastillas-de-freno',
    cat: 'Pastillas de freno',
    tag: 'Frenada',
    text: 'Referencias compatibles para taller: claras, directas y pensadas para rotar bien.',
    description: 'Pastillas desarrolladas para conseguir equilibrio entre mordida, control y duración. Cada referencia indica su compatibilidad; el compuesto y soporte pueden variar según el modelo.',
    details: ['Compuesto de fricción según referencia', 'Soporte resistente a temperatura y uso', 'Compatibilidades claras para taller'],
    img: '/catalogo_t3r/cutouts/pastillas_freno.png',
    skuPrefixes: ['T3R-PAST-'],
  },
  {
    slug: 'pedales',
    cat: 'Pedales',
    tag: 'Contacto',
    text: 'Plataforma, automático y carretera. Todas las referencias sin el ruido de marca.',
    description: 'Gama completa de pedales: plataforma para ciudad y e-bike, automáticos para montaña y uso mixto, y carretera para road. Referencias claras, construcción pensada para durar.',
    details: ['Plataforma, automático y carretera', 'Opciones para cada tipo de uso', 'Ejes y cuerpos pensados para durar'],
    img: '/catalogo_t3r/cutouts/pedal_automatico.png',
    skuPrefixes: ['T3R-PED-'],
    subcategories: ['Plataforma', 'Automáticos', 'Mixtos', 'Carretera'],
  },
  {
    slug: 'pedalier-bb',
    cat: 'Pedalier / BB',
    tag: 'Transmisión',
    text: 'Ejes y pedalieres para resolver compatibilidades de taller sin convertirlo en ciencia oscura.',
    description: 'Pedalieres para los estándares más habituales, organizados para encontrar rápido la combinación correcta entre cuadro y eje de biela.',
    details: ['Compatibilidades identificadas por estándar', 'Rodamientos protegidos', 'Opciones roscadas y press-fit'],
    img: '/catalogo_t3r/cutouts/pedalier.png',
    skuPrefixes: ['T3R-EJE-'],
    subcategories: ['Ejes'],
  },
  {
    slug: 'punos',
    cat: 'Puños',
    tag: 'Control',
    text: 'Tacto, comodidad y durabilidad para los puntos donde la bici se siente de verdad.',
    description: 'Puños creados para mantener control y comodidad durante más tiempo. La forma, textura y material cambian según el tipo de conducción.',
    details: ['Compuestos con tacto y absorción', 'Diseños para diferentes apoyos', 'Opciones de fijación según referencia'],
    img: '/catalogo_t3r/cutouts/puno.png',
    skuPrefixes: ['T3R-PUNO-'],
    subcategories: ['Puños'],
  },
  {
    slug: 'valvulas-tubeless',
    cat: 'Válvulas tubeless',
    tag: 'Tubeless',
    text: 'Pequeñas piezas que tienen que funcionar siempre. Simple, preciso, sin teatro.',
    description: 'Válvulas y recambios para montajes tubeless, con distintas longitudes para adaptarse al perfil de la llanta y facilitar el mantenimiento.',
    details: ['Cuerpo resistente y ligero', 'Longitudes para distintos perfiles', 'Obuses reemplazables'],
    img: '/catalogo_t3r/cutouts/valvula.png',
    skuPrefixes: ['T3R-VLV-', 'T3R-OBUS-'],
    subcategories: ['Válvulas', 'Obuses'],
  },
  {
    slug: 'transmision',
    cat: 'Transmisión',
    tag: 'Transmisión',
    text: 'Cables, topes y accesorios de transmisión para taller. Referencias claras, rotación fácil.',
    description: 'Cables de cambio y topes para completar el surtido de transmisión en tienda. Distintos acabados y medidas para cubrir las referencias más habituales.',
    details: ['Cables en distintos diámetros y acabados', 'Topes en negro y plateado', 'Compatibilidades claras'],
    img: '/catalogo_t3r/topes_cable_cambio/topes_negros_nuevo_1.png',
    skuPrefixes: ['T3R-TOPE-', 'T3R-CBL-'],
    subcategories: ['Topes de cable', 'Cables'],
  },
  {
    slug: 'herramientas',
    cat: 'Herramientas',
    tag: 'Taller',
    text: 'Herramientas y kits de mantenimiento para taller. Lo que necesitas, sin lo que no.',
    description: 'Herramientas y kits pensados para el trabajo en taller: purgado de frenos, mantenimiento hidráulico y accesorios de servicio.',
    details: ['Compatibilidades identificadas', 'Kits completos para taller', 'Materiales resistentes a fluidos de freno'],
    img: '/catalogo_t3r/herramientas/kit_purga_cutout.png',
    skuPrefixes: ['T3R-KIT-'],
    subcategories: ['Kits de purga'],
  },
];

export function productBelongsToFamily(product: any, family: CatalogFamily) {
  if (family.skuPrefixes.some((prefix) => product.sku?.startsWith(prefix))) return true;
  return family.subcategories?.includes(product.subcategoria) ?? false;
}
