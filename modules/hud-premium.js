/* =====================================================
   RETEAR® — HUD ORBITAL PREMIUM
   Conteúdo dinâmico derivado dos .front-card-premium.
   Núcleo circular e três HUDs levitantes preservam a V001.0.
===================================================== */
(function () {
  'use strict';

  const CLOSED_KEY = 'retear-hud-premium-closed';
  const ROTATION_MS = 7000;
  const ICONS = ['brain', 'chart-pie', 'dashboard', 'guard', 'kpi', 'puzzle', 'strategy', 'target', 'tree'];
  const SATELLITE_INTERVALS = [4700, 6300, 7900];
  const SATELLITE_START_DELAYS = [1250, 3450, 5650];

  function storageClosed() {
    try { return window.sessionStorage.getItem(CLOSED_KEY) === 'true'; }
    catch (_) { return false; }
  }
  function persistClosed() {
    try { window.sessionStorage.setItem(CLOSED_KEY, 'true'); } catch (_) { /* storage pode estar bloqueado em file:// */ }
  }

  function init() {
    const hud = document.getElementById('hudPremium');
    if (!hud || hud.dataset.initialized === 'true') return;

    const sourceCards = Array.from(document.querySelectorAll('.front-card.front-card-premium'));
    if (!sourceCards.length || storageClosed()) { hud.remove(); return; }

    const elements = {
      close: document.getElementById('hudPremiumClose'),
      card: document.getElementById('hudPremiumCard'),
      category: document.getElementById('hudPremiumCategory'),
      title: document.getElementById('hudPremiumTitle'),
      description: document.getElementById('hudPremiumDescription'),
      tags: document.getElementById('hudPremiumTags'),
      dots: document.getElementById('hudPremiumDots')
    };
    if (Object.values(elements).some((element) => !element)) return;

    const items = sourceCards.map((source) => ({
      category: source.querySelector('small')?.textContent.trim() || 'Frente RETEAR',
      title: source.querySelector('h4')?.textContent.replace(/\s+/g, ' ').trim() || 'Conheça a RETEAR',
      description: source.querySelector('p')?.textContent.trim() || '',
      tags: Array.from(source.querySelectorAll('.front-tags span')).map((tag) => tag.textContent.trim()).filter(Boolean),
      href: source.getAttribute('href') || '',
      target: source.getAttribute('target') || '',
      rel: source.getAttribute('rel') || ''
    }));

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

    // Três HUDs fixos: cada satélite troca apenas seu SVG, em cadência própria.
    // A levitação é exclusivamente CSS e nunca há rotação orbital.
    const satellites = Array.from(hud.querySelectorAll('.hud-premium__satellite'));
    const satelliteTimers = [];
    function chooseIcon(slot) {
      const occupied = new Set(satellites
        .filter((node) => node !== slot)
        .map((node) => node.dataset.icon)
        .filter(Boolean));
      const previous = slot.dataset.icon;
      let options = ICONS.filter((name) => name !== previous && !occupied.has(name));
      if (!options.length) options = ICONS.filter((name) => name !== previous);
      return options[Math.floor(Math.random() * options.length)];
    }
    function swapSatellite(slot) {
      const icon = chooseIcon(slot);
      const image = slot.querySelector('img');
      if (!image) return;
      slot.classList.add('is-swapping');
      window.setTimeout(() => {
        image.src = `assets/icon/${icon}.svg`;
        slot.dataset.icon = icon;
        window.requestAnimationFrame(() => slot.classList.remove('is-swapping'));
      }, 390);
    }
    if (!reduceMotion) satellites.forEach((slot, index) => {
      const image = slot.querySelector('img');
      const initial = image?.getAttribute('src')?.match(/([^/]+)\.svg$/)?.[1];
      if (initial) slot.dataset.icon = initial;
      const start = window.setTimeout(() => {
        swapSatellite(slot);
        const timer = window.setInterval(() => swapSatellite(slot), SATELLITE_INTERVALS[index] || 6100);
        satelliteTimers.push(timer);
      }, SATELLITE_START_DELAYS[index] || 2000);
      satelliteTimers.push(start);
    });

    let current = 0;
    let rotation = null;
    let paused = false;

    function render(index, animate = true) {
      current = (index + items.length) % items.length;
      const item = items[current];
      elements.category.textContent = item.category;
      elements.title.textContent = item.title;
      elements.description.textContent = item.description;
      elements.tags.replaceChildren();
      item.tags.forEach((tagText) => {
        const tag = document.createElement('span');
        tag.textContent = tagText;
        elements.tags.appendChild(tag);
      });

      if (item.href) {
        elements.card.href = item.href;
        if (item.target) elements.card.target = item.target;
        else elements.card.removeAttribute('target');
        if (item.rel) elements.card.rel = item.rel;
        else elements.card.removeAttribute('rel');
        elements.card.setAttribute('aria-label', `${item.title}. Conhecer frente.`);
      } else {
        elements.card.removeAttribute('href');
        elements.card.removeAttribute('target');
        elements.card.removeAttribute('rel');
        elements.card.setAttribute('aria-label', `${item.title}.`);
      }

      Array.from(elements.dots.children).forEach((dot, i) => {
        dot.setAttribute('aria-current', i === current ? 'true' : 'false');
        dot.setAttribute('aria-label', `Exibir destaque ${i + 1}: ${items[i].title}`);
      });

      if (animate && !reduceMotion) {
        hud.classList.remove('is-changing');
        void elements.card.offsetWidth;
        hud.classList.add('is-changing');
      }
    }

    function stopRotation() {
      if (rotation !== null) window.clearInterval(rotation);
      rotation = null;
    }
    function startRotation() {
      stopRotation();
      if (items.length < 2 || paused || reduceMotion || document.hidden) return;
      rotation = window.setInterval(() => render(current + 1), ROTATION_MS);
    }
    function move(step) { render(current + step); startRotation(); }

    items.forEach((item, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hud-premium__dot';
      dot.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); render(index); startRotation(); });
      elements.dots.appendChild(dot);
    });

    elements.close.addEventListener('click', (event) => {
      event.preventDefault(); event.stopPropagation();
      stopRotation(); satelliteTimers.forEach((timer) => { window.clearTimeout(timer); window.clearInterval(timer); }); persistClosed(); hud.classList.add('is-closing');
      window.setTimeout(() => hud.remove(), 380);
    });
    hud.addEventListener('mouseenter', () => { paused = true; stopRotation(); });
    hud.addEventListener('mouseleave', () => { paused = false; startRotation(); });
    hud.addEventListener('focusin', () => { paused = true; stopRotation(); });
    hud.addEventListener('focusout', (event) => {
      if (!hud.contains(event.relatedTarget)) { paused = false; startRotation(); }
    });
    document.addEventListener('visibilitychange', () => document.hidden ? stopRotation() : startRotation());

    hud.dataset.initialized = 'true';
    render(0, false);
    startRotation();
  }

  window.RetearHudPremium = { init };
})();
