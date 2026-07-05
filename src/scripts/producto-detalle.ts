document.addEventListener('astro:page-load', () => {
  const mainImage = document.getElementById('main-image');
  document.querySelectorAll('.thumb-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-thumb');
      if (mainImage && src) mainImage.setAttribute('src', src);
    });
  });
});
