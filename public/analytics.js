/**
 * Medição do site: Google Analytics 4.
 *
 * Fica num arquivo do próprio site, e não num <script> embutido no HTML,
 * porque a CSP (script-src 'self') bloqueia script embutido. Carrega com async:
 * não segura a primeira tela.
 *
 * - page_view: enviado pelo gtag('config') ao abrir cada página. O site não
 *   tem rotas no navegador (a navegação é por âncoras), então não há troca de
 *   página para medir além dessa.
 * - generate_lead: no clique de qualquer link do WhatsApp (wa.me ou
 *   api.whatsapp.com), inclusive os que o React cria depois. O clique é ouvido
 *   no documento inteiro, então botão novo já entra sem mexer aqui.
 */
(function () {
  var GA_ID = 'G-DDXLQYQTZC';

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  var WHATSAPP = /^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i;

  document.addEventListener(
    'click',
    function (event) {
      var target = event.target;
      var link = target && target.closest ? target.closest('a[href]') : null;
      if (!link || !WHATSAPP.test(link.href)) return;

      gtag('event', 'generate_lead', {
        method: 'whatsapp',
        link_text: (link.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100),
        link_section: (link.closest('section[id], footer') || {}).id || 'rodape',
      });
    },
    true,
  );
})();
