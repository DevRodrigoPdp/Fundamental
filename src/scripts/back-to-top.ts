document.addEventListener('astro:page-load', () => {
  const button = document.getElementById('back-to-top');
  if (!button) return;

  const visibleClass = ['opacity-100', 'translate-y-0', 'pointer-events-auto'];
  const hiddenClass = ['opacity-0', 'translate-y-4', 'pointer-events-none'];

  const toggle = () => {
    const shouldShow = window.scrollY > 420;
    button.classList.toggle(visibleClass[0], shouldShow);
    button.classList.toggle(visibleClass[1], shouldShow);
    button.classList.toggle(visibleClass[2], shouldShow);
    button.classList.toggle(hiddenClass[0], !shouldShow);
    button.classList.toggle(hiddenClass[1], !shouldShow);
    button.classList.toggle(hiddenClass[2], !shouldShow);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
});
