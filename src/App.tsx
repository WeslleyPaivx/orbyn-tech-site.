import { useCallback, useState } from 'react';
import { FloatingButtons } from './components/layout/FloatingButtons';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { SceneLayer, type SceneMode } from './components/scene/SceneLayer';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { Differentials } from './components/sections/Differentials';
import { Faq } from './components/sections/Faq';
import { FinalCta } from './components/sections/FinalCta';
import { Hero } from './components/sections/Hero';
import { Portfolio } from './components/sections/Portfolio';
import { Process } from './components/sections/Process';
import { Services } from './components/sections/Services';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sceneMode, setSceneMode] = useState<SceneMode>('loading');
  const onMenuChange = useCallback((open: boolean) => setMenuOpen(open), []);
  const onSceneMode = useCallback((mode: SceneMode) => setSceneMode(mode), []);

  return (
    <>
      <SceneLayer onModeChange={onSceneMode} />
      <Header onMenuChange={onMenuChange} />
      <main id="conteudo" className="relative z-[1]">
        <Hero fallback={sceneMode === 'fallback'} />
        <Services />
        <Portfolio />
        <About />
        <Differentials />
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
