import type { StoreLocation } from '@app-types/store';

// Texto de búsqueda en Google Maps para una tienda.
export function storeMapQuery(store: StoreLocation) {
  return [store.nombre, store.direccion, store.cp, store.poblacion, 'España'].join(', ');
}

export function mapsSearchUrl(query: string) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}

export function mapsEmbedUrl(query: string) {
  return 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
}

// Primer teléfono sin espacios, para href tel:
export function telHref(tel: string) {
  return `tel:${tel.split(' / ')[0].replace(/\s+/g, '')}`;
}
