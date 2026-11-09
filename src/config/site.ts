const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://fundamentalbikeparts.com').replace(/\/+$/, '');

export const SITE = {
  name: 'Fundamental Bike Parts',
  shortName: 'Fundamental',
  url: siteUrl,
  locale: 'es_ES',
  language: 'es',
  email: 'info@fundamentalbikeparts.com',
  instagram: 'https://www.instagram.com/fundamental_bike_parts?igsh=OWtqdjN6MXdrcDdl',
  location: 'Madrid, España',
  description:
    'Distribuidora especializada en componentes y recambios para bicicleta de la marca T3R.',
  defaultImage: '/nosotros-hero.jpg',
};

export function absoluteUrl(path = '/') {
  return new URL(path, SITE.url).toString();
}
