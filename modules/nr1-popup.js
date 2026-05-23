(function () {

  function getPopup() {
    return document.getElementById('campaignFloatingSystem');
  }

  function open() {
    const popup = getPopup();
    if (!popup) return;

    popup.classList.add('active');
  }

  function close() {
    const popup = getPopup();
    if (!popup) return;

    popup.classList.add('hidden');

    sessionStorage.setItem('nr1-popup-closed', 'true');
  }

  function init() {
    const popup = getPopup();
    if (!popup) return;

    // evita reabrir se usuário já fechou
    if (sessionStorage.getItem('nr1-popup-closed')) return;

    setTimeout(() => {
      open();
    }, 300);
  }

  window.RetearPopup = {
    open,
    close,
    init
  };

})();