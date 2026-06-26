const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://fundamentalbikeparts.com').replace(/\/+$/, '');

export const SITE = {
  name: 'Fundamental Bike Parts',
  shortName: 'Fundamental',
  url: siteUrl,
  locale: 'es_ES',
  language: 'es',
  email: 'info@fundamentalbikeparts.com',
  location: 'Madrid, España',
  description:
    'Distribuidora especializada en componentes, bicicletas y equipamiento ciclista de T3R, Whipp-Off y Transfer.',
  defaultImage: '/nosotros-hero.jpg',
};

export function absoluteUrl(path = '/') {
  return new URL(path, SITE.url).toString();
}
