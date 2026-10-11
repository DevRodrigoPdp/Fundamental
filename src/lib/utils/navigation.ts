import type { NavKey } from '@config/navigation';

// Enlace activo: por clave explícita o porque la ruta actual está dentro de href.
export function isNavActive(href: string, key: NavKey, active: NavKey | undefined, currentPath: string) {
  return active === key || currentPath === href || currentPath.startsWith(href + '/');
}
