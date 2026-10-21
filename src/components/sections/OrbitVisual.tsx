import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { OrbynSymbol } from '../brand/Logo';

/**
 * Composição do hero: o símbolo oficial da ORBYN no centro das próprias órbitas.
 * As elipses repetem o desenho do símbolo e o arco amplo vem das peças da marca.
 * Um único movimento: um ponto percorrendo a órbita (desligado com movimento reduzido).
 */
export function OrbitVisual({ className = '' }: { className?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const orbitPath = 'M 60 300 A 240 118 0 1 1 540 300 A 240 118 0 1 1 60 300 Z';

  return (
    <div className={`pointer-events-none aspect-square select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        <circle cx="300" cy="300" r="292" stroke="#fff" strokeOpacity="0.07" />
        <ellipse cx="300" cy="300" rx="206" ry="150" transform="rotate(34 300 300)" stroke="#fff" strokeOpacity="0.07" />

        <g transform="rotate(-28 300 300)">
          <path d={orbitPath} stroke="#fff" strokeOpacity="0.16" />
          {reduceMotion ? (
            <circle cx="540" cy="300" r="3.2" fill="#fff" />
          ) : (
            <circle r="3.2" fill="#fff">
              <animateMotion dur="16s" repeatCount="indefinite" path={orbitPath} />
            </circle>
          )}
        </g>
      </svg>

      <OrbynSymbol className="absolute top-1/2 left-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 text-white" />
    </div>
  );
}
