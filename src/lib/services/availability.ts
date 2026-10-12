interface SellableFields {
  activo: boolean;
  precio: number | string | null;
  stock: number | null;
  estado_stock?: string | null;
}

// Solo se vende online con precio y stock reales y estado "disponible" en el panel;
// si no, se solicita por email.
export function isSellable(product: SellableFields) {
  return (
    product.activo === true
    && Number(product.precio) > 0
    && (product.stock ?? 0) > 0
    && (product.estado_stock ?? 'disponible') === 'disponible'
  );
}

// Unidades que se pueden añadir de una vez (máx. 20).
export function maxPurchasable(product: SellableFields) {
  return isSellable(product) ? Math.min(20, product.stock as number) : 0;
}
