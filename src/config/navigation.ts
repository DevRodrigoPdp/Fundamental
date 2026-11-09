import type { NavKey, NavLink } from '@app-types/navigation';

export type { NavKey };

// Enlaces del menú principal (desktop y móvil). La home (T3R) se alcanza desde la marca.
export const navLinks: NavLink[] = [
  { href: '/catalogo', label: 'Catálogo T3R', key: 'catalogo' },
  { href: '/puntos-de-venta', label: 'Puntos de venta', key: 'puntosVenta' },
  { href: '/nosotros', label: 'Nosotros', key: 'nosotros' },
  { href: '/contacto', label: 'Contacto', key: 'contacto' },
];
