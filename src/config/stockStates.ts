export const ESTADOS_STOCK = {
  disponible: { label: 'Disponible', color: 'text-green-700' },
  bajo_pedido: { label: 'Disponible bajo pedido', color: 'text-amber-700' },
  agotado: { label: 'Agotado temporalmente', color: 'text-red-600' },
  descatalogado: { label: 'Descatalogado', color: 'text-gray-500' },
} as const;

export type EstadoStock = keyof typeof ESTADOS_STOCK;
