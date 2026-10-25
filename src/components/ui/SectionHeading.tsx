import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { SplitWords } from './SplitWords';

type SectionHeadingProps = {
  id?: string;
  /** Número da seção, ex.: "02". */
  index?: string;
  label?: string;
  title: string | string[];
  subtitle?: ReactNode;
  className?: string;
  /** 'lg' para aberturas de seção; 'md' para seções secundárias. */
  size?: 'lg' | 'md';
};

/** Título de seção: rótulo editorial, título grande que surge palavra por palavra e apoio opcional. */
export function SectionHeading({ id, index, label, title, subtitle, className = '', size = 'lg' }: SectionHeadingProps) {
  const titleSize = size === 'lg' ? 'text-[clamp(2.2rem,6vw,4.6rem)]' : 'text-[clamp(2rem,4.4vw,3.4rem)]';
  return (
    <div className={`legible max-w-4xl ${className}`}>
      {label && (
        <Reveal>
          <p className="eyebrow">
            {index && <span className="text-white/80">({index})</span>}
            {label}
          </p>
        </Reveal>
      )}
      <SplitWords
        id={id}
        lines={title}
        className={`mt-6 ${titleSize} leading-[0.98] font-medium tracking-[-0.04em] text-white`}
      />
      {subtitle && (
        <Reveal delay={120}>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-mute sm:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
