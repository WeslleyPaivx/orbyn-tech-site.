import { useCallback, useState } from 'react';
import { FloatingButtons } from './components/layout/FloatingButtons';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { SceneLayer } from './components/scene/SceneLayer';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { Faq } from './components/sections/Faq';
import { FinalCta } from './components/sections/FinalCta';
import { Hero } from './components/sections/Hero';
import { Portfolio } from './components/sections/Portfolio';
import { Process } from './components/sections/Process';
import { Services } from './components/sections/Services';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const onMenuChange = useCallback((open: boolean) => setMenuOpen(open), []);

  // A escultura herdada da Orbyn segue no ar só para o site não ficar sem
  // fundo entre uma etapa e outra; ela sai quando a cena de partículas da
  // Zaniva entrar no lugar (etapa 5).
  const onSceneMode = useCallback(() => {}, []);

  return (
    <>
      <SceneLayer onModeChange={onSceneMode} />
      <Header onMenuChange={onMenuChange} />
      <main id="conteudo" className="relative z-[1]">
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Process />
        <Faq />
        <FinalCta />
        <Contact />
      </main>
      <div className="relative z-[1]">
        <Footer />
      </div>
      <FloatingButtons hidden={menuOpen} />
    </>
  );
}
