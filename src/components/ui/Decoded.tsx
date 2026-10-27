import { useEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView';

/**
 * Texto que se revela a partir de glifos aleatórios.
 *
 * Adaptado do ARTEFAKT. Pontos que não são enfeite:
 *
 *  - A resolução corre da esquerda para a direita, um passo por vez, e a taxa
 *    NUNCA muda: um rótulo longo resolve vários caracteres por passo em vez de
 *    demorar mais. É isso que faz rótulos de tamanhos diferentes parecerem um
 *    efeito só, e não três animações sem relação.
 *  - Espaços ficam parados. Assim as formas das palavras e os pontos de quebra
 *    são idênticos em todos os passos, e a linha não dança enquanto resolve.
 *  - ACESSIBILIDADE, e aqui não é opcional: os glifos embaralhados vão num
 *    span aria-hidden e o texto real fica num irmão visualmente oculto. Um
 *    leitor de tela nunca pode receber "X#@%R". Sob movimento reduzido o
 *    efeito não acontece — glifos mutando rápido são exatamente o que essa
 *    preferência existe para evitar.
 */

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';
const STEP_MS = 40;
const MAX_STEPS = 22;

const randomGlyph = () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

type DecodedProps = {
  text: string;
  className?: string;
  /** Embaralha de novo ao passar o ponteiro ou focar. */
  replayOnHover?: boolean;
};

export function Decoded({ text, className = '', replayOnHover = true }: DecodedProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const arrived = useInView(ref);
  const [display, setDisplay] = useState(text);
  const timer = useRef<number>(0);
  const played = useRef(false);

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const run = () => {
    if (reduced) return;
    window.clearInterval(timer.current);

    const charsPerStep = Math.max(1, Math.ceil(text.length / MAX_STEPS));
    let resolved = 0;

    timer.current = window.setInterval(() => {
      resolved += charsPerStep;
      if (resolved >= text.length) {
        window.clearInterval(timer.current);
        setDisplay(text);
        return;
      }
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (i < resolved || char === ' ') out += char;
        else out += randomGlyph();
      }
      setDisplay(out);
    }, STEP_MS);
  };

  // Uma vez na chegada.
  useEffect(() => {
    if (!arrived || played.current) return;
    played.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrived]);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const replay = replayOnHover && !reduced ? run : undefined;

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={replay}
      onFocus={replay}
    >
      {/* Os glifos que churn: invisíveis para a tecnologia assistiva. */}
      <span aria-hidden="true">{display}</span>
      {/* O nome acessível, estável enquanto o visível se mexe. */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
