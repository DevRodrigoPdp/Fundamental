(() => {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

  const contactEmail = form.dataset.contactEmail;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const motivo = (form.elements.namedItem('motivo') as HTMLInputElement).value;
    const mensaje = (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value;

    const subject = `${motivo} — ${nombre}`;
    const body =
      `Nombre: ${nombre}\n` +
      `Email de contacto: ${email}\n` +
      `Motivo: ${motivo}\n\n` +
      `Mensaje:\n${mensaje}`;

    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
})();
