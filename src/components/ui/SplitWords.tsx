import { Fragment, useRef, type CSSProperties, type ElementType } from 'react';
import { useInView } from '../../hooks/useInView';

type SplitWordsProps = {
  /** Uma linha por item (quebras de linha controladas) ou um texto corrido. */
  lines: string[] | string;
  as?: ElementType;
  id?: string;
  className?: string;
  /** Classes aplicadas a cada linha (quando há várias). */
  lineClassName?: string;
  /** Atraso inicial em ms. */
  delay?: number;
  /** Anima imediatamente (sem esperar entrar na tela), como no hero. */
  immediate?: boolean;
  /** Destaca o ponto final em ciano (detalhe da identidade). */
  accentPeriod?: boolean;
};

/**
 * Título que surge palavra por palavra, subindo de uma máscara.
 * O texto continua sendo texto real (lido normalmente por leitores de tela e buscadores).
 */
export function SplitWords({
  lines,
  as: Tag = 'h2',
  id,
  className = '',
  lineClassName = '',
  delay = 0,
  immediate,
  accentPeriod,
}: SplitWordsProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0.2 });
  const visible = immediate || inView;
  const list = Array.isArray(lines) ? lines : [lines];
  let index = 0;

  return (
    <Tag
      ref={ref}
      id={id}
      className={`${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--split-delay': `${delay}ms` } as CSSProperties}
    >
      {list.map((line, li) => (
        <Fragment key={li}>
          <span className={Array.isArray(lines) ? `block ${lineClassName}` : undefined}>
            {line.split(' ').map((word, wi, words) => (
              <Fragment key={wi}>
                <span className="split-word">
                  <span style={{ '--word-index': index++ } as CSSProperties}>
                    {accentPeriod && word.endsWith('.') ? (
                      <>
                        {word.slice(0, -1)}
                        <span className="text-accent">.</span>
                      </>
                    ) : (
                      word
                    )}
                  </span>
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </span>
          {li < list.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
