const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {

  question.addEventListener('click', () => {

    const answer = question.nextElementSibling;

    if(answer.style.maxHeight) {
      answer.style.maxHeight = null;
    } else {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }

  });

});

/* ========================================= */
/* HERO CAROUSEL                             */
/* ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  const heroImages = document.querySelectorAll('.hero-image');

  if (!heroImages.length) return;

  let currentHero = 0;

  /*
    Garante estado inicial
  */
  heroImages[currentHero].classList.add('active');

  function showNextHeroImage() {

    heroImages[currentHero].classList.remove('active');

    currentHero++;

    if (currentHero >= heroImages.length) {
      currentHero = 0;
    }

    heroImages[currentHero].classList.add('active');

  }

  /*
    Troca automática
  */
  if (heroImages.length > 1) {

    setInterval(showNextHeroImage, 6000);

  }

});

/* ========================================= */
/* NAVBAR RESPONSIVE                         */
/* ========================================= */

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();

  navMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) &&
      !menuToggle.contains(e.target)) {

    navMenu.classList.remove('active');
  }
});

window.addEventListener('scroll', () => {
  navMenu.classList.remove('active');
});

document.querySelectorAll('.nav-menu a')
  .forEach(link => {

    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });

});

/* ========================================= */
/* TESTIMONIAL ROTATION                      */
/* ========================================= */

const testimonials = [

  {
    text:
      '“A experiência vai além do produto. Existe cuidado em cada detalhe.”',

    author:
      'Cliente Meu Petit Bolinho®'
  },

  {
    text:
      '“Os sabores conseguiram transformar a festa em uma memória ainda mais especial.”',

    author:
      'Cliente Meu Petit Bolinho®'
  },

  {
    text:
      '“Tudo transmitia delicadeza, desde a apresentação até o atendimento.”',

    author:
      'Cliente Meu Petit Bolinho®'
  },

  {
    text:
      '“Foi impossível não perceber o carinho colocado em cada detalhe.”',

    author:
      'Cliente Meu Petit Bolinho®'
  },

  {
    text:
      '“Uma confeitaria que realmente consegue transformar momentos em lembranças.”',

    author:
      'Cliente Meu Petit Bolinho®'
  }

];

const testimonialText =
  document.getElementById('testimonialText');

const testimonialAuthor =
  document.getElementById('testimonialAuthor');

let testimonialIndex = 0;

function changeTestimonial() {

  testimonialText.style.opacity = 0;
  testimonialAuthor.style.opacity = 0;

  setTimeout(() => {

    testimonialIndex++;

    if (
      testimonialIndex >= testimonials.length
    ) {
      testimonialIndex = 0;
    }

    testimonialText.innerText =
      testimonials[testimonialIndex].text;

    testimonialAuthor.innerText =
      testimonials[testimonialIndex].author;

    testimonialText.style.opacity = 1;
    testimonialAuthor.style.opacity = 1;

  }, 400);

}

setInterval(changeTestimonial, 5000);