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


// Deep links to a department open the corresponding accordion automatically.
document.addEventListener('DOMContentLoaded', () => {
  const targetId = decodeURIComponent(window.location.hash.slice(1));
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (!(target instanceof HTMLDetailsElement)) return;
  target.open = true;
  requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
});
