export type NavKey = 't3r' | 'catalogo' | 'marcas' | 'puntosVenta' | 'nosotros' | 'contacto';

export const navLinks: Array<{
  href: string;
  label: string;
  eyebrow: string;
  key: NavKey;
  flagship?: boolean;
}> = [
  { href: '/t3r', label: 'T3R Components', eyebrow: 'Marca principal', key: 't3r', flagship: true },
  { href: '/catalogo', label: 'Catálogo', eyebrow: 'Gama completa', key: 'catalogo' },
  { href: '/marcas', label: 'Marcas asociadas', eyebrow: 'T3R · Transfer · Whipp-Off', key: 'marcas' },
  { href: '/puntos-de-venta', label: 'Puntos de venta', eyebrow: 'Dónde encontrarnos', key: 'puntosVenta' },
  { href: '/nosotros', label: 'Nosotros', eyebrow: 'Fundamental Bike Parts', key: 'nosotros' },
  { href: '/contacto', label: 'Contacto', eyebrow: 'Consultas y pedidos', key: 'contacto' },
];
