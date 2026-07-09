(() => {
  const track = document.getElementById('novedades-carousel');
  const prev = document.getElementById('carousel-prev');
  const next = document.getElementById('carousel-next');
  if (!track || !prev || !next) return;

  const scrollByCard = (dir: number) => {
    const card = track.querySelector(':scope > div');
    const cardWidth = card ? card.getBoundingClientRect().width + 24 : 300;
    track.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
})();
