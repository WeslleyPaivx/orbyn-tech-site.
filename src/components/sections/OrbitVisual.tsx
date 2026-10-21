import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { OrbynSymbol } from '../brand/Logo';

/**
 * Composição do hero: o símbolo oficial no centro de um sistema de órbitas.
 * Apenas SVG + CSS — leve, sem bibliotecas e pausado com movimento reduzido.
 */
export function OrbitVisual({ className = '' }: { className?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const orbitPath = 'M 60 300 A 240 118 0 1 1 540 300 A 240 118 0 1 1 60 300 Z';

  return (
    <div className={`pointer-events-none aspect-square select-none ${className}`} aria-hidden="true">
      {/* Luz suave por trás do símbolo */}
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.11),transparent_68%)] blur-2xl" />

      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        <defs>
          <radialGradient id="orbit-dot-glow">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbit-fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        {/* Arco amplo, como nas peças da marca */}
        <circle cx="300" cy="300" r="292" stroke="#fff" strokeOpacity="0.07" />
        <circle cx="300" cy="300" r="214" stroke="#fff" strokeOpacity="0.045" strokeDasharray="2 7" />

        <g className="orbit-spin">
          <ellipse cx="300" cy="300" rx="262" ry="96" transform="rotate(-28 300 300)" stroke="url(#orbit-fade)" />
        </g>
        <g className="orbit-spin-reverse">
          <ellipse cx="300" cy="300" rx="206" ry="150" transform="rotate(34 300 300)" stroke="#fff" strokeOpacity="0.08" />
        </g>

        {/* Ponto de luz percorrendo a órbita */}
        <g transform="rotate(-28 300 300)">
          <path d={orbitPath} stroke="#fff" strokeOpacity="0.14" />
          {!reduceMotion && (
            <g>
              <circle r="16" fill="url(#orbit-dot-glow)" opacity="0.5" />
              <circle r="3.2" fill="#fff" />
              <animateMotion dur="16s" repeatCount="indefinite" path={orbitPath} rotate="auto" />
            </g>
          )}
          {reduceMotion && <circle cx="540" cy="300" r="3.2" fill="#fff" />}
        </g>
      </svg>

      <OrbynSymbol className="absolute top-1/2 left-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.18)]" />
    </div>
  );
}
