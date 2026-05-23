/* ========================================
   LOAD CAMPAIGN MODULE
======================================== */

async function loadFloatingCampaign() {

  try {

    const response = await fetch('modules/nr1-popup.html')
  .then(res => res.text())
  .then(html => {

    document.getElementById('floating-campaign-root')
      .innerHTML = html;

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

