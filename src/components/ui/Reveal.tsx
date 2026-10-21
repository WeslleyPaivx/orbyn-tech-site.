import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Atraso em milissegundos (para entradas em sequência). */
  delay?: number;
  id?: string;
};

/** Faz o conteúdo surgir suavemente quando entra na tela. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref);
  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties;

  return (
    <Tag
      ref={ref}
      id={id}
      style={style}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
