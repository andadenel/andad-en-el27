// Ajusta esta dirección cuando tengas el correo oficial del ministerio.
const CONTACT_EMAIL = 'CAMBIAR_CORREO@ejemplo.com';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const note = document.querySelector('#form-note');
  if (CONTACT_EMAIL.includes('CAMBIAR_CORREO')) {
    note.textContent = 'Antes de activar el formulario, sustituye CONTACT_EMAIL en script.js por el correo oficial de AEE.';
    return;
  }
  const name = document.querySelector('#contact-name').value.trim();
  const email = document.querySelector('#contact-email').value.trim();
  const message = document.querySelector('#contact-message').value.trim();
  const subject = encodeURIComponent('Contacto desde la web AEE — ' + name);
  const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  note.textContent = 'Se ha intentado abrir tu aplicación de correo. Comprueba el mensaje antes de enviarlo.';
});
