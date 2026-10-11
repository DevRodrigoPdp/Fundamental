import type { NavKey, NavLink } from '@app-types/navigation';

export type { NavKey };

// Enlaces del menú principal (desktop y móvil).
export const navLinks: NavLink[] = [
  { href: '/t3r', label: 'T3R Components', eyebrow: 'Marca principal', key: 't3r', flagship: true },
  { href: '/catalogo', label: 'Catálogo', eyebrow: 'Gama completa', key: 'catalogo' },
  { href: '/marcas', label: 'Marcas asociadas', eyebrow: 'T3R · Transfer · Whipp-Off', key: 'marcas' },
  { href: '/puntos-de-venta', label: 'Puntos de venta', eyebrow: 'Dónde encontrarnos', key: 'puntosVenta' },
  { href: '/nosotros', label: 'Nosotros', eyebrow: 'Fundamental Bike Parts', key: 'nosotros' },
  { href: '/contacto', label: 'Contacto', eyebrow: 'Consultas y pedidos', key: 'contacto' },
];
