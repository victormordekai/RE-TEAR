/* ========================================
   LOAD CAMPAIGN MODULE
======================================== */

async function loadFloatingCampaign() {

  try {

    const response = await fetch('modules/nr1-popup.html');
    const html = await response.text();

    const root = document.getElementById('floating-campaign-root');

    root.innerHTML = html;

    // GARANTE QUE O DOM FOI INJETADO ANTES DO JS
    requestAnimationFrame(() => {

      const script = document.createElement('script');
      script.src = 'modules/nr1-popup.js';

      script.onload = () => {

        if (window.RetearPopup?.init) {
          window.RetearPopup.init();
        }

      };

      document.body.appendChild(script);

    });

  } catch (error) {
    console.error('Erro ao carregar campanha:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadFloatingCampaign);