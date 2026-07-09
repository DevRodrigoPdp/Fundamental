(() => {
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const iconOpen = document.getElementById('nav-icon-open');
  const iconClose = document.getElementById('nav-icon-close');
  const desktopTrigger = document.querySelector('.nav-master-trigger');
  const desktopToggle = document.getElementById('nav-desktop-toggle');

  // Menú móvil (overlay a pantalla completa): usa el truco de position:fixed
  // porque en iOS/Safari touch, overflow:hidden solo no basta para frenar el scroll.
  let scrollLocked = false;
  let lockedScrollY = 0;

  const lockScroll = () => {
    if (scrollLocked) return;
    scrollLocked = true;
    lockedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  };

  const unlockScroll = () => {
    if (!scrollLocked) return;
    scrollLocked = false;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, lockedScrollY);
  };

  // Menú desktop (dropdown por hover con mouse): con position:fixed el
  // reposicionamiento al entrar/salir rápido del área provoca saltos visibles.
  // Basta con overflow:hidden simple, sin tocar el scroll ni la posición.
  const lockScrollSimple = () => {
    document.documentElement.style.overflow = 'hidden';
  };
  const unlockScrollSimple = () => {
    document.documentElement.style.overflow = '';
  };

  const closeDesktopMenu = () => {
    desktopTrigger?.classList.remove('is-open');
    desktopToggle?.setAttribute('aria-expanded', 'false');
    unlockScrollSimple();
  };

  desktopToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = !desktopTrigger?.classList.contains('is-open');
    desktopTrigger?.classList.toggle('is-open', willOpen);
    desktopToggle.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) lockScrollSimple();
    else unlockScrollSimple();
  });

  desktopTrigger?.addEventListener('mouseenter', lockScrollSimple);
  desktopTrigger?.addEventListener('mouseleave', () => {
    if (!desktopTrigger.classList.contains('is-open')) unlockScrollSimple();
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
    unlockScroll();
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
    lockScroll();
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
