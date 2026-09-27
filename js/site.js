'use strict';
// All content is already in HTML. This script only enhances navigation and forms.
document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-nav');
if (menuButton && menu) {
  menuButton.hidden = false;
  const closeMenu = () => { menu.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); };
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
}
const search = document.querySelector('#blog-search');
if (search) {
  search.closest('.search-field').hidden = false;
  search.addEventListener('input', () => {
    const cards = [...document.querySelectorAll('.blog-card')];
    const query = search.value.trim().toLocaleLowerCase();
    cards.forEach(card => { card.hidden = !card.dataset.search.toLocaleLowerCase().includes(query); });
    document.querySelector('#no-results').hidden = cards.some(card => !card.hidden);
  });
}
const form = document.querySelector('#contact-form');
if (form) {
  form.querySelector('fieldset').disabled = false;
  const messages = JSON.parse(document.querySelector('#ui-messages').textContent);
  const review = document.querySelector('#is-review');
  const consent = document.querySelector('#review-consent');
  const consentRow = document.querySelector('#review-consent-row');
  const result = document.querySelector('#email-result');
  const status = document.querySelector('#contact-status');
  const draft = document.querySelector('#email-draft');
  const mailLink = document.querySelector('#email-link');
  const copyButton = document.querySelector('#copy-message');
  let copyText = '';
  review.checked = new URLSearchParams(location.search).get('review') === '1';
  consentRow.hidden = !review.checked;
  const invalidate = () => { result.hidden = true; status.textContent = ''; copyText = ''; };
  form.addEventListener('input', event => {
    if (event.target === draft) return;
    event.target.setCustomValidity?.('');
    consentRow.hidden = !review.checked;
    if (!review.checked) consent.checked = false;
    invalidate();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const nameInput = form.elements.namedItem('name');
    const emailInput = form.elements.namedItem('email');
    const messageInput = form.elements.namedItem('message');
    // Trim whitespace without stripping punctuation or non-Latin characters.
    for (const field of [nameInput, emailInput, messageInput]) field.value = field.value.trim();
    messageInput.setCustomValidity(messageInput.value.length < 10 ? messages.tooShort : '');
    if (!form.reportValidity()) return;
    const subject = review.checked ? `Portfolio review — ${nameInput.value}` : `Portfolio inquiry — ${nameInput.value}`;
    const body = `${messageInput.value}\n\n${nameInput.value}\n${emailInput.value}` +
      (review.checked ? `\n\n${consent.checked ? messages.reviewConsent : messages.noConsent}` : '');
    mailLink.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    copyText = `To: ${form.dataset.email}\nSubject: ${subject}\n\n${body}`;
    draft.value = copyText;
    result.hidden = false;
    status.textContent = messages.ready;
    // No send claim: the visitor must send from their email service.
    mailLink.focus();
  });
  copyButton.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(copyText);
      status.textContent = messages.copied;
    } catch {
      draft.focus(); draft.select();
      status.textContent = messages.copyFail;
    }
  });
  form.addEventListener('reset', () => {
    invalidate(); draft.value = ''; mailLink.href = `mailto:${form.dataset.email}`;
    consentRow.hidden = true;
  });
}
