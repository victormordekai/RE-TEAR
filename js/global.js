/* ========================================
   GLOBAL.JS — RETEAR®
   Infraestrutura global compartilhada
========================================= */

/* ========================================
   NAVBAR + MENU MOBILE
========================================= */

const navbar =
document.getElementById('navbar');

const menuToggle =
document.getElementById('menu-toggle');

const navMenu =
document.getElementById('nav-menu');

let lastScroll = 0;

/* ========================================
   TOGGLE MENU
========================================= */

if (menuToggle && navMenu) {

  menuToggle.addEventListener('click', (e) => {

    e.stopPropagation();

    navMenu.classList.toggle('active');

  });

}

/* ========================================
   FECHAR MENU AO CLICAR FORA
========================================= */

document.addEventListener('click', (e) => {

  if (!navMenu || !menuToggle) return;

  const clickedOutside =
    !navMenu.contains(e.target) &&
    !menuToggle.contains(e.target);

  if (clickedOutside) {

    navMenu.classList.remove('active');

  }

});

/* ========================================
   NAVBAR HIDE ON SCROLL
========================================= */

window.addEventListener('scroll', () => {

  const currentScroll =
  window.pageYOffset;

  /* FECHA MENU MOBILE */

  if (navMenu) {

    navMenu.classList.remove('active');

  }

  /* CONTROLE NAVBAR */

  if (navbar) {

    if (
      currentScroll > lastScroll &&
      currentScroll > 120
    ) {

      navbar.classList.add('hide');

    } else {

      navbar.classList.remove('hide');

    }

  }

  lastScroll = currentScroll;

});

/* ========================================
   HERO INTERACTIVE GRADIENT
========================================= */

const orb =
document.getElementById('orb');

const wave =
document.getElementById('wave');

if (orb && wave) {

  window.addEventListener('mousemove', (e) => {

    const x =
    (e.clientX / window.innerWidth - .5) * 60;

    const y =
    (e.clientY / window.innerHeight - .5) * 60;

    orb.style.transform =
    `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

    const waveOffset =
    (e.clientX / window.innerWidth - .5) * 8;

    wave.style.transform =
    `translateY(${Math.abs(y) * .08}px) skewX(${waveOffset}deg)`;

  });

}

/* ========================================
   INTERSECTION OBSERVER
========================================= */

const observer =
new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add('active');

    }

  });

}, {
  threshold: 0.12
});

document
.querySelectorAll('.fade-up, .scale-in')
.forEach((el) => {

  observer.observe(el);

});

/* ========================================
   HUD PREMIUM — COMPONENTE GLOBAL COMPARTILHADO
   Resolve a raiz do projeto a partir do próprio global.js,
   carrega o CSS antes do módulo e funciona em páginas internas.
========================================= */
(function loadRetearHudPremiumGlobal() {
  const currentScript = document.currentScript;
  const scriptUrl = currentScript?.src || new URL('js/global.js', window.location.href).href;
  const siteRoot = new URL('../', scriptUrl);
  const cssUrl = new URL('css/hud-premium.css', siteRoot).href;
  const moduleUrl = new URL('modules/hud-premium.js', siteRoot).href;

  function loadModule() {
    if (window.RetearHudPremium) {
      window.RetearHudPremium.init();
      return;
    }
    if (document.querySelector('script[data-retear-hud-premium]')) return;
    const moduleScript = document.createElement('script');
    moduleScript.src = moduleUrl;
    moduleScript.dataset.retearHudPremium = 'true';
    moduleScript.onload = () => window.RetearHudPremium?.init();
    moduleScript.onerror = () => console.error('RETEAR®: falha ao carregar o componente global HUD Premium.', moduleUrl);
    document.body.appendChild(moduleScript);
  }

  const stylesheetExists = Array.from(document.querySelectorAll('link[rel="stylesheet"][href]'))
    .some((link) => {
      try { return new URL(link.href, document.baseURI).href === cssUrl; }
      catch (_) { return false; }
    });

  if (stylesheetExists) {
    loadModule();
  } else {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = cssUrl;
    stylesheet.onload = loadModule;
    stylesheet.onerror = () => {
      console.error('RETEAR®: falha ao carregar o CSS do HUD Premium.', cssUrl);
      loadModule();
    };
    document.head.appendChild(stylesheet);
  }
})();
