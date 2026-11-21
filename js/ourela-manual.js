/* OURELA-IA · navegação entre seções e microinterações
   A navegação global/menu mobile permanece sob responsabilidade de global.js. */
(() => {
  'use strict';

  const page = document.querySelector('.ourela-manual');
  if (!page || page.dataset.ourelaNavigationReady === 'true') return;
  page.dataset.ourelaNavigationReady = 'true';

  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('nav-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const getOffset = () => {
    // Navbar é fixed no desktop e mobile; reserva uma margem pequena adicional.
    return (navbar?.getBoundingClientRect().height || 0) + 18;
  };

  const scrollToTarget = (target, updateHash = true) => {
    if (!target) return;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - getOffset());
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });

    if (updateHash && target.id) {
      history.replaceState(null, '', `#${encodeURIComponent(target.id)}`);
    }

    // A seção recebe foco programático sem inserir parada extra na navegação por Tab.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    window.setTimeout(() => target.focus({ preventScroll: true }), reduceMotion ? 0 : 350);

    // Fecha o menu usando o mesmo estado controlado pelo global.js.
    if (navMenu?.classList.contains('active')) {
      navMenu.classList.remove('active');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Abrir menu');
    }
  };

  // Intercepta somente âncoras internas desta página; links externos e outras rotas ficam intactos.
  page.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="#"]');
    if (!link || link.target === '_blank' || event.defaultPrevented || event.button !== 0) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;

    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { id = url.hash.slice(1); }
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(target, true);
  });

  // Acesso direto por URL com hash, inclusive após carregamento de fontes/imagens.
  const restoreHashPosition = () => {
    if (!location.hash) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = location.hash.slice(1); }
    const target = document.getElementById(id);
    if (target) scrollToTarget(target, false);
  };
  window.addEventListener('load', () => window.setTimeout(restoreHashPosition, 80), { once: true });
  window.addEventListener('hashchange', restoreHashPosition);

  // Revelação progressiva sem ocultar conteúdo caso o observador falhe.
  const revealItems = [...page.querySelectorAll('.reveal')];
  if (!reduceMotion && 'IntersectionObserver' in window && revealItems.length) {
    try {
      const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
          }
        });
      }, { threshold: 0.04, rootMargin: '0px 0px 100px 0px' });
      revealItems.forEach(item => observer.observe(item));
      page.classList.add('reveal-enabled');
      window.setTimeout(() => revealItems.forEach(item => {
        if (item.getBoundingClientRect().top < window.innerHeight + 180) item.classList.add('is-visible');
      }), 700);
    } catch {
      revealItems.forEach(item => item.classList.add('is-visible'));
    }
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Mantém o footer desta página rastreável sem interferir no componente global.
  const version = 'V001.17 11.26';
  const updateFooterVersion = () => {
    const footerLine = page.querySelector('.retear-footer__bottom p');
    if (footerLine && !footerLine.textContent.includes(version)) {
      footerLine.textContent = `© ${new Date().getFullYear()} RETEAR® — Todos os direitos reservados. — ${version}`;
    }
  };
  updateFooterVersion();
  const footer = page.querySelector('[data-retear-footer]');
  if (footer && 'MutationObserver' in window) {
    new MutationObserver(updateFooterVersion).observe(footer, { childList: true, subtree: true });
  }
})();
