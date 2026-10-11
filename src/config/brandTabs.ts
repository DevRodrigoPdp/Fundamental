import type { BrandTab } from '@app-types/store';

// Pestañas de marca en /puntos-de-venta (available: tiene tiendas listadas).
export const brandTabs: BrandTab[] = [
  { id: 't3r', label: 'T3R', logo: '/logo_blanco_t3r.png', available: true },
  { id: 'whipp-off', label: 'Whipp-Off', logo: '/logo_whipoff.png', available: false },
  { id: 'transfer', label: 'Transfer', logo: '/logo_transfer.png', available: false },
];
