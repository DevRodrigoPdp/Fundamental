document.addEventListener('astro:page-load', () => {
  const input = document.getElementById('search-input') as HTMLInputElement | null;
  const cards = [...document.querySelectorAll<HTMLElement>('[data-product-card]')];
  const emptyState = document.getElementById('empty-state');
  const clearButton = document.getElementById('search-clear');
  const clearFiltersButton = document.getElementById('filters-clear') as HTMLElement | null;
  const sidebarClear = document.getElementById('sidebar-clear') as HTMLElement | null;
  const filterPanel = document.getElementById('catalog-filters');
  const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
  const categoryButtons = [...document.querySelectorAll<HTMLElement>('[data-category-filter]')];
  const productButtons = [...document.querySelectorAll<HTMLElement>('[data-product-filter]')];
  const status = document.getElementById('search-status');
  if (!input) return;
  let selectedCategory = '';
  let selectedProduct = '';

  const normalize = (value: string) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  const aliases = new Map([
    ['6t', '6 tornillos'],
    ['centerlock', 'center lock'],
    ['cl', 'center lock'],
    ['rotor', 'disco'],
    ['brake', 'freno'],
    ['pads', 'pastillas'],
    ['bici', 'bicicleta'],
  ]);

  const oneEditAway = (term: string, word: string) => {
    if (term === word) return true;
    if (Math.abs(term.length - word.length) > 1) return false;
    let i = 0;
    let j = 0;
    let edits = 0;
    while (i < term.length && j < word.length) {
      if (term[i] === word[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (term.length > word.length) i++;
      else if (word.length > term.length) j++;
      else { i++; j++; }
    }
    return edits + (i < term.length || j < word.length ? 1 : 0) <= 1;
  };

  const searchableCards = cards.map((card, index) => {
    const fields = {
      name: normalize(card.dataset.name || ''),
      category: normalize(card.dataset.category || ''),
      subcategory: normalize(card.dataset.subcategory || ''),
      sku: normalize(card.dataset.sku || ''),
    };
    return {
      card,
      index,
      id: card.dataset.productId || '',
      fields,
      words: Object.values(fields).join(' ').split(' '),
    };
  });

  const termScore = (term: string, item: (typeof searchableCards)[number]) => {
    if (item.fields.sku.includes(term)) return 30;
    if (item.fields.name.split(' ').some((word) => word.startsWith(term))) return 24;
    if (item.fields.name.includes(term)) return 18;
    if (item.fields.subcategory.includes(term)) return 12;
    if (item.fields.category.includes(term)) return 8;
    if (term.length >= 4 && item.words.some((word) => oneEditAway(term, word))) return 4;
    return 0;
  };

  const filter = () => {
    const rawQuery = input.value.trim();
    const normalizedQuery = normalize(rawQuery);
    const expandedQuery = aliases.get(normalizedQuery) || normalizedQuery;
    const terms = expandedQuery.split(' ').filter(Boolean);
    const results = searchableCards.map((item) => {
      const scores = terms.map((term) => termScore(term, item));
      const matchesText = terms.length === 0 || scores.every((score) => score > 0);
      const matchesProduct = !selectedProduct || item.id === selectedProduct;
      const matchesCategory = !selectedCategory || selectedCategory.split('|').map(normalize).includes(item.fields.subcategory);
      const match = matchesText && matchesProduct && matchesCategory;
      let score = scores.reduce((total, value) => total + value, 0);
      if (expandedQuery && item.fields.name.includes(expandedQuery)) score += 50;
      if (expandedQuery && item.fields.sku.includes(expandedQuery)) score += 60;
      return { ...item, match, score };
    }).sort((a, b) => b.score - a.score || a.index - b.index);

    let visibleCount = 0;
    results.forEach((result) => {
      result.card.style.display = result.match ? '' : 'none';
      if (result.match) visibleCount++;
    });

    if (emptyState) emptyState.classList.toggle('hidden', visibleCount > 0);
    clearButton?.classList.toggle('hidden', !rawQuery);
    if (clearFiltersButton) clearFiltersButton.style.display = (!rawQuery && !selectedProduct && !selectedCategory) ? 'none' : '';
    if (sidebarClear) sidebarClear.style.display = (!selectedProduct && !selectedCategory) ? 'none' : '';
    if (status) status.textContent = `${visibleCount} ${visibleCount === 1 ? 'producto' : 'productos'}`;

    const url = new URL(window.location.href);
    rawQuery ? url.searchParams.set('q', rawQuery) : url.searchParams.delete('q');
    selectedProduct ? url.searchParams.set('producto', selectedProduct) : url.searchParams.delete('producto');
    selectedCategory ? url.searchParams.set('categoria', selectedCategory) : url.searchParams.delete('categoria');
    history.replaceState({}, '', url);
  };

  input.addEventListener('input', filter);
  categoryButtons.forEach((button) => button.addEventListener('click', () => {
    selectedCategory = button.dataset.categoryFilter || '';
    selectedProduct = '';
    categoryButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    productButtons.forEach((item) => {
      const productCategory = item.dataset.filterCategory || '';
      const visible = !selectedCategory || !productCategory || productCategory === selectedCategory;
      item.classList.toggle('hidden', !visible);
      item.classList.toggle('is-active', !item.dataset.productFilter);
    });
    filter();
  }));
  productButtons.forEach((button) => button.addEventListener('click', () => {
    selectedProduct = button.dataset.productFilter || '';
    if (selectedProduct) {
      selectedCategory = button.dataset.filterCategory || '';
      categoryButtons.forEach((item) => item.classList.toggle('is-active', item.dataset.categoryFilter === selectedCategory));
    }
    productButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    filter();
    if (window.innerWidth < 1024) {
      filterPanel?.classList.remove('is-open');
      mobileFilterToggle?.setAttribute('aria-expanded', 'false');
    }
  }));
  mobileFilterToggle?.addEventListener('click', () => {
    const open = !filterPanel?.classList.contains('is-open');
    filterPanel?.classList.toggle('is-open', open);
    mobileFilterToggle.setAttribute('aria-expanded', String(open));
  });
  clearButton?.addEventListener('click', () => {
    input.value = '';
    filter();
    input.focus();
  });
  const clearAll = () => {
    input.value = '';
    selectedCategory = '';
    selectedProduct = '';
    categoryButtons.forEach((item) => item.classList.toggle('is-active', !item.dataset.categoryFilter));
    productButtons.forEach((item) => {
      item.classList.remove('hidden');
      item.classList.toggle('is-active', !item.dataset.productFilter);
    });
    filter();
  };
  clearFiltersButton?.addEventListener('click', () => { clearAll(); input.focus(); });
  sidebarClear?.addEventListener('click', clearAll);

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== input) {
      event.preventDefault();
      input.focus();
    }
  });

  // Precarga la búsqueda si llega ?q= en la URL (ej. desde los enlaces de categoría en /t3r)
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  if (initialQuery) {
    input.value = initialQuery;
  }
  const initialProduct = params.get('producto');
  const initialCategory = params.get('categoria');
  if (initialCategory) {
    selectedCategory = initialCategory;
    categoryButtons.forEach((item) => item.classList.toggle('is-active', item.dataset.categoryFilter === initialCategory));
    productButtons.forEach((item) => {
      const category = item.dataset.filterCategory || '';
      item.classList.toggle('hidden', Boolean(category && category !== initialCategory));
    });
  }
  if (initialProduct) {
    const productButton = productButtons.find((item) => item.dataset.productFilter === initialProduct);
    if (productButton) {
      selectedProduct = initialProduct;
      selectedCategory = productButton.dataset.filterCategory || selectedCategory;
      productButtons.forEach((item) => item.classList.toggle('is-active', item === productButton));
      categoryButtons.forEach((item) => item.classList.toggle('is-active', item.dataset.categoryFilter === selectedCategory));
    }
  }
  filter();
});
