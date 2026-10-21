import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Fonte Inter servida pelo próprio site (sem Google Fonts: mais privacidade e CSP mais rígida)
import '@fontsource-variable/inter/opsz.css';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado em index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
