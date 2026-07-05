    const specsList = document.getElementById('specs-list')!;
    const specsAdd = document.getElementById('specs-add')!;

    function addSpecRow(key = '', value = '') {
      const row = document.createElement('div');
      row.className = 'flex gap-2';
      row.innerHTML = `
        <input placeholder="Campo (ej: Compuesto)" value="${key}" data-spec-key class="w-1/3 border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black" />
        <input placeholder="Valor (ej: Semi-metálico)" value="${value}" data-spec-value class="flex-1 border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black" />
        <button type="button" data-spec-remove class="px-2 text-gray-400 hover:text-red-500 cursor-pointer">✕</button>
      `;
      row.querySelector('[data-spec-remove]')?.addEventListener('click', () => row.remove());
      specsList.appendChild(row);
    }
    specsAdd.addEventListener('click', () => addSpecRow());

    function collectSpecs(): Record<string, string> | null {
      const rows = [...specsList.querySelectorAll('div.flex')];
      const specs: Record<string, string> = {};
      rows.forEach((row) => {
        const key = (row.querySelector('[data-spec-key]') as HTMLInputElement)?.value.trim();
        const value = (row.querySelector('[data-spec-value]') as HTMLInputElement)?.value.trim();
        if (key) specs[key] = value;
      });
      return Object.keys(specs).length > 0 ? specs : null;
    }

    const taxonomySelect = document.getElementById('taxonomy') as HTMLSelectElement;
    const otraCategoria = document.getElementById('otra-categoria')!;
    taxonomySelect.addEventListener('change', () => {
      otraCategoria.classList.toggle('hidden', taxonomySelect.value !== 'otra');
    });

    const form = document.getElementById('form') as HTMLFormElement;
    const errorEl = document.getElementById('error')!;
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorEl.classList.add('hidden');

      let categoria: string;
      let subcategoria: string | null;
      let sku: string | null = null;
      if (taxonomySelect.value === 'otra') {
        categoria = (form.elements.namedItem('categoria') as HTMLInputElement)?.value;
        subcategoria = (form.elements.namedItem('subcategoria') as HTMLInputElement)?.value || null;
        sku = (form.elements.namedItem('sku') as HTMLInputElement)?.value;
        if (!sku) {
          errorEl.textContent = 'Indica un SKU para este tipo de producto.';
          errorEl.classList.remove('hidden');
          return;
        }
      } else if (taxonomySelect.value) {
        [categoria, subcategoria] = taxonomySelect.value.split('|');
      } else {
        errorEl.textContent = 'Selecciona el tipo de producto.';
        errorEl.classList.remove('hidden');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creando...';

      const fd = new FormData(form);
      const body: Record<string, unknown> = {
        sku,
        nombre: fd.get('nombre'),
        categoria,
        subcategoria,
        descripcion_corta: fd.get('descripcion_corta') || null,
        descripcion: fd.get('descripcion') || null,
        especificaciones: collectSpecs(),
        stock: fd.get('stock') ? Number(fd.get('stock')) : null,
        precio: fd.get('precio') ? Number(fd.get('precio')) : null,
        activo: fd.get('activo') === 'on',
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const { product } = await res.json();
        window.location.href = `/admin/productos/${product.sku}`;
      } else {
        const { error } = await res.json();
        errorEl.textContent = error || 'Error al crear el producto.';
        errorEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Crear producto';
      }
    });
