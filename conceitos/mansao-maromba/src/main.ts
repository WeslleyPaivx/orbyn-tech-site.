import './styles/base.css';
import './styles/intro-header.css';
import './styles/dive.css';
import './styles/sections.css';
import './styles/modes-gallery.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupFinal, setupManifesto, setupReveals } from './components/brandSections';
import { setupModes } from './components/experienceModes';
import { setupIntro } from './components/introSequence';
import { setupDive } from './components/productDive';
import { setupGallery } from './components/productGallery';
import { setupHeader } from './components/siteHeader';
import { setupZero } from './components/zeroShowcase';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

async function init() {
  // A abertura roda enquanto os quadros do mergulho começam a baixar
  const intro = setupIntro();
  setupHeader();
  const divePromise = setupDive();
  setupZero();
  setupModes();
  setupGallery();
  setupManifesto();
  setupFinal();
  setupReveals();

  try {
    await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1800))]);
  } catch {
    /* segue com a fonte de reserva */
  }
  ScrollTrigger.refresh();

  await intro;
  document.documentElement.classList.add('is-ready');
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  const dive = await divePromise;
  window.addEventListener('load', () => ScrollTrigger.refresh());
  (window as unknown as { __mm: unknown }).__mm = { dive, ScrollTrigger };
}

init();
