import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Fontes servidas pelo próprio site (sem Google Fonts: mais privacidade e CSP mais rígida).
// Inter para texto corrido, Space Grotesk para a tipografia expressiva da marca.
// Só o subconjunto latino: o site é em português e os pacotes completos
// trazem cirílico, grego e latin-ext — cerca de 280 kB de fonte que nenhum
// caractere desta página usa.
import '@fontsource-variable/inter/latin-opsz.css';
import '@fontsource-variable/space-grotesk/latin.css';
import './index.css';
import { startPreloader } from './motion/preloader';

// Antes de montar o React: a cortina já está no HTML e precisa começar a
// contar desde o primeiro quadro.
startPreloader();

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado em index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
