(() => {
  const frame = document.getElementById('store-map-frame') as HTMLIFrameElement | null;
  const mapName = document.getElementById('store-map-name');
  const external = document.getElementById('store-map-external') as HTMLAnchorElement | null;
  const search = document.getElementById('store-postcode-search') as HTMLInputElement | null;
  const message = document.getElementById('store-search-message');

  const selectStore = (link: HTMLAnchorElement) => {
    if (!frame || !mapName || !external) return;
    const query = link.dataset.mapQuery;
    const name = link.dataset.mapName;
    if (!query || !name) return;
    frame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    frame.title = `Mapa de ${name}`;
    mapName.textContent = name;
    external.href = link.href;
  };

  document.querySelectorAll<HTMLAnchorElement>('[data-map-query]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!window.matchMedia('(min-width: 1024px)').matches) return;
      event.preventDefault();
      selectStore(link);
    });
  });

  search?.addEventListener('input', () => {
    const value = search.value.replace(/\D/g, '').slice(0, 5);
    search.value = value;
    const cards = [...document.querySelectorAll<HTMLElement>('[data-store-card]')];
    const matches = cards.filter((card) => {
      const match = value === '' || (card.dataset.storePostcode ?? '').startsWith(value);
      card.classList.toggle('hidden', !match);
      return match;
    });
    message?.classList.toggle('hidden', matches.length > 0);
    const firstLink = matches[0]?.querySelector<HTMLAnchorElement>('[data-map-query]');
    if (firstLink && window.matchMedia('(min-width: 1024px)').matches) selectStore(firstLink);
  });
})();
