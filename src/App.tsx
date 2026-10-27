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
import { Manifesto } from './components/sections/Manifesto';
import { Portfolio } from './components/sections/Portfolio';
import { PresencaGoogle } from './components/sections/PresencaGoogle';
import { Process } from './components/sections/Process';
import { Solucoes } from './components/sections/Solucoes';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const onMenuChange = useCallback((open: boolean) => setMenuOpen(open), []);
  const onSceneMode = useCallback(() => {}, []);

  return (
    <>
      <SceneLayer onModeChange={onSceneMode} />
      <Header onMenuChange={onMenuChange} />
      <main id="conteudo" className="relative z-[1]">
        {/* A ordem segue as seções 01 a 08 do briefing. */}
        <Hero />
        <Manifesto />
        <Solucoes />
        <Portfolio />
        <PresencaGoogle />
        <Process />
        <About />
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
