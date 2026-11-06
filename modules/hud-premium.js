/* =====================================================
   RETEAR® — HUD ORBITAL PREMIUM GLOBAL
   Um único componente compartilhado por todas as páginas.
   Reabre a cada navegação/abertura; o fechamento vale apenas
   para a visualização atual e não é persistido em storage.
===================================================== */
(function () {
  'use strict';

  const scriptUrl = document.currentScript?.src || new URL('modules/hud-premium.js', window.location.href).href;
  const siteRoot = new URL('../', scriptUrl);
  const assetBase = new URL('assets/icon/', siteRoot).href;
  const indexUrl = new URL('index.html', siteRoot).href;
  const ROTATION_MS = 7000;
  const ICONS = ['brain', 'chart-pie', 'dashboard', 'guard', 'kpi', 'puzzle', 'strategy', 'target', 'tree'];
  const SATELLITE_INTERVALS = [4700, 6300, 7900];
  const SATELLITE_START_DELAYS = [1250, 3450, 5650];

  const FALLBACK_ITEMS = [
    {
      category: 'Frente estrutural de Transformação',
      title: 'JACQUARD',
      description: 'Estrutura os mecanismos que convertem recursos em entregas através de planejamento, execução, produtividade, qualidade e controle operacional.',
      tags: ['Produção', 'Qualidade', 'Indicadores'],
      href: 'https://wa.me/5541997584893?text=Ol%C3%A1%21%20Gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20com%20a%20RETEAR%C2%AE%20e%20conhecer%20melhor%20as%20solu%C3%A7%C3%B5es%20para%20minha%20opera%C3%A7%C3%A3o.',
      target: '_blank', rel: 'noopener noreferrer'
    },
    {
      category: 'Frente estrutural de Materialização',
      title: 'GABARDINE',
      description: 'Estrutura a manifestação institucional da organização através de branding, experiência digital, interfaces e desenvolvimento visual-tecnológico.',
      tags: ['Branding', 'UX/UI', 'Creative-tech'],
      href: 'frentes/gabardine.html', target: '_blank', rel: 'noopener noreferrer'
    },
    {
      category: 'Frente estrutural de Conexão Produtiva',
      title: 'FEITURA',
      description: 'Conecta demanda produtiva e capacidade produtiva, estruturando pessoas, processos, tempo e valor em uma rede orientada à realização do produto.',
      tags: ['Demanda', 'Capacidade', 'Produção'],
      href: 'https://victormordekai.github.io/FEITURA/index.html',
      target: '_blank', rel: 'noopener noreferrer'
    },
    {
      category: 'Programa temático',
      title: 'Nova NR-1 (Adequação Prática)',
      description: 'Estrutura mecanismos de gestão de riscos psicossociais, comunicação organizacional e bem-estar ocupacional em conformidade com a nova NR-1.',
      tags: ['NR-1', 'Governança', 'Qualidade de Vida'],
      href: 'campaigns/nr1.html', target: '_self', rel: ''
    }
  ];

  function normalizeHref(href) {
    if (!href) return '';
    // Links legados do GitHub Pages passam a funcionar também em ambiente local.
    const repoPrefix = '/RE-TEAR/';
    if (href.startsWith(repoPrefix)) return new URL(href.slice(repoPrefix.length), siteRoot).href;
    return new URL(href, siteRoot).href;
  }

  function createMarkup() {
    let hud = document.getElementById('hudPremium');
    if (hud) return hud;

    const wrapper = document.createElement('aside');
    wrapper.className = 'hud-premium';
    wrapper.id = 'hudPremium';
    wrapper.setAttribute('aria-label', 'Destaques do ecossistema RETEAR');
    wrapper.setAttribute('aria-roledescription', 'carrossel');
    wrapper.innerHTML = `
      <div class="hud-premium__satellites" aria-hidden="true">
        <span class="hud-premium__satellite hud-premium__satellite--1"><img src="${assetBase}brain.svg" alt=""></span>
        <span class="hud-premium__satellite hud-premium__satellite--2"><img src="${assetBase}chart-pie.svg" alt=""></span>
        <span class="hud-premium__satellite hud-premium__satellite--3"><img src="${assetBase}dashboard.svg" alt=""></span>
      </div>
      <button class="hud-premium__close" id="hudPremiumClose" type="button" aria-label="Fechar destaques">×</button>
      <a class="hud-premium__card" id="hudPremiumCard" href="#" aria-live="polite">
        <span class="hud-premium__eyebrow"><i></i> ECOSSISTEMA RETEAR</span>
        <small class="hud-premium__category" id="hudPremiumCategory"></small>
        <h3 class="hud-premium__title" id="hudPremiumTitle"></h3>
        <p class="hud-premium__description" id="hudPremiumDescription"></p>
        <div class="hud-premium__tags" id="hudPremiumTags"></div>
        <span class="hud-premium__cta">Conhecer frente <b aria-hidden="true">↗</b></span>
        <span class="hud-premium__controls" id="hudPremiumDots" aria-label="Selecionar destaque"></span>
      </a>`;
    document.body.appendChild(wrapper);
    return wrapper;
  }

  function cardsToItems(sourceCards) {
    return Array.from(sourceCards).map((source) => ({
      category: source.querySelector('small')?.textContent.trim() || 'Frente RETEAR',
      title: source.querySelector('h4')?.textContent.replace(/\s+/g, ' ').trim() || 'Conheça a RETEAR',
      description: source.querySelector('p')?.textContent.trim() || '',
      tags: Array.from(source.querySelectorAll('.front-tags span')).map((tag) => tag.textContent.trim()).filter(Boolean),
      href: normalizeHref(source.getAttribute('href') || ''),
      target: source.getAttribute('target') || '',
      rel: source.getAttribute('rel') || ''
    })).filter((item) => item.title);
  }

  function isHomePage() {
    const current = new URL(window.location.href);
    const rootPath = siteRoot.pathname.endsWith('/') ? siteRoot.pathname : `${siteRoot.pathname}/`;
    return current.pathname === rootPath || current.pathname === new URL('index.html', siteRoot).pathname;
  }

  function init() {
    if (!document.body) return;
    const hud = createMarkup();
    if (hud.dataset.initialized === 'true' || hud.dataset.initializing === 'true') return;
    hud.dataset.initializing = 'true';
    hud.dataset.assetBase = assetBase;
    hud.dataset.indexUrl = indexUrl;

    const elements = {
      close: hud.querySelector('#hudPremiumClose'),
      card: hud.querySelector('#hudPremiumCard'),
      category: hud.querySelector('#hudPremiumCategory'),
      title: hud.querySelector('#hudPremiumTitle'),
      description: hud.querySelector('#hudPremiumDescription'),
      tags: hud.querySelector('#hudPremiumTags'),
      dots: hud.querySelector('#hudPremiumDots')
    };
    if (Object.values(elements).some((element) => !element)) {
      delete hud.dataset.initializing;
      return;
    }

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
    const satellites = Array.from(hud.querySelectorAll('.hud-premium__satellite'));
    const satelliteTimers = [];
    if (hud.dataset.fixedSatellites === 'true') {
      satellites.forEach((slot) => {
        const image = slot.querySelector('img');
        const initial = image?.getAttribute('src')?.match(/([^/]+)\.svg(?:\?.*)?$/)?.[1];
        if (initial) slot.dataset.icon = initial;
      });
    } else if (!reduceMotion) {
      function chooseIcon(slot) {
        const occupied = new Set(satellites.filter((node) => node !== slot).map((node) => node.dataset.icon).filter(Boolean));
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
          image.src = `${assetBase}${icon}.svg`;
          slot.dataset.icon = icon;
          window.requestAnimationFrame(() => slot.classList.remove('is-swapping'));
        }, 390);
      }
      satellites.forEach((slot, index) => {
        const image = slot.querySelector('img');
        const initial = image?.getAttribute('src')?.match(/([^/]+)\.svg(?:\?.*)?$/)?.[1];
        if (initial) slot.dataset.icon = initial;
        const start = window.setTimeout(() => {
          swapSatellite(slot);
          const timer = window.setInterval(() => swapSatellite(slot), SATELLITE_INTERVALS[index] || 6100);
          satelliteTimers.push(timer);
        }, SATELLITE_START_DELAYS[index] || 2000);
        satelliteTimers.push(start);
      });
    }

    let items = [];
    let current = 0;
    let rotation = null;
    let paused = false;

    function render(index, animate = true) {
      if (!items.length) return;
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
        if (item.target && item.target !== '_self') elements.card.target = item.target;
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

      elements.dots.replaceChildren();
      items.forEach((dotItem, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hud-premium__dot';
        dot.setAttribute('aria-current', index === current ? 'true' : 'false');
        dot.setAttribute('aria-label', `Exibir destaque ${index + 1}: ${dotItem.title}`);
        dot.addEventListener('click', (event) => {
          event.preventDefault(); event.stopPropagation();
          render(index); startRotation();
        });
        elements.dots.appendChild(dot);
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

    function setItems(nextItems, preserveCurrent = true) {
      if (!nextItems.length) return;
      const previousTitle = items[current]?.title;
      items = nextItems;
      const matchingIndex = preserveCurrent ? items.findIndex((item) => item.title === previousTitle) : -1;
      current = matchingIndex >= 0 ? matchingIndex : 0;
      render(current, false);
      startRotation();
      hud.classList.add('is-ready');
      delete hud.dataset.initializing;
      hud.dataset.initialized = 'true';
    }

    elements.close.addEventListener('click', (event) => {
      event.preventDefault(); event.stopPropagation();
      stopRotation();
      satelliteTimers.forEach((timer) => { window.clearTimeout(timer); window.clearInterval(timer); });
      hud.classList.add('is-closing');
      window.setTimeout(() => hud.remove(), 380);
    });
    hud.addEventListener('mouseenter', () => { paused = true; stopRotation(); });
    hud.addEventListener('mouseleave', () => { paused = false; startRotation(); });
    hud.addEventListener('focusin', () => { paused = true; stopRotation(); });
    hud.addEventListener('focusout', (event) => {
      if (!hud.contains(event.relatedTarget)) { paused = false; startRotation(); }
    });
    document.addEventListener('visibilitychange', () => document.hidden ? stopRotation() : startRotation());

    // Primeiro render imediato com conteúdo local: nenhuma dependência de fetch para aparecer.
    const home = isHomePage();
    const localCards = home ? document.querySelectorAll('.front-card.front-card-premium') : [];
    const localItems = cardsToItems(localCards);
    const fallbackItems = FALLBACK_ITEMS.map((item) => ({ ...item, href: normalizeHref(item.href) }));
    setItems(localItems.length ? localItems : fallbackItems, false);

    // Nas páginas internas, sincroniza em segundo plano com os cards atuais do index.
    if (!home) {
      fetch(indexUrl, { cache: 'force-cache', credentials: 'same-origin' })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.text();
        })
        .then((html) => {
          const sourceDocument = new DOMParser().parseFromString(html, 'text/html');
          const freshItems = cardsToItems(sourceDocument.querySelectorAll('.front-card.front-card-premium'));
          if (freshItems.length) setItems(freshItems, true);
        })
        .catch((error) => console.info('HUD Premium: mantendo conteúdo local de contingência.', error));
    }
  }

  window.RetearHudPremium = { init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // O BFCache pode restaurar uma página cujo HUD foi fechado; reconstitui-o ao retornar.
  window.addEventListener('pageshow', () => {
    if (!document.getElementById('hudPremium')) init();
  });
})();
