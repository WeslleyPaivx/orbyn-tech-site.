import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Fontes servidas pelo próprio site (sem Google Fonts: mais privacidade e CSP mais rígida).
// Inter para texto corrido, Space Grotesk para a tipografia expressiva da marca.
// Fontes servidas pelo próprio site (sem Google Fonts: mais privacidade e CSP
// mais rígida). Inter para texto corrido, Space Grotesk para a marca.
//
// PENDÊNCIA DE PERFORMANCE: estes dois pontos de entrada embalam cirílico,
// grego e latin-ext junto — cerca de 280 kB de fonte que nenhum caractere de
// uma página em português usa. Restringir ao latino vale a pena, mas nem
// `latin.css` nem `latin-opsz.css` existem neste pacote, e sem acesso ao
// registro do npm nesta sessão não dá para listar os arquivos reais e
// confirmar o nome certo. Fica assim, que funciona, em vez de um palpite que
// quebra o build. Para resolver:
//     ls node_modules/@fontsource-variable/inter/
import '@fontsource-variable/inter/opsz.css';
import '@fontsource-variable/space-grotesk';
import './index.css';
import { startPreloader } from './motion/preloader';

// A folha de estilo chega com media="print" para não segurar a primeira tela
// (ver asyncCss em vite.config.ts); aqui ela passa a valer. Até este ponto, o
// que aparece é só a cortina, desenhada pelo CSS crítico embutido no HTML.
document.querySelectorAll<HTMLLinkElement>('link[data-async-css]').forEach((link) => {
  link.media = 'all';
});

// Antes de montar o React: a cortina já está no HTML e precisa começar a
// contar desde o primeiro quadro.
startPreloader();

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado em index.html');

// O #root já vem preenchido pela pré-renderização (para robôs e prévias de
// link). createRoot, e não hydrateRoot, de propósito: o React substitui esse
// HTML e monta a página exatamente como antes. Hidratar herdaria os atributos
// style="" do HTML estático, que a CSP (style-src 'self') bloqueia.
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
