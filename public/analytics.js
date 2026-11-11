/**
 * Medição do site: Google Analytics 4 e Pixel da Meta.
 *
 * Fica num arquivo do próprio site, e não num <script> embutido no HTML,
 * porque a CSP (script-src 'self') bloqueia script embutido. Carrega com async:
 * não segura a primeira tela.
 *
 * - page_view: enviado pelo gtag('config') ao abrir cada página. O site não
 *   tem rotas no navegador (a navegação é por âncoras), então não há troca de
 *   página para medir além dessa.
 * - Pixel da Meta: o código base oficial, que carrega o fbevents.js com async,
 *   com o PageView ao abrir a página.
 * - No clique de qualquer link do WhatsApp (wa.me ou api.whatsapp.com),
 *   inclusive os que o React cria depois: generate_lead no Analytics e Contact
 *   no Pixel, antes de a conversa abrir. O clique é ouvido no documento
 *   inteiro (fase de captura), então botão novo já entra sem mexer aqui.
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

  // Código base do Pixel da Meta (o mesmo do Gerenciador de Eventos).
  var PIXEL_ID = '2209783362936447';
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');

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
      window.fbq('track', 'Contact');
    },
    true,
  );
})();
