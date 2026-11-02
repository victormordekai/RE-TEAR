/* RETEAR® — pequenos comportamentos progressivos do footer */
(() => {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-retear-year]').forEach((node) => { node.textContent = year; });
})();
