import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  id?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
};

/** Título de seção: a hierarquia vem só da tipografia, sem ornamentos. */
export function SectionHeading({ id, title, subtitle, className = '' }: SectionHeadingProps) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      <h2
        id={id}
        className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-white sm:text-[2.6rem] lg:text-[3.1rem]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">{subtitle}</p>
      )}
    </Reveal>
  );
}
