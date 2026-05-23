(function () {

  function init() {

    const system = document.getElementById('campaignFloatingSystem');
    const closeButton = document.getElementById('floatingClose');

    if (!system || !closeButton) {
      console.warn('Popup ainda não está pronto');
      return;
    }

    // evita duplicar listener caso reinicialize
    closeButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      system.classList.add('hidden');

      sessionStorage.setItem('nr1-popup-closed', 'true');
    };

    // restore session
    if (sessionStorage.getItem('nr1-popup-closed')) {
      system.remove();
      return;
    }
  }

  // EXPÕE API (opcional mas recomendado)
  window.RetearPopup = {
    init
  };

  // execução segura após carregamento e DOM pronto
  window.addEventListener('load', () => {
    setTimeout(init, 300);
  });

})();