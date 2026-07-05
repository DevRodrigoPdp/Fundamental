function toast(message: string, type: 'success' | 'error' = 'success') {
  const el = document.createElement('div');
  el.textContent = message;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.className = `toast ${type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-white border border-[#C4A072]/40 text-[#1A100C]'}`;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

const search = document.getElementById('search') as HTMLInputElement;
const rows = [...document.querySelectorAll<HTMLElement>('[data-row]')];
const countLabel = document.getElementById('count');
const emptySearch = document.getElementById('empty-search');
const catButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-cat-filter]')];
const statusButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-status-filter]')];
const clearFiltersBtn = document.getElementById('clear-filters');

let selectedCats: string[] = [];
let selectedStatus = '';

function applyFilter() {
  const term = search.value.trim().toLowerCase();
  let visible = 0;
  rows.forEach((row) => {
    const matchesText = !term || (row.dataset.search ?? '').includes(term);
    const matchesCat = selectedCats.length === 0 || selectedCats.includes(row.dataset.subcategoria ?? '');
    const matchesStatus = !selectedStatus || row.dataset.status === selectedStatus;
    const match = matchesText && matchesCat && matchesStatus;
    row.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  if (countLabel) countLabel.textContent = `${visible} ${visible === 1 ? 'producto' : 'productos'}`;
  emptySearch?.classList.toggle('hidden', visible > 0);
  if (clearFiltersBtn) {
    clearFiltersBtn.style.display = (term || selectedCats.length > 0 || selectedStatus) ? '' : 'none';
  }
}
search?.addEventListener('input', applyFilter);

catButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedCats = button.dataset.catFilter ? button.dataset.catFilter.split('|') : [];
    catButtons.forEach((b) => b.classList.toggle('is-active', b === button));
    applyFilter();
  });
});

statusButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedStatus = button.dataset.statusFilter ?? '';
    statusButtons.forEach((b) => b.classList.toggle('is-active', b === button));
    applyFilter();
  });
});

clearFiltersBtn?.addEventListener('click', () => {
  search.value = '';
  selectedCats = [];
  selectedStatus = '';
  catButtons.forEach((b) => b.classList.toggle('is-active', !b.dataset.catFilter));
  statusButtons.forEach((b) => b.classList.toggle('is-active', !b.dataset.statusFilter));
  applyFilter();
});

const publishStatus = document.getElementById('publish-status');
function showPublishStatus(text: string) {
  if (!publishStatus) return;
  publishStatus.textContent = text;
  publishStatus.classList.remove('hidden');
}

document.querySelectorAll<HTMLButtonElement>('[data-delete]').forEach((button) => {
  button.addEventListener('click', async () => {
    const sku = button.dataset.delete;
    if (!confirm(`¿Borrar el producto ${sku}? Esto también borra sus fotos.`)) return;
    const originalHtml = button.innerHTML;
    button.textContent = 'Borrando...';
    const res = await fetch(`/api/admin/products/${sku}`, { method: 'DELETE' });
    if (res.ok) {
      showPublishStatus('Borrado. Publicando cambios en el sitio (1-2 min)...');
      button.closest('tr')?.remove();
      applyFilter();
    } else {
      toast('Error al borrar el producto.', 'error');
      button.innerHTML = originalHtml;
    }
  });
});

document.querySelectorAll<HTMLInputElement>('[data-toggle-active]').forEach((checkbox) => {
  checkbox.addEventListener('change', async () => {
    const sku = checkbox.dataset.toggleActive;
    const label = checkbox.nextElementSibling as HTMLElement | null;
    const row = checkbox.closest('tr') as HTMLElement | null;
    checkbox.disabled = true;
    const res = await fetch(`/api/admin/products/${sku}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: checkbox.checked }),
    });
    checkbox.disabled = false;
    if (res.ok) {
      if (label) {
        label.textContent = checkbox.checked ? 'Activo' : 'Inactivo';
        label.classList.toggle('text-green-700', checkbox.checked);
        label.classList.toggle('text-gray-400', !checkbox.checked);
      }
      if (row) row.dataset.status = checkbox.checked ? 'activo' : 'inactivo';
      applyFilter();
      showPublishStatus('Guardado. Publicando cambios en el sitio (1-2 min)...');
    } else {
      checkbox.checked = !checkbox.checked;
      toast('Error al actualizar.', 'error');
    }
  });
});
