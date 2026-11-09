(() => {
  const track = document.getElementById('novedades-carousel');
  const prev = document.getElementById('carousel-prev');
  const next = document.getElementById('carousel-next');
  if (!track || !prev || !next) return;

  // Avanza casi una "página" de cards (lo visible menos una card).
  const scrollByPage = (dir: number) => {
    const card = track.querySelector<HTMLElement>(':scope > a');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    const step = card ? card.offsetWidth + gap : 300;
    const perPage = Math.max(1, Math.floor(track.clientWidth / step) - 1);
    track.scrollBy({ left: dir * step * perPage, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => scrollByPage(-1));
  next.addEventListener('click', () => scrollByPage(1));
})();
