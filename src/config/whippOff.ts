// Whipp-Off: imagen principal y muestra del catálogo por categoría.
export const WHIPP_OFF_HERO_IMAGE = 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166699/catalogo_whipoff/WHIP_OFF_1.jpg';
export const WHIPP_OFF_URL = 'https://www.whip-off.com/';

export interface WhippOffCategory {
  id: string;
  number: string;
  title: string;
  gridClass: string;
  hoverScale: string;
  items: { src: string; label: string }[];
}

export const whippOffCategories: WhippOffCategory[] = [
  {
    id: 'whipp-off-camisetas',
    number: '01',
    title: 'Camisetas',
    gridClass: 'grid grid-cols-2 md:grid-cols-4 gap-3',
    hoverScale: 'group-hover:scale-105',
    items: [
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166700/catalogo_whipoff/wo_camiseta_mc_negra.png', label: 'MC · Negra' },
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166701/catalogo_whipoff/wo_camiseta_ml_blanca.png', label: 'ML · Blanca' },
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166702/catalogo_whipoff/wo_camiseta_ml_negra.png', label: 'ML · Negra' },
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166702/catalogo_whipoff/wo_camiseta_ml_roja.png', label: 'ML · Roja' },
    ],
  },
  {
    id: 'whipp-off-pantalones',
    number: '02',
    title: 'Pantalones',
    gridClass: 'grid grid-cols-2 md:grid-cols-3 gap-3',
    hoverScale: 'group-hover:scale-105',
    items: [
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166705/catalogo_whipoff/wo_pantalon_corto_negro.png', label: 'Corto · Negro' },
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166706/catalogo_whipoff/wo_pantalon_largo_negro.png', label: 'Largo · Negro' },
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166707/catalogo_whipoff/wo_pantalon_largo_verde.png', label: 'Largo · Verde' },
    ],
  },
  {
    id: 'whipp-off-guantes',
    number: '03',
    title: 'Guantes',
    gridClass: 'grid grid-cols-2 md:grid-cols-3 gap-3',
    hoverScale: 'group-hover:scale-110',
    items: [
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166704/catalogo_whipoff/wo_guante_negro.png', label: 'Enduro · Negro' },
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166703/catalogo_whipoff/wo_guante_blanco.png', label: 'Enduro · Blanco' },
      { src: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166704/catalogo_whipoff/wo_guante_gris.png', label: 'Enduro · Gris' },
    ],
  },
];
