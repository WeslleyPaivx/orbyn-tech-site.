import { useRef, type PointerEvent, type ReactNode } from 'react';

type MagneticProps = { children: ReactNode; className?: string; strength?: number };

/**
 * Atrai levemente o conteúdo em direção ao ponteiro (microinteração dos botões principais).
 * Só reage a mouse; em toque e com movimento reduzido fica parado.
 */
export function Magnetic({ children, className = '', strength = 0.22 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || event.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * strength;
    const y = (event.clientY - rect.top - rect.height / 2) * strength;
    el.style.setProperty('--mag-x', `${x.toFixed(1)}px`);
    el.style.setProperty('--mag-y', `${y.toFixed(1)}px`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty('--mag-x', '0px');
    ref.current?.style.setProperty('--mag-y', '0px');
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`magnetic ${className}`}>
      {children}
    </div>
  );
}
