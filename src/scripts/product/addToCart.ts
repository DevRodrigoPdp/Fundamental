import { addToCart } from '@lib/services/cart';

// Selector de cantidad (− / +) y botón "Añadir a la cesta" de la ficha de producto.
const addBlock = document.querySelector<HTMLElement>('[data-add-to-cart]');

if (addBlock) {
  const id = Number(addBlock.dataset.productId);
  const maxQty = Number(addBlock.dataset.maxQty);
  const qtyInput = addBlock.querySelector<HTMLInputElement>('#cart-qty');
  const minus = addBlock.querySelector<HTMLButtonElement>('[data-qty-step="-1"]');
  const plus = addBlock.querySelector<HTMLButtonElement>('[data-qty-step="1"]');
  const feedback = addBlock.querySelector<HTMLElement>('[data-add-feedback]');

  const readQty = () => {
    const value = Math.trunc(Number(qtyInput?.value));
    return Number.isFinite(value) ? Math.min(maxQty, Math.max(1, value)) : 1;
  };
  const showQty = (qty: number) => {
    if (qtyInput) qtyInput.value = String(qty);
    if (minus) minus.disabled = qty <= 1;
    if (plus) plus.disabled = qty >= maxQty;
  };

  minus?.addEventListener('click', () => showQty(Math.max(1, readQty() - 1)));
  plus?.addEventListener('click', () => showQty(Math.min(maxQty, readQty() + 1)));
  qtyInput?.addEventListener('input', () => {
    qtyInput.value = qtyInput.value.replace(/\D/g, '').slice(0, 2);
  });
  qtyInput?.addEventListener('change', () => showQty(readQty()));

  addBlock.querySelector('[data-add-button]')?.addEventListener('click', () => {
    showQty(readQty());
    addToCart(id, readQty(), maxQty);
    feedback?.classList.remove('hidden');
  });
}
