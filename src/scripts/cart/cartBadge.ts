import { CART_EVENT, getCartCount } from '@lib/services/cart';

// Contador de unidades en el icono de la cesta del Nav.
function renderCartCount() {
  const count = getCartCount();
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((badge) => {
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.classList.toggle('hidden', count === 0);
  });
  document.querySelectorAll('[data-cart-link]').forEach((link) => {
    link.setAttribute('aria-label', count > 0 ? `Cesta (${count} productos)` : 'Cesta');
  });
}

window.addEventListener(CART_EVENT, renderCartCount);
renderCartCount();
