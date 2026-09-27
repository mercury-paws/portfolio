'use strict';

// The browser handles opening/closing <details>, including keyboard access.
// Keep the summary labels in sync when content.js refreshes the JSON stacks.
(() => {
  const shortNames = {
    en: { 'Frameworks and libraries': 'Libraries' },
    cs: { 'Frameworky a knihovny': 'Knihovny' },
    ru: { 'Фреймворки и библиотеки': 'Библиотеки' },
    uk: { 'Фреймворки та бібліотеки': 'Бібліотеки' }
  }[document.documentElement.lang] || {};

  for (const details of document.querySelectorAll('.project-stack')) {
    const labels = details.querySelector('.stack-labels');
    const refresh = () => {
      const names = [...details.querySelectorAll('.card-skills dt')]
        .map(dt => dt.textContent.trim())
        .map(name => shortNames[name] || name);
      const signature = names.join('\u001f');
      if (labels.dataset.signature === signature) return;
      labels.dataset.signature = signature;
      const fragment = document.createDocumentFragment();
      names.forEach((name, index) => {
        if (index) {
          const dot = document.createElement('span');
          dot.className = 'stack-separator';
          dot.setAttribute('aria-hidden', 'true');
          dot.textContent = ' · ';
          fragment.append(dot);
        }
        const label = document.createElement('span');
        label.className = 'stack-category';
        label.textContent = name;
        fragment.append(label);
      });
      labels.replaceChildren(fragment);
    };
    refresh();
    // The signature guard prevents updates to this summary causing a loop.
    new MutationObserver(refresh).observe(details, {
      childList: true, subtree: true, characterData: true
    });
  }

  // A mobile menu left open should be closed when crossing to desktop.
  const desktop = window.matchMedia('(min-width: 768px)');
  const resetDesktopMenu = () => {
    if (!desktop.matches) return;
    const nav = document.querySelector('#site-nav');
    const toggle = document.querySelector('.menu-toggle');
    if (nav) nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };
  desktop.addEventListener('change', resetDesktopMenu);
  resetDesktopMenu();
})();
