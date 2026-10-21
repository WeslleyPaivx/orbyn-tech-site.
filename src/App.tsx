import { useCallback, useState } from 'react';
import { FloatingButtons } from './components/layout/FloatingButtons';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { Differentials } from './components/sections/Differentials';
import { Faq } from './components/sections/Faq';
import { Hero } from './components/sections/Hero';
import { Portfolio } from './components/sections/Portfolio';
import { Process } from './components/sections/Process';
import { Services } from './components/sections/Services';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const onMenuChange = useCallback((open: boolean) => setMenuOpen(open), []);

  return (
    <>
      <Header onMenuChange={onMenuChange} />
      <main id="conteudo">
        <Hero />
        <Services />
        <Portfolio />
        <Differentials />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons hidden={menuOpen} />
    </>
  );
}
