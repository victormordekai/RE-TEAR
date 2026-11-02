/* ========================================
   ARQUITETURA OPERACIONAL — RETEAR®
   Interações exclusivas dos acordeões.
   A navegação é controlada integralmente
   por js/global.js, como no index.html.
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
