/* OURELA-IA · microinterações e rastreabilidade da edição */
(() => {
  const root = document.querySelector('.ourela-manual');
  if (!root) return;

  const revealItems = root.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // A página manual possui identificação de edição própria, sem alterar o footer compartilhado.
  const version = 'V001.15 11.26';
  const applyVersion = () => {
    const footerLine = root.querySelector('.retear-footer__bottom p');
    if (footerLine && !footerLine.textContent.includes(version)) footerLine.innerHTML = `© <span data-retear-year>${new Date().getFullYear()}</span> RETEAR® — Todos os direitos reservados. — ${version}`;
  };
  applyVersion();
  const footerMount = root.querySelector('[data-retear-footer]');
  if (footerMount && 'MutationObserver' in window) {
    new MutationObserver(applyVersion).observe(footerMount, { childList: true, subtree: true });
  }

  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-menu');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const expanded = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!expanded));
      menu.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('active', !expanded);
    });
  }
})();
