import { MAX_QTY, removeFromCart, setQty } from '@lib/services/cart';
import { priceCents } from '@lib/services/cartProducts';
import { isSellable } from '@lib/services/availability';
import { money } from '@lib/utils/format';
import { el } from '@scripts/shared/dom';
import type { CartProduct } from '@app-types/cart';

function renderThumb(product: CartProduct | undefined) {
  const thumb = el('a', 'relative block h-20 w-20 overflow-hidden border border-gray-100 bg-white sm:h-28 sm:w-28');
  const img = el('img', 'absolute inset-0 h-full w-full object-contain p-2');
  img.src = product?.imagen ?? '/logo_t3r.png';
  img.alt = product?.nombre ?? '';
  img.loading = 'lazy';
  img.onerror = () => { img.src = '/logo_t3r.png'; img.classList.add('opacity-25', 'grayscale'); };
  if (!product?.imagen) img.classList.add('opacity-25', 'grayscale');
  if (product) thumb.href = `/catalogo/${encodeURIComponent(product.sku)}`;
  thumb.append(img);
  return thumb;
}

function renderStepper(id: number, product: CartProduct, current: number, maxQty: number) {
  const stepper = el('div', 'flex h-10 items-stretch border border-gray-200 focus-within:border-black');
  const stepClass = 'w-9 cursor-pointer text-base! text-gray-500 transition-colors hover:text-black disabled:cursor-not-allowed disabled:text-gray-200';
  const minus = el('button', stepClass, '−');
  minus.type = 'button';
  minus.disabled = current <= 1;
  minus.setAttribute('aria-label', `Quitar una unidad de ${product.nombre}`);
  minus.addEventListener('click', () => setQty(id, current - 1));
  const plus = el('button', stepClass, '+');
  plus.type = 'button';
  plus.disabled = current >= maxQty;
  plus.setAttribute('aria-label', `Añadir una unidad de ${product.nombre}`);
  plus.addEventListener('click', () => setQty(id, Math.min(maxQty, current + 1)));
  const input = el('input', 'w-9 bg-transparent text-center text-sm! font-semibold! tabular-nums focus:outline-none max-md:text-base!');
  input.type = 'text';
  input.inputMode = 'numeric';
  input.value = String(current);
  input.setAttribute('aria-label', `Cantidad de ${product.nombre}`);
  input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 2); });
  input.addEventListener('change', () => {
    const value = Math.trunc(Number(input.value));
    setQty(id, Number.isFinite(value) && value > 0 ? Math.min(maxQty, value) : current);
  });
  stepper.append(minus, input, plus);
  return stepper;
}

// Una línea de la cesta: miniatura, datos, cantidad e importe.
export function renderLine(id: number, qty: number, product: CartProduct | undefined, adjustedToStock: boolean) {
  const li = el('li', 'grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-4 py-6 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:gap-x-6');
  const thumb = renderThumb(product);

  const info = el('div', 'flex min-w-0 flex-col');
  const remove = el('button', 'mt-auto w-fit cursor-pointer pt-3 text-xs! text-gray-400 underline hover:text-red-600 transition-colors', 'Eliminar');
  remove.type = 'button';
  remove.addEventListener('click', () => removeFromCart(id));

  if (!product || !isSellable(product)) {
    info.append(
      el('p', 'text-sm font-bold', product?.nombre ?? 'Producto no encontrado'),
      el('p', 'mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-600', 'No disponible'),
      remove,
    );
    li.append(thumb, info);
    return li;
  }

  const maxQty = Math.min(MAX_QTY, product.stock as number);
  const name = el('a', 'line-clamp-3 break-words text-sm font-bold leading-snug hover:text-[#6B8CAE] transition-colors', product.nombre);
  name.href = thumb.href;
  info.append(
    el('p', 'mb-1 text-[10px] uppercase tracking-[0.22em] text-gray-400', product.subcategoria ?? ''),
    name,
    el('p', 'mt-1 break-words text-xs text-gray-400', `REF. ${product.sku}`),
  );
  if (adjustedToStock) {
    info.append(el('p', 'mt-2 text-xs text-amber-700', `Solo quedan ${maxQty} unidades.`));
  }
  info.append(remove);

  const side = el('div', 'col-start-2 flex items-center justify-between gap-3 sm:col-start-3 sm:row-start-1 sm:flex-col sm:items-end');
  const current = Math.min(qty, maxQty);
  side.append(
    el('p', 'text-sm font-semibold', money.format((priceCents(product) * current) / 100)),
    renderStepper(id, product, current, maxQty),
  );

  li.append(thumb, info, side);
  return li;
}
