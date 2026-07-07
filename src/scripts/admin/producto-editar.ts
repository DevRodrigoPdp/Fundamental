    function toast(message: string, type: 'success' | 'error' = 'success') {
      const el = document.createElement('div');
      el.textContent = message;
      el.className = `toast ${type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-white border border-[#C4A072]/40 text-[#1A100C]'}`;
      document.body.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-6px)';
        setTimeout(() => el.remove(), 300);
      }, 3000);
    }

    const specsList = document.getElementById('specs-list')!;
    const specsAdd = document.getElementById('specs-add')!;

    function addSpecRow(key?: string, value?: string) {
      const row = document.createElement('div');
      row.className = 'flex gap-2';
      row.innerHTML = `
        <input placeholder="Campo" value="${key ?? ''}" data-spec-key class="w-1/3 border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black" />
        <input placeholder="Valor" value="${value ?? ''}" data-spec-value class="flex-1 border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black" />
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
        const key = (row.querySelector('[data-spec-key]') as HTMLInputElement | null)?.value.trim();
        const value = (row.querySelector('[data-spec-value]') as HTMLInputElement | null)?.value.trim();
        if (key) specs[key] = value ?? '';
      });
      return Object.keys(specs).length > 0 ? specs : null;
    }

    // Los botones "borrar" de filas ya existentes en el servidor (renderizadas por Astro)
    document.querySelectorAll('#specs-list [data-spec-remove]').forEach((btn) => {
      btn.addEventListener('click', () => btn.closest('div.flex')?.remove());
    });

    const taxonomySelect = document.getElementById('taxonomy') as HTMLSelectElement;
    const otraCategoria = document.getElementById('otra-categoria')!;
    taxonomySelect.addEventListener('change', () => {
      otraCategoria.classList.toggle('hidden', taxonomySelect.value !== 'otra');
    });

    const form = document.getElementById('form') as HTMLFormElement;
    const sku = form.dataset.sku;
    const errorEl = document.getElementById('error')!;
    const savedEl = document.getElementById('saved')!;
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorEl.classList.add('hidden');
      savedEl.classList.add('hidden');

      let categoria: string;
      let subcategoria: string | null;
      if (taxonomySelect.value === 'otra') {
        categoria = (form.elements.namedItem('categoria') as HTMLInputElement)?.value;
        subcategoria = (form.elements.namedItem('subcategoria') as HTMLInputElement)?.value || null;
      } else {
        [categoria, subcategoria] = taxonomySelect.value.split('|');
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Guardando...';

      const fd = new FormData(form);
      const body: Record<string, unknown> = {
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

      const res = await fetch(`/api/admin/products/${sku}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      submitBtn.disabled = false;
      submitBtn.textContent = 'Guardar cambios';

      if (res.ok) {
        savedEl.textContent = 'Guardado. Publicando cambios en el sitio (1-2 min)...';
        savedEl.classList.remove('hidden');
      } else {
        const { error } = await res.json();
        errorEl.textContent = error || 'Error al guardar.';
        errorEl.classList.remove('hidden');
      }
    });

    document.getElementById('delete-btn')?.addEventListener('click', async () => {
      if (!confirm(`¿Borrar el producto ${sku}? Esto también borra sus fotos.`)) return;
      const res = await fetch(`/api/admin/products/${sku}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        toast('Error al borrar el producto.', 'error');
      }
    });

    // ── Galería de fotos: todo instantáneo (sin recargar página) ──

    const gallery = document.getElementById('gallery') as HTMLElement;

    const ICONS = {
      arrowUp: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
      arrowDown: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
      trash: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
      download: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
    };

    function cldThumb(url: string): string {
      if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
      return url.replace('/upload/', '/upload/f_auto,q_auto,w_400/');
    }

    function cldDownload(url: string): string {
      if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
      return url.replace('/upload/', '/upload/fl_attachment/');
    }

    function renderGalleryItem(image: { id: number; url: string }): HTMLElement {
      const div = document.createElement('div');
      div.className = 'relative border border-gray-200 bg-white p-2';
      div.dataset.image = String(image.id);
      div.innerHTML = `
        <img src="${cldThumb(image.url)}" alt="" class="aspect-square w-full object-contain" />
        <div class="mt-2 flex items-center justify-between">
          <div class="flex gap-2">
            <button type="button" class="text-gray-400 hover:text-black cursor-pointer" data-move="${image.id}" data-direction="up" title="Subir">${ICONS.arrowUp}</button>
            <button type="button" class="text-gray-400 hover:text-black cursor-pointer" data-move="${image.id}" data-direction="down" title="Bajar">${ICONS.arrowDown}</button>
          </div>
          <div class="flex items-center gap-3">
            <a href="${cldDownload(image.url)}" download class="inline-flex items-center gap-1 text-xs font-semibold uppercase text-[#6B8CAE] hover:underline">${ICONS.download} Descargar</a>
            <button type="button" class="inline-flex items-center gap-1 text-xs font-semibold uppercase text-red-500 hover:underline cursor-pointer" data-delete-image="${image.id}">${ICONS.trash} Borrar</button>
          </div>
        </div>
      `;
      return div;
    }

    function updatePortadaBadge() {
      [...gallery.children].forEach((item, i) => {
        const existing = item.querySelector('[data-portada-badge]');
        if (i === 0) {
          if (!existing) {
            const badge = document.createElement('span');
            badge.setAttribute('data-portada-badge', '');
            badge.className = 'absolute left-2 top-2 z-10 bg-[#C4A072] text-[#1A100C] text-[10px] font-bold px-1.5 py-0.5 uppercase';
            badge.textContent = 'Portada';
            item.prepend(badge);
          }
        } else {
          existing?.remove();
        }
      });
    }

    function updateGalleryEmptyMessage() {
      const existing = document.getElementById('gallery-empty');
      if (gallery.children.length > 0) {
        existing?.remove();
        return;
      }
      if (!existing) {
        const p = document.createElement('p');
        p.id = 'gallery-empty';
        p.className = 'mb-6 border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-400';
        p.textContent = 'Sin fotos todavía. Sube la primera abajo.';
        gallery.insertAdjacentElement('afterend', p);
      }
    }

    gallery.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const moveBtn = target.closest('[data-move]') as HTMLElement | null;
      const deleteBtn = target.closest('[data-delete-image]') as HTMLElement | null;

      if (moveBtn) {
        const id = moveBtn.dataset.move!;
        const direction = moveBtn.dataset.direction as 'up' | 'down';
        const item = moveBtn.closest('[data-image]') as HTMLElement;
        const sibling = direction === 'up' ? item.previousElementSibling : item.nextElementSibling;
        if (!sibling) return;

        // Reordena al instante, sin esperar respuesta del servidor
        if (direction === 'up') gallery.insertBefore(item, sibling);
        else gallery.insertBefore(sibling, item);
        updatePortadaBadge();

        const res = await fetch(`/api/admin/images/${id}/mover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction }),
        });
        if (!res.ok) {
          if (direction === 'up') gallery.insertBefore(sibling, item);
          else gallery.insertBefore(item, sibling);
          updatePortadaBadge();
          toast('Error al mover la foto.', 'error');
        }
        return;
      }

      if (deleteBtn) {
        if (!confirm('¿Borrar esta foto?')) return;
        const id = deleteBtn.dataset.deleteImage!;
        const item = deleteBtn.closest('[data-image]') as HTMLElement;
        const nextSibling = item.nextElementSibling;

        item.remove();
        updatePortadaBadge();
        updateGalleryEmptyMessage();

        const res = await fetch(`/api/admin/images/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          if (nextSibling) gallery.insertBefore(item, nextSibling);
          else gallery.appendChild(item);
          updatePortadaBadge();
          updateGalleryEmptyMessage();
          toast('Error al borrar la foto.', 'error');
        }
      }
    });

    const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
    const uploadStatus = document.getElementById('upload-status')!;
    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      uploadStatus.textContent = 'Subiendo...';
      uploadStatus.classList.remove('hidden');

      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`/api/admin/products/${sku}/images`, { method: 'POST', body: fd });

      if (res.ok) {
        const { image } = await res.json();
        gallery.appendChild(renderGalleryItem(image));
        updatePortadaBadge();
        updateGalleryEmptyMessage();
        uploadStatus.textContent = 'Foto subida.';
        fileInput.value = '';
        toast('Foto subida. Publicando cambios en el sitio (1-2 min)...');
      } else {
        uploadStatus.textContent = 'Error al subir la foto.';
        toast('Error al subir la foto.', 'error');
      }
    });
