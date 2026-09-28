'use strict';

(() => {
  const frame = document.querySelector('.photo-frame[data-hero-base]');
  const image = frame?.querySelector('img');
  const button = document.querySelector('.hero-rotation-toggle');
  const number = document.querySelector('.hero-image-number');
  if (!frame || !image || !button) return;

  const labels = {
    en: ['Pause', 'Play', 'Pause image rotation', 'Resume image rotation'],
    cs: ['Pozastavit', 'Spustit', 'Pozastavit střídání obrázků', 'Obnovit střídání obrázků'],
    ru: ['Пауза', 'Продолжить', 'Остановить смену изображений', 'Продолжить смену изображений'],
    uk: ['Пауза', 'Продовжити', 'Зупинити зміну зображень', 'Продовжити зміну зображень']
  }[document.documentElement.lang] || ['Pause', 'Play', 'Pause image rotation', 'Resume image rotation'];

  const pictures = [];
  let current = 0;
  let paused = false;
  let scanning = false;
  let changing = false;

  image.addEventListener('error', () => image.classList.add('is-unavailable'));
  image.addEventListener('load', () => image.classList.remove('is-unavailable'));
  if (image.complete && !image.naturalWidth) image.classList.add('is-unavailable');

  // Find intro_img_1.png, intro_img_2.png, etc., until a number is missing.
  function findPictures(retry = false) {
    if (scanning) return;
    scanning = true;

    function checkNext() {
      const index = pictures.length + 1;
      const url = `${frame.dataset.heroBase}intro_img_${index}.png`;
      const probe = new Image();

      probe.onload = () => {
        pictures.push(probe.src);
        if (index === 1) {
          image.src = probe.src;
          current = 0;
        }
        checkNext();
      };

      probe.onerror = () => {
        scanning = false;
      };

      // Check again for newly uploaded files without a cached 404.
      probe.src = retry ? `${url}?check=${Date.now()}` : url;
      retry = false;
    }

    checkNext();
  }

  function showRandomPicture() {
    if (paused || changing || pictures.length < 2) return;

    // Choose any image except the one currently displayed.
    const offset = 1 + Math.floor(Math.random() * (pictures.length - 1));
    const next = (current + offset) % pictures.length;

    changing = true;
    image.classList.add('is-fading');

    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : 450;

    window.setTimeout(() => {
      if (!paused) {
        image.src = pictures[next];
        current = next;
        if (number) {
          number.textContent = `${String(next + 1).padStart(2, '0')} / MP`;
        }
      }

      image.classList.remove('is-fading');
      changing = false;
    }, delay);
  }

  button.addEventListener('click', () => {
    paused = !paused;
    button.textContent = paused ? labels[1] : labels[0];
    button.setAttribute('aria-label', paused ? labels[3] : labels[2]);
    button.setAttribute('aria-pressed', String(paused));
  });

  findPictures();

  window.setInterval(() => {
    if (paused || document.hidden) return;
    findPictures(true);
    showRandomPicture();
  }, 30000);
})();
