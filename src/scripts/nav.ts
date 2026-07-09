(() => {
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const iconOpen = document.getElementById('nav-icon-open');
  const iconClose = document.getElementById('nav-icon-close');
  const desktopTrigger = document.querySelector('.nav-master-trigger');
  const desktopToggle = document.getElementById('nav-desktop-toggle');

  const closeDesktopMenu = () => {
    desktopTrigger?.classList.remove('is-open');
    desktopToggle?.setAttribute('aria-expanded', 'false');
  };

  desktopToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = !desktopTrigger?.classList.contains('is-open');
    desktopTrigger?.classList.toggle('is-open', willOpen);
    desktopToggle.setAttribute('aria-expanded', String(willOpen));
  });

  document.addEventListener('click', (event) => {
    if (desktopTrigger && !desktopTrigger.contains(event.target as Node)) closeDesktopMenu();
  });

  if (!toggle || !mobileMenu) return;

  const closeMobileMenu = () => {
    if (mobileMenu.contains(document.activeElement)) {
      toggle.focus({ preventScroll: true });
    }
    mobileMenu.classList.add('pointer-events-none', 'translate-y-[-10px]', 'opacity-0');
    mobileMenu.classList.remove('pointer-events-auto', 'translate-y-0', 'opacity-100', 'is-open');
    mobileMenu.setAttribute('inert', '');
    mobileMenu.setAttribute('aria-hidden', 'true');
    iconOpen?.classList.remove('hidden');
    iconClose?.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('overflow-hidden');
  };

  const openMobileMenu = () => {
    mobileMenu.removeAttribute('inert');
    mobileMenu.classList.remove('pointer-events-none', 'translate-y-[-10px]', 'opacity-0');
    mobileMenu.classList.add('pointer-events-auto', 'translate-y-0', 'opacity-100', 'is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    iconOpen?.classList.add('hidden');
    iconClose?.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('overflow-hidden');
  };

  toggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('is-open')) closeMobileMenu();
    else openMobileMenu();
  });

  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeDesktopMenu();
    if (mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
      toggle.focus();
    }
  });
})();
