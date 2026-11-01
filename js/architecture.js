/* ========================================
   ARQUITETURA OPERACIONAL — RETEAR®
   Acordeões independentes por grupo, com
   apenas um painel aberto em cada conjunto.
========================================= */

document.querySelectorAll('[data-accordion-group]').forEach((group) => {
  const panels = group.querySelectorAll('details');

  panels.forEach((panel) => {
    panel.addEventListener('toggle', () => {
      if (!panel.open) return;

      panels.forEach((otherPanel) => {
        if (otherPanel !== panel) otherPanel.open = false;
      });
    });
  });
});

/* Menu mobile: mantém o estado acessível no botão. */
const menuButton = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-menu');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    menuButton.setAttribute(
      'aria-expanded',
      menu.classList.contains('active') ? 'true' : 'false'
    );
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}
