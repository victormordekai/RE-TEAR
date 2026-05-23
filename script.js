/* ========================================
   LOAD CAMPAIGN MODULE
======================================== */

async function loadFloatingCampaign(){

  try{

    const response =
    await fetch('modules/nr1-popup.html');

    const html =
    await response.text();

    document
      .getElementById('floating-campaign-root')
      .innerHTML = html;

    const css =
    document.createElement('link');

    css.rel = 'stylesheet';
    css.href = 'modules/nr1-popup.css';

    document.head.appendChild(css);

    const script =
    document.createElement('script');

    script.src = 'modules/nr1-popup.js';

    document.body.appendChild(script);

  }catch(error){

    console.error(
      'Erro ao carregar campanha:',
      error
    );

  }
}

loadFloatingCampaign();