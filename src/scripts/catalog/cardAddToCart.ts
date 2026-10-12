import { addToCart } from '@lib/services/cart';

// Botón "Añadir a la cesta" de las tarjetas del catálogo.
document.querySelectorAll<HTMLButtonElement>('[data-card-add]').forEach((button) => {
  const label = button.querySelector<HTMLElement>('[data-card-add-label]');
  let resetTimer: number | undefined;
  button.addEventListener('click', () => {
    addToCart(Number(button.dataset.cartId), 1, Number(button.dataset.maxQty));
    if (!label) return;
    label.textContent = 'Añadido ✓';
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => { label.textContent = 'Añadir a la cesta'; }, 1800);
  });
});
