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
   HUD PREMIUM — COMPATÍVEL COM FILE:// E HTTP(S)
   O HTML é incorporado diretamente nas páginas para
   evitar fetch(), bloqueado por navegadores em arquivo local.
========================================= */
(function loadRetearHudPremium() {
  const hud = document.getElementById('hudPremium');
  if (!hud || hud.dataset.scriptRequested === 'true') return;
  hud.dataset.scriptRequested = 'true';

  if (window.RetearHudPremium) {
    window.RetearHudPremium.init();
    return;
  }

  const script = document.createElement('script');
  script.src = 'modules/hud-premium.js';
  script.onload = () => window.RetearHudPremium?.init();
  script.onerror = () => {
    console.error('Não foi possível carregar modules/hud-premium.js');
    hud.dataset.scriptRequested = 'false';
  };
  document.body.appendChild(script);
})();
