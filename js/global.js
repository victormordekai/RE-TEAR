 /* ========================================
     NAV
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

  menuToggle.addEventListener('click', (e) => {

    e.stopPropagation();

    navMenu.classList.toggle('active');

  });

  /* ========================================
     FECHAR AO CLICAR FORA
  ========================================= */

  document.addEventListener('click', (e) => {

    const clickedOutside =
      !navMenu.contains(e.target) &&
      !menuToggle.contains(e.target);

    if (clickedOutside) {

      navMenu.classList.remove('active');

    }

  });

  /* ========================================
     NAV HIDE + CLOSE MENU ON SCROLL
  ========================================= */

  window.addEventListener('scroll', () => {

    const currentScroll =
    window.pageYOffset;

    /* ESCONDE MENU MOBILE */

    navMenu.classList.remove('active');

    /* ESCONDE NAVBAR */

    if (
      currentScroll > lastScroll &&
      currentScroll > 120
    ) {

      navbar.classList.add('hide');

    } else {

      navbar.classList.remove('hide');

    }

    lastScroll = currentScroll;

  });

  /* ========================================
     HERO GRADIENT
  ========================================= */

  const orb =
  document.getElementById('orb');

  const wave =
  document.getElementById('wave');

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

	/* ========================================
	   OPEN POPUP MODULE
	======================================== */

	fetch('/RE-TEAR/modules/nr1-popup.html')

	  .then(response => response.text())

	  .then(data => {

		document.getElementById(
		  'floating-campaign-root'
		).innerHTML = data;

		const script =
		document.createElement('script');

		script.src =
		'/RE-TEAR/modules/nr1-popup.js';

		document.body.appendChild(script);

	  })

	  .catch(error => {

		console.error(
		  'Erro ao carregar popup:',
		  error
		);

	  });