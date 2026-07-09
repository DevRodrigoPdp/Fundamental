(() => {
  const frame = document.getElementById('store-map-frame') as HTMLIFrameElement | null;
  const name = document.getElementById('store-map-name');
  const external = document.getElementById('store-map-external') as HTMLAnchorElement | null;
  const postcodeSearch = document.getElementById('store-postcode-search') as HTMLInputElement | null;
  const searchMessage = document.getElementById('store-search-message');
  const addressLinks = document.querySelectorAll<HTMLAnchorElement>('[data-map-query]');
  if (!frame || !name || !external) return;

  const selectStore = (link: HTMLAnchorElement) => {
    const query = link.dataset.mapQuery;
    const storeName = link.dataset.mapName;
    if (!query || !storeName) return;

    frame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
    frame.title = 'Mapa de ' + storeName;
    name.textContent = storeName;
    external.href = link.href;

    document.querySelectorAll('[data-store-card]').forEach((card) => {
      card.classList.remove('is-active', 'border-[#C4A072]/45', 'bg-[#C4A072]/[0.045]');
      card.classList.add('border-white/7');
    });

    const card = link.closest('[data-store-card]');
    card?.classList.remove('border-white/7');
    card?.classList.add('is-active', 'border-[#C4A072]/45', 'bg-[#C4A072]/[0.045]');
  };

  addressLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!window.matchMedia('(min-width: 1024px)').matches) return;

      event.preventDefault();
      selectStore(link);
    });
  });

  postcodeSearch?.addEventListener('input', () => {
    const value = postcodeSearch.value.replace(/\D/g, '').slice(0, 5);
    postcodeSearch.value = value;

    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-store-card]'));
    searchMessage?.classList.add('hidden');

    if (value.length < 5) {
      const matches = cards.filter((card) => {
        const postcode = card.dataset.storePostcode ?? '';
        const isMatch = value === '' || postcode.startsWith(value);
        card.classList.toggle('hidden', !isMatch);
        return isMatch;
      });

      if (matches.length === 0 && value !== '' && searchMessage) {
        searchMessage.textContent = 'No encontramos una tienda en esa zona postal. Prueba con otro código o consulta el mapa.';
        searchMessage.classList.remove('hidden');
      }
      return;
    }

    const exactMatches = cards.filter((card) => card.dataset.storePostcode === value);
    if (exactMatches.length > 0) {
      cards.forEach((card) => card.classList.toggle('hidden', !exactMatches.includes(card)));
      const firstLink = exactMatches[0].querySelector<HTMLAnchorElement>('[data-map-query]');
      if (firstLink && window.matchMedia('(min-width: 1024px)').matches) selectStore(firstLink);
      return;
    }

    const provincePrefix = value.slice(0, 2);
    const sameProvince = cards
      .filter((card) => (card.dataset.storePostcode ?? '').startsWith(provincePrefix))
      .sort((a, b) => {
        const distanceA = Math.abs(Number(a.dataset.storePostcode) - Number(value));
        const distanceB = Math.abs(Number(b.dataset.storePostcode) - Number(value));
        return distanceA - distanceB;
      });

    if (sameProvince.length > 0) {
      const nearest = sameProvince[0];
      cards.forEach((card) => card.classList.toggle('hidden', card !== nearest));
      if (searchMessage) {
        searchMessage.textContent = 'No tenemos tienda exactamente en el código postal ' + value + '. Te mostramos la más cercana dentro de la misma zona postal.';
        searchMessage.classList.remove('hidden');
      }
      const nearestLink = nearest.querySelector<HTMLAnchorElement>('[data-map-query]');
      if (nearestLink && window.matchMedia('(min-width: 1024px)').matches) selectStore(nearestLink);
      return;
    }

    cards.forEach((card) => card.classList.add('hidden'));
    if (searchMessage) {
      searchMessage.textContent = 'No encontramos una tienda en esa provincia o zona postal. Prueba con otro código o consulta el mapa.';
      searchMessage.classList.remove('hidden');
    }
  });
})();
