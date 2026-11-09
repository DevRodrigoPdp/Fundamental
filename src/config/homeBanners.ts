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
    href: '/catalogo',
    image: 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166510/catalogo_t3r/combos/combos_1.jpg',
    alt: 'T3R The Three Riders',
    height: '460px',
    imageStyle: 'object-position: center 30%;',
    overlayClass: 'bg-[#1A100C]/55',
    logo: '/images/t3r-logo-blanco-800.webp',
    logoAlt: 'T3R',
    logoClass: 'h-14 md:h-24 w-auto mb-8',
    tagline: 'The Three Riders · Componentes fundamentales',
    cta: 'Ver catálogo',
  },
];
