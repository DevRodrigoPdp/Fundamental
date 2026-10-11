// Banners de marca de la home (imagen a pantalla completa + logo + CTA).
export interface HomeBanner {
  href: string;
  image: string;
  alt: string;
  height: string;
  imageStyle?: string;
  overlayClass: string;
  logo: string;
  logoAlt: string;
  logoClass: string;
  tagline?: string;
  cta: string;
}

export const homeBanners: HomeBanner[] = [
  {
    href: '/t3r',
    image: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166510/catalogo_t3r/combos/combos_1.jpg',
    alt: 'T3R The Three Riders',
    height: '460px',
    imageStyle: 'object-position: center 30%;',
    overlayClass: 'bg-[#1A100C]/55',
    logo: '/logo_blanco_t3r.png',
    logoAlt: 'T3R',
    logoClass: 'h-20 md:h-36 w-auto mb-6 opacity-95',
    tagline: 'The Three Riders · Componentes fundamentales',
    cta: 'Saber más',
  },
  {
    href: '/transfer',
    image: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166708/catalogo_transferbike/bici_transferbike.jpg',
    alt: 'Transfer Bike',
    height: '520px',
    overlayClass: 'bg-[#111]/45',
    logo: '/logo_transfer.png',
    logoAlt: 'Transfer Bike',
    logoClass: 'h-20 md:h-36 w-auto brightness-0 invert mb-6',
    tagline: 'Bicicletas · Una bici, cada día',
    cta: 'Descubre',
  },
  {
    href: '/whipp-off',
    image: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166699/catalogo_whipoff/WHIP_OFF_1.jpg',
    alt: 'Whipp-Off',
    height: '520px',
    overlayClass: 'bg-black/40',
    logo: '/logo_whipoff.png',
    logoAlt: 'Whipp-Off',
    logoClass: 'h-24 md:h-40 w-auto brightness-0 invert mb-8',
    cta: 'Saber más',
  },
];
