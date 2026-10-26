import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { OrbynSymbol } from '../brand/Logo';

/**
 * Versão leve do hero (sem WebGL): o símbolo oficial no centro de órbitas finas.
 * O símbolo é exibido como no arquivo original, sem efeitos; só as órbitas se movem.
 */
export function OrbitVisual({ className = '' }: { className?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const orbitPath = 'M 60 300 A 240 118 0 1 1 540 300 A 240 118 0 1 1 60 300 Z';

  return (
    <div className={`pointer-events-none aspect-square select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        <circle cx="300" cy="300" r="292" stroke="#F5F7FA" strokeOpacity="0.07" />
        <g transform="rotate(-28 300 300)">
          <path d={orbitPath} stroke="#F5F7FA" strokeOpacity="0.14" />
          {reduceMotion ? (
            <circle cx="540" cy="300" r="3.2" fill="#36DDE8" />
          ) : (
            <circle r="3.2" fill="#36DDE8">
              <animateMotion dur="16s" repeatCount="indefinite" path={orbitPath} />
            </circle>
          )}
        </g>
      </svg>
      <OrbynSymbol className="absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
