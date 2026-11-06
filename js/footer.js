/* RETEAR® — carregador único do footer institucional */
(() => {
  const script = document.currentScript;
  if (!script) return;
  const projectRoot = new URL('../', script.src);
  const footerUrl = new URL('footer.html', projectRoot);
  const mount = document.querySelector('[data-retear-footer]');
  if (!mount || mount.dataset.loaded === 'true') return;
  mount.dataset.loaded = 'loading';

  fetch(footerUrl.href, { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(markup => {
      mount.innerHTML = markup.replaceAll('{{ROOT}}', projectRoot.pathname);
      mount.dataset.loaded = 'true';
      const year = String(new Date().getFullYear());
      mount.querySelectorAll('[data-retear-year]').forEach(node => { node.textContent = year; });
    })
    .catch(error => {
      mount.dataset.loaded = 'error';
      console.error('RETEAR®: não foi possível carregar footer.html.', error);
    });
})();
