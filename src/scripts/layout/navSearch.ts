// Buscador del header: abre un panel bajo la barra y muestra cards de producto al escribir.
type Entry = { sku: string; nombre: string; categoria: string; terms: string; imagen: string | null };

(() => {
  const panel = document.getElementById('nav-search-panel');
  const backdrop = document.getElementById('nav-search-backdrop');
  const input = document.getElementById('nav-search-input') as HTMLInputElement | null;
  const results = document.getElementById('nav-search-results');
  const status = document.getElementById('nav-search-status');
  const all = document.getElementById('nav-search-all') as HTMLAnchorElement | null;
  const closeBtn = document.getElementById('nav-search-close');
  const triggers = document.querySelectorAll<HTMLElement>('[data-search-open]');
  const header = document.querySelector('header');
  if (!panel || !backdrop || !input || !results || !status || !all) return;

  const MAX = 12;
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

  let index: (Entry & { haystack: string })[] | null = null;
  let loading: Promise<void> | null = null;
  let lastTrigger: HTMLElement | null = null;

  const loadIndex = () =>
    (loading ??= fetch('/search-index.json')
      .then((r) => r.json())
      .then((data: Entry[]) => { index = data.map((e) => ({ ...e, haystack: norm(e.terms) })); })
      .catch(() => { status.textContent = 'No se pudo cargar el buscador. Prueba en el catálogo.'; }));

  const card = (e: Entry) => `
    <a href="/catalogo/${encodeURIComponent(e.sku)}" class="group block">
      <div class="relative mb-3 aspect-square overflow-hidden bg-[#F2F2F2]">
        ${e.imagen
          ? `<img src="${esc(e.imagen)}" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-contain p-[14%] mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.05]" />`
          : `<img src="/logo_t3r.png" alt="" class="absolute inset-0 m-auto h-10 opacity-20" />`}
      </div>
      <p class="mb-0.5 text-xs font-medium text-[#8B6B3F]">${esc(e.categoria)}</p>
      <p class="line-clamp-2 text-sm font-semibold leading-snug text-[#111111] group-hover:text-[#8B6B3F]">${esc(e.nombre)}</p>
    </a>`;

  const idle = document.getElementById('nav-search-idle');

  const render = () => {
    const q = input.value.trim();
    idle?.classList.toggle('hidden', !!q);
    if (!q) {
      results.innerHTML = '';
      status.textContent = '';
      all.classList.add('hidden');
      all.classList.remove('inline-flex');
      return;
    }
    if (!index) { status.textContent = 'Cargando…'; return; }
    const words = norm(q).split(/\s+/).filter(Boolean);
    const found = index.filter((e) => words.every((w) => e.haystack.includes(w)));
    results.innerHTML = found.slice(0, MAX).map(card).join('');
    status.textContent = found.length
      ? `${found.length} ${found.length === 1 ? 'producto' : 'productos'}`
      : `Sin resultados para "${q}". Prueba con otra palabra o mira el catálogo completo.`;
    all.href = `/catalogo?q=${encodeURIComponent(q)}`;
    (all.firstElementChild as HTMLElement).textContent = found.length > MAX ? `Ver los ${found.length} resultados en el catálogo` : 'Ver en el catálogo';
    all.classList.toggle('hidden', !found.length);
    all.classList.toggle('inline-flex', !!found.length);
  };

  const setNavHeight = () => {
    if (header) document.documentElement.style.setProperty('--nav-h', `${header.offsetHeight}px`);
  };

  const isOpen = () => panel.classList.contains('is-open');

  const open = (trigger?: HTMLElement) => {
    lastTrigger = trigger ?? null;
    setNavHeight();
    panel.removeAttribute('inert');
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('is-open', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
    panel.classList.remove('opacity-0', '-translate-y-3', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'true'));
    document.documentElement.style.overflow = 'hidden';
    input.focus({ preventScroll: true });
    loadIndex().then(render);
  };

  const close = () => {
    panel.setAttribute('inert', '');
    panel.setAttribute('aria-hidden', 'true');
    panel.classList.remove('is-open', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
    panel.classList.add('opacity-0', '-translate-y-3', 'pointer-events-none');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
    document.documentElement.style.overflow = '';
    lastTrigger?.focus({ preventScroll: true });
  };

  triggers.forEach((t) => t.addEventListener('click', () => (isOpen() ? close() : open(t))));
  // Precarga el índice cuando el usuario apunta a la lupa (la apertura es instantánea).
  triggers.forEach((t) => t.addEventListener('pointerenter', () => loadIndex(), { once: true }));
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  input.addEventListener('input', render);
  // Categorías: al señalar una, la foto y la descripción de la derecha cambian a esa familia.
  const catLinks = [...panel.querySelectorAll<HTMLElement>('[data-preview]')];
  const previewImgs = [...panel.querySelectorAll<HTMLElement>('[data-preview-img]')];
  const previewTexts = [...panel.querySelectorAll<HTMLElement>('[data-preview-text]')];
  const showPreview = (i: string, mark = true) => {
    catLinks.forEach((l) => l.classList.toggle('is-current', mark && l.dataset.preview === i));
    previewImgs.forEach((img) => {
      const on = img.dataset.previewImg === i;
      img.classList.toggle('opacity-100', on);
      img.classList.toggle('scale-100', on);
      img.classList.toggle('opacity-0', !on);
      img.classList.toggle('scale-[0.96]', !on);
    });
    previewTexts.forEach((t) => {
      const on = t.dataset.previewText === i;
      t.classList.toggle('opacity-100', on);
      t.classList.toggle('opacity-0', !on);
    });
  };
  catLinks.forEach((link) => {
    const i = link.dataset.preview ?? '0';
    link.addEventListener('pointerenter', () => showPreview(i));
    link.addEventListener('focus', () => showPreview(i));
  });
  // Al abrir se ve la primera foto, sin marcar ninguna categoría hasta que el usuario señale una.
  showPreview('0', false);

  // Búsquedas rápidas: rellenan el campo y muestran los resultados.
  panel.querySelectorAll<HTMLElement>('[data-quick-search]').forEach((chip) =>
    chip.addEventListener('click', () => {
      input.value = chip.dataset.quickSearch ?? '';
      input.focus({ preventScroll: true });
      loadIndex().then(render);
    }),
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close();
  });
  window.addEventListener('resize', setNavHeight, { passive: true });
})();
