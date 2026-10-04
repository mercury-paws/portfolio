(() => {
  'use strict';

  const page = document.querySelector('.case-content.education');
  const dialog = document.getElementById('certificate-dialog');

  if (!page || !dialog || typeof dialog.showModal !== 'function') return;

  const preview = dialog.querySelector('.certificate-dialog-image');
  const caption = dialog.querySelector('.certificate-dialog-caption');
  const close = dialog.querySelector('.certificate-dialog-close');

  let opener = null;

  function prepareGallery(gallery) {
    for (const image of gallery.querySelectorAll('img')) {
      image.classList.add('certificate');

      let button = image.parentElement;

      if (!button.matches('button.certificate-trigger')) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'certificate-trigger';

        image.replaceWith(button);
        button.append(image);
      }

      button.setAttribute(
        'aria-label',
        `Enlarge ${image.alt || 'certificate'}`
      );
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', dialog.id);
    }

    const count = gallery.querySelectorAll('img').length;

    gallery.dataset.count = String(count);
    gallery.style.setProperty(
      '--certificate-count',
      String(Math.max(count, 1))
    );
    gallery.toggleAttribute('data-shelf', count >= 3);
  }

  function refresh() {
    page.querySelectorAll('.certificate-gallery').forEach(prepareGallery);
  }

  refresh();

  new MutationObserver(refresh).observe(page, {
    childList: true,
    subtree: true
  });

  page.addEventListener('click', (event) => {
    const button = event.target.closest('.certificate-trigger');

    if (!button || !page.contains(button)) return;

    const image = button.querySelector('img');
    if (!image) return;

    opener = button;

    // Optional data-full="..." points to a higher-resolution image.
    preview.src = image.dataset.full || image.currentSrc || image.src;
    preview.alt = image.alt || 'Certificate';
    caption.textContent = image.alt;

    if (!dialog.open) dialog.showModal();

    document.documentElement.classList.add('certificate-modal-open');
    close.focus();
  });

  close.addEventListener('click', () => dialog.close());

  // Clicking outside the popup closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;

    const bounds = dialog.getBoundingClientRect();

    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      dialog.close();
    }
  });

  // Native <dialog> also supports closing with Escape.
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('certificate-modal-open');
    preview.removeAttribute('src');

    if (opener?.isConnected) {
      opener.focus({ preventScroll: true });
    }

    opener = null;
  });
})();
