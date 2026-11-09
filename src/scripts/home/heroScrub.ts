// Scroll-scrub del hero: dibuja en un <canvas> el frame que corresponde al avance del
// scroll dentro de #hero-scrub. El resto de frames se descarga cuando la página ya ha cargado.
(() => {
  const section = document.getElementById('hero-scrub');
  if (!section) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = section.querySelector<HTMLCanvasElement>('.hero-scrub-canvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const total = Number(section.dataset.frameCount) || 0;
  const base = section.dataset.frameBase ?? '';
  if (!total || !base) return;

  // Uno de cada dos frames: con el recorrido de scroll actual no se nota y la descarga se reduce a la mitad.
  const step = 2;
  const indices: number[] = [];
  for (let i = 1; i <= total; i += step) indices.push(i);

  const frames: (HTMLImageElement | null)[] = indices.map(() => null);
  let current = -1;
  let rafId = 0;
  let shown = false;

  const src = (i: number) => `${base}${String(i).padStart(4, '0')}.webp`;

  // Ajusta el tamaño interno del canvas al del elemento (DPR limitado a 2).
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    current = -1;
    render();
  };

  // Dibuja con efecto "object-fit: cover".
  const draw = (img: HTMLImageElement) => {
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  // Frame cargado más cercano al objetivo (por si aún no han llegado todos).
  const nearestLoaded = (target: number) => {
    for (let d = 0; d < frames.length; d++) {
      const a = frames[target - d];
      if (a) return target - d;
      const b = frames[target + d];
      if (b) return target + d;
    }
    return -1;
  };

  const progress = () => {
    const rect = section.getBoundingClientRect();
    const range = section.offsetHeight - window.innerHeight;
    if (range <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / range));
  };

  function render() {
    rafId = 0;
    const target = Math.round(progress() * (frames.length - 1));
    const idx = nearestLoaded(target);
    if (idx < 0 || idx === current) return;
    current = idx;
    draw(frames[idx]!);
    if (!shown) {
      shown = true;
      canvas.classList.remove('opacity-0');
    }
  }

  const schedule = () => {
    if (!rafId) rafId = requestAnimationFrame(render);
  };

  const load = (i: number) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        frames[i] = img;
        schedule();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src(indices[i]);
    });

  // Carga: primero el frame inicial, luego el resto en lotes para no saturar la red.
  const preload = async () => {
    await load(0);
    const BATCH = 8;
    for (let i = 1; i < indices.length; i += BATCH) {
      await Promise.all(indices.slice(i, i + BATCH).map((_, k) => load(i + k)));
    }
  };

  // Solo escucha el scroll mientras el hero está en pantalla.
  let listening = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !listening) {
      window.addEventListener('scroll', schedule, { passive: true });
      listening = true;
      schedule();
    } else if (!entry.isIntersecting && listening) {
      window.removeEventListener('scroll', schedule);
      listening = false;
    }
  });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  observer.observe(section);

  // Los frames no compiten con la carga inicial: empiezan cuando la página ha cargado,
  // o antes si el usuario ya empieza a hacer scroll.
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    window.removeEventListener('scroll', start);
    preload();
  };
  window.addEventListener('scroll', start, { passive: true, once: true });
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
