// Pega aquí la URL /exec de tu implementación de Google Apps Script.
const AEE_SCRIPT_URL = "PEGAR_URL_DE_APPS_SCRIPT_AQUI";

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

// Envío desde GitHub Pages a Apps Script mediante iframe (sin problemas de CORS).
const aeeForm = document.querySelector('#contact-form');
const aeeNote = document.querySelector('#form-note');
const aeeButton = aeeForm.querySelector('button[type="submit"]');
let pendingRequest = null;
aeeForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!AEE_SCRIPT_URL.startsWith('https://script.google.com/macros/s/') || !AEE_SCRIPT_URL.endsWith('/exec')) {
    aeeNote.textContent = 'Falta configurar la URL de Google Apps Script en script.js.';
    return;
  }
  const requestId = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
  aeeForm.querySelector('#contact-request-id').value = requestId;
  aeeForm.action = AEE_SCRIPT_URL;
  pendingRequest = requestId;
  aeeButton.disabled = true;
  aeeNote.textContent = 'Enviando solicitud…';
  HTMLFormElement.prototype.submit.call(aeeForm);
  // Si el navegador bloquea la respuesta, permitir reintentar manualmente.
  window.setTimeout(() => {
    if (pendingRequest === requestId) {
      aeeNote.textContent = 'No se pudo confirmar la recepción. Consulta tu hoja antes de intentar de nuevo.';
      aeeButton.disabled = false;
      pendingRequest = null;
    }
  }, 20000);
});
window.addEventListener('message', event => {
  const frame = document.querySelector('#aee-form-frame');
  if (event.source !== frame.contentWindow || !event.data || event.data.type !== 'AEE_CONTACT_RESULT') return;
  if (!pendingRequest || event.data.id !== pendingRequest) return;
  pendingRequest = null;
  aeeButton.disabled = false;
  if (event.data.ok) {
    aeeForm.reset();
    aeeNote.textContent = '¡Solicitud recibida! Gracias por escribir a Andad en Él.';
  } else {
    aeeNote.textContent = 'No se pudo guardar la solicitud. Intenta de nuevo o escríbenos directamente.';
  }
});

// Biblioteca digital: búsqueda instantánea y filtros combinables, sin servicios externos.
(() => {
  const search = document.querySelector('#library-search');
  const filters = [...document.querySelectorAll('.library-filter')];
  const cards = [...document.querySelectorAll('#library-results .download-card')];
  const count = document.querySelector('#library-count');
  const empty = document.querySelector('#library-empty');
  const reset = document.querySelector('#library-reset');
  if (!search || !cards.length) return;
  let activeCategory = 'todos';
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
  const update = () => {
    const query = normalize(search.value);
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = activeCategory === 'todos' || card.dataset.category === activeCategory;
      const matchesText = !query || normalize(card.textContent + ' ' + (card.dataset.search || '')).includes(query);
      card.hidden = !(matchesCategory && matchesText);
      if (!card.hidden) visible++;
    });
    count.textContent = `Mostrando ${visible} ${visible === 1 ? 'publicación' : 'publicaciones'}`;
    empty.hidden = visible !== 0;
  };
  search.addEventListener('input', update);
  filters.forEach(button => button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    update();
  }));
  reset.addEventListener('click', () => {
    search.value = '';
    filters.find(button => button.dataset.filter === 'todos').click();
    search.focus();
  });
  update();
})();
