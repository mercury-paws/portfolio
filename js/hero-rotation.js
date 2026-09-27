'use strict';

(() => {
  const frame = document.querySelector('.photo-frame[data-hero-base]');
  const image = frame?.querySelector('img');
  const toggle = document.querySelector('.hero-rotation-toggle');
  const number = document.querySelector('.hero-image-number');
  if (!frame || !image || !toggle) return;

  const base = frame.dataset.heroBase;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const words = {
    en: ['Pause', 'Play', 'Pause image rotation', 'Resume image rotation'],
    cs: ['Pozastavit', 'Spustit', 'Pozastavit střídání obrázků', 'Obnovit střídání obrázků'],
    ru: ['Пауза', 'Продолжить', 'Остановить смену изображений', 'Продолжить смену изображений'],
    uk: ['Пауза', 'Продовжити', 'Зупинити зміну зображень', 'Продовжити зміну зображень']
  }[document.documentElement.lang] || ['Pause', 'Play', 'Pause image rotation', 'Resume image rotation'];
  let current = 0;
  let paused = false;
  let timer;

  image.addEventListener('error', () => image.classList.add('is-unavailable'));
  image.addEventListener('load', () => image.classList.remove('is-unavailable'));
  if (image.complete && !image.naturalWidth) image.classList.add('is-unavailable');

  // GitHub Pages cannot list a folder. Probe consecutive filenames instead.
  function preload(index) {
    const url = `${base}intro_img_${index}.png`;
    return new Promise(resolve => {
      const probe = new Image();
      let finished = false;
      const deadline = window.setTimeout(() => finish(null), 15000);
      function finish(result) {
        if (finished) return;
        finished = true;
        window.clearTimeout(deadline);
        probe.onload = probe.onerror = null;
        resolve(result);
      }
      probe.onload = () => finish(url);
      probe.onerror = () => finish(null);
      probe.src = url;
    });
  }

  async function display(url, index) {
    if (index !== current && current && !reduceMotion.matches) {
      image.classList.add('is-fading');
      await new Promise(resolve => window.setTimeout(resolve, 450));
    }
    image.src = url;
    image.classList.remove('is-unavailable');
    image.classList.remove('is-fading');
    current = index;
    if (number) number.textContent = `${String(index).padStart(2, '0')} / MP`;
  }

  async function advance() {
    const next = current ? current + 1 : 1;
    let url = await preload(next);
    let index = next;
    if (!url && next !== 1) {
      index = 1;
      url = await preload(1);
    }
    if (url && index !== current && !(paused && current)) await display(url, index);
  }

  async function tick() {
    if (!paused && !document.hidden) await advance();
    if (!paused) timer = window.setTimeout(tick, 45000);
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? words[1] : words[0];
    toggle.setAttribute('aria-label', paused ? words[3] : words[2]);
    toggle.setAttribute('aria-pressed', String(paused));
    window.clearTimeout(timer);
    if (!paused) timer = window.setTimeout(tick, 45000);
  });

  advance().finally(() => { if (!paused) timer = window.setTimeout(tick, 45000); });
})();
