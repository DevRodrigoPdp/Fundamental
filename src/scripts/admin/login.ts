const form = document.getElementById('login-form') as HTMLFormElement;
const submitBtn = document.getElementById('login-submit') as HTMLButtonElement;
form?.addEventListener('submit', () => {
  submitBtn.disabled = true;
  submitBtn.textContent = 'Entrando...';
});
