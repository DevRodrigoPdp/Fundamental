export const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

export function formatSpecValue(v: unknown) {
  if (typeof v === 'boolean') return v ? 'Sí' : 'No';
  return String(v);
}

export function formatSpecKey(k: string) {
  return k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ');
}
