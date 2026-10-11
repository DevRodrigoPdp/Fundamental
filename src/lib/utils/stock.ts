import { ESTADOS_STOCK, type EstadoStock } from '@config/stockStates';

// Etiqueta de stock para tarjetas: "disponible" no se muestra.
export function stockBadge(estado: EstadoStock) {
  if (estado === 'disponible') return null;
  return ESTADOS_STOCK[estado];
}
