export interface CartItem {
  id: number;
  qty: number;
}

export interface CartData {
  v: 1;
  items: CartItem[];
  updatedAt: number;
}

// Producto consultado en vivo para pintar una línea de la cesta.
export interface CartProduct {
  id: number;
  nombre: string;
  sku: string;
  subcategoria: string | null;
  precio: number | null;
  stock: number | null;
  activo: boolean;
  estado_stock: string | null;
  imagen: string | null;
}
