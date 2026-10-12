import { CART_EVENT, MAX_QTY, getCart, setQty } from '@lib/services/cart';
import { getCachedProduct, loadProducts, priceCents } from '@lib/services/cartProducts';
import { isSellable } from '@lib/services/availability';
import { money } from '@lib/utils/format';
import { renderLine } from './cartLine';

// Página /cesta: pinta las líneas con datos en vivo y se repinta con cada cambio.

const adjustedToStock = new Set<number>();
let renderToken = 0;

function showState(state: 'loading' | 'empty' | 'error' | 'list') {
  document.querySelectorAll<HTMLElement>('[data-cart-state]').forEach((node) => {
    node.classList.toggle('hidden', node.dataset.cartState !== state);
  });
}

async function renderCart() {
  const list = document.querySelector('[data-cart-lines]');
  if (!list) return;

  const token = ++renderToken;
  const items = getCart();
  if (items.length === 0) {
    showState('empty');
    return;
  }

  try {
    await loadProducts(items.map((i) => i.id));
  } catch {
    if (token === renderToken) showState('error');
    return;
  }
  if (token !== renderToken) return;

  // Cantidad mayor que el stock actual: se recorta y se guarda (re-render vía CART_EVENT).
  const overStock = items.find(({ id, qty }) => {
    const product = getCachedProduct(id);
    return !!product && isSellable(product) && qty > Math.min(MAX_QTY, product.stock as number);
  });
  if (overStock) {
    adjustedToStock.add(overStock.id);
    setQty(overStock.id, Math.min(MAX_QTY, getCachedProduct(overStock.id)!.stock as number));
    return;
  }

  let subtotal = 0;
  list.replaceChildren(
    ...items.map(({ id, qty }) => {
      const product = getCachedProduct(id);
      if (product && isSellable(product)) {
        subtotal += priceCents(product) * Math.min(qty, MAX_QTY, product.stock as number);
      }
      return renderLine(id, qty, product, adjustedToStock.has(id));
    })
  );

  const total = money.format(subtotal / 100);
  document.querySelector('[data-cart-subtotal]')!.textContent = total;
  document.querySelector('[data-cart-total]')!.textContent = total;
  showState('list');
}

window.addEventListener(CART_EVENT, renderCart);
renderCart();
