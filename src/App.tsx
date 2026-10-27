import { useEffect } from 'react';
import { Footer } from './components/layout/Footer';
import { About } from './components/sections/About';
import { Contato } from './components/sections/Contato';
import { Hero } from './components/sections/Hero';
import { Manifesto } from './components/sections/Manifesto';
import { Portfolio } from './components/sections/Portfolio';
import { PresencaGoogle } from './components/sections/PresencaGoogle';
import { Process } from './components/sections/Process';
import { Solucoes } from './components/sections/Solucoes';
import { startCursorGlow } from './motion/cursorGlow';

/**
 * As oito seções da montagem aprovada, uma abaixo da outra.
 *
 * Não existe mais camada 3D global atrás da página: a única cena WebGL é a
 * orbe do manifesto, contida na própria seção. Era a camada global que fazia
 * a nuvem disputar contraste com cada parágrafo do site.
 */
export default function App() {
  useEffect(() => startCursorGlow(), []);

  return (
    <>
      <a href="#conteudo" className="sr-only">
        Pular para o conteúdo
      </a>
      <div className="cursor-glow" id="cursor-glow" aria-hidden="true" />

      <main id="conteudo">
        <Hero />
        <Manifesto />
        <Solucoes />
        <Portfolio />
        <PresencaGoogle />
        <Process />
        <About />
        <Contato />
      </main>

      <Footer />
    </>
  );
}
