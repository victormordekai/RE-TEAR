/* RETEAR · filtros das Frentes (index) · V001.15
   Destaca as Frentes do foco escolhido e esmaece as demais; nada é ocultado. */
(() => {
  'use strict';
  const bar = document.querySelector('[data-fronts-filter]');
  const cards = document.querySelectorAll('.fronts-grid .front-card[data-focus]');
  if (!bar || !cards.length) return;
  bar.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-focus]');
    if (!button) return;
    const focus = button.dataset.focus;
    bar.querySelectorAll('button[data-focus]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    cards.forEach((card) => {
      const match = focus === 'todas' || card.dataset.focus.split(' ').includes(focus);
      card.classList.toggle('is-dim', !match);
    });
  });
})();
