import type { EstadoStock } from '@config/stockStates';

// Fila de productos_t3r.
export interface Product {
  id: number;
  nombre: string;
  sku: string;
  categoria: string;
  subcategoria: string | null;
  descripcion: string | null;
  descripcion_corta: string | null;
  especificaciones: Record<string, unknown> | null;
  precio: number | null;
  stock: number | null;
  activo: boolean;
  estado_stock: EstadoStock | null;
}

// Producto reducido para tarjetas (relacionados, familias).
export type ProductSummary = Pick<Product, 'nombre' | 'sku' | 'categoria' | 'subcategoria' | 'descripcion_corta'>;

export interface ProductCardData extends ProductSummary {
  imagen: string | null;
}

export interface CatalogItem {
  id: number;
  nombre: string;
  categoria: string;
  subcategoria: string | null;
  descripcion: string | null;
  sku: string;
  imagen: string | null;
  estadoStock: EstadoStock;
  precio: number | null;
  // Unidades que se pueden añadir a la cesta (0 = no se vende online)
  maxQty: number;
  // Solo en familias agrupadas (discos)
  refLabel?: string;
  searchSku?: string;
}

export interface DiskVariant {
  sku: string;
  size: number;
}
