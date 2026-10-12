// Cesta en localStorage. Solo guarda IDs y cantidades: precio, nombre y stock
// se consultan siempre en vivo y el servidor recalcula todo al pagar.
// Todo lo leído de localStorage se trata como entrada no fiable.

import type { CartData, CartItem } from '@app-types/cart';

const STORAGE_KEY = 'fbp_cart_v1';
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_QTY = 20;
export const MAX_LINES = 50;
export const CART_EVENT = 'cart:change';

function isValidId(id: unknown): id is number {
  return typeof id === 'number' && Number.isSafeInteger(id) && id > 0;
}

function clampQty(qty: number) {
  return Math.min(MAX_QTY, Math.max(1, Math.trunc(qty)));
}

function sanitize(raw: unknown): CartItem[] {
  if (!raw || typeof raw !== 'object') return [];
  const data = raw as Partial<CartData>;
  if (data.v !== 1 || !Array.isArray(data.items)) return [];
  if (typeof data.updatedAt !== 'number' || Date.now() - data.updatedAt > TTL_MS) return [];

  const merged = new Map<number, number>();
  for (const item of data.items) {
    if (!item || typeof item !== 'object') continue;
    const { id, qty } = item as unknown as Record<string, unknown>;
    if (!isValidId(id) || typeof qty !== 'number' || !Number.isFinite(qty) || qty < 1) continue;
    merged.set(id, clampQty((merged.get(id) ?? 0) + qty));
    if (merged.size >= MAX_LINES) break;
  }
  return [...merged].map(([id, qty]) => ({ id, qty }));
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  try {
    if (items.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      const data: CartData = { v: 1, items: items.slice(0, MAX_LINES), updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch {
    // Modo privado o cuota llena: la cesta no persiste, la web sigue funcionando.
  }
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function addToCart(id: number, qty = 1, maxQty = MAX_QTY) {
  if (!isValidId(id)) return;
  const items = getCart();
  const limit = Math.min(MAX_QTY, maxQty);
  const existing = items.find((item) => item.id === id);
  if (existing) {
    existing.qty = Math.min(limit, clampQty(existing.qty + qty));
  } else {
    if (items.length >= MAX_LINES) return;
    items.push({ id, qty: Math.min(limit, clampQty(qty)) });
  }
  save(items);
}

export function setQty(id: number, qty: number) {
  const items = getCart();
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.qty = clampQty(qty);
  save(items);
}

export function removeFromCart(id: number) {
  save(getCart().filter((item) => item.id !== id));
}

export function clearCart() {
  save([]);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// Cambios hechos en otra pestaña
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      window.dispatchEvent(new CustomEvent(CART_EVENT));
    }
  });
}
