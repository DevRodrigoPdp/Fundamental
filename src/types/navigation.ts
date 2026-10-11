export type NavKey = 't3r' | 'catalogo' | 'marcas' | 'puntosVenta' | 'nosotros' | 'contacto';

export interface NavLink {
  href: string;
  label: string;
  eyebrow: string;
  key: NavKey;
  flagship?: boolean;
}
