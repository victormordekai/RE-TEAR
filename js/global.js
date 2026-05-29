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
   FLOATING POPUP MODULE
========================================= */

const popupRoot =
document.getElementById('floating-campaign-root');

if (popupRoot) {

  fetch('https://victormordekai.github.io/RE-TEAR/modules/nr1-popup.html')
  
    .then(response => response.text())

    .then(data => {

      popupRoot.innerHTML = data;

      const script =
      document.createElement('script');

      script.src =
      'https://victormordekai.github.io/RE-TEAR/modules/nr1-popup.js';

      document.body.appendChild(script);

    })

    .catch(error => {

      console.error(
        'Erro ao carregar popup:',
        error
      );

    });

}