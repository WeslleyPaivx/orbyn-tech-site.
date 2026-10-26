/**
 * Camadas geométricas atrás do hero (na frente da escultura 3D, atrás do texto):
 * grade fina com máscara radial e uma varredura lenta, e órbitas concêntricas em volta do
 * símbolo, girando devagar com um ponto ciano. Cada camada se desloca em profundidade diferente (parallax).
 */
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Grade fina */}
      <div className="parallax-layer absolute inset-0" style={{ ['--depth' as string]: '8px' }}>
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(245 247 250 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(245 247 250 / 0.045) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 68% 45%, #000 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 68% 45%, #000 20%, transparent 75%)',
          }}
        />
        <div
          className="scan-line absolute inset-x-0 top-0 h-[40%]"
          style={{
            background: 'linear-gradient(180deg, transparent, rgb(54 221 232 / 0.035) 85%, rgb(54 221 232 / 0.09) 100%)',
            maskImage: 'radial-gradient(ellipse 60% 100% at 68% 50%, #000 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 100% at 68% 50%, #000 30%, transparent 80%)',
          }}
        />
      </div>

      {/* Órbitas: centradas no símbolo (à direita no desktop, no alto no celular).
          Cada anel é uma camada própria girada pela GPU (transform), sem redesenhar o SVG. */}
      <div
        className="parallax-layer absolute top-[22%] left-1/2 aspect-square w-[150vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 sm:w-[110vw] lg:top-1/2 lg:left-[69%] lg:w-[64vw] lg:max-w-[980px]"
        style={{ ['--depth' as string]: '-22px' }}
      >
        <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          <circle cx="300" cy="300" r="296" stroke="#F5F7FA" strokeOpacity="0.05" />
        </svg>
        <div className="orbit-spin absolute inset-0" style={{ ['--orbit-duration' as string]: '140s' }}>
          <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible" fill="none">
            <circle cx="300" cy="300" r="250" stroke="#F5F7FA" strokeOpacity="0.07" strokeDasharray="2 10" />
          </svg>
        </div>
        <div className="orbit-spin absolute inset-0" style={{ ['--orbit-duration' as string]: '70s' }}>
          <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible" fill="none">
            <ellipse cx="300" cy="300" rx="272" ry="112" transform="rotate(-24 300 300)" stroke="#F5F7FA" strokeOpacity="0.08" />
            <circle cx="548" cy="190" r="2.6" fill="#36DDE8" />
            <circle cx="548" cy="190" r="9" fill="#36DDE8" fillOpacity="0.12" />
          </svg>
        </div>
        <div className="orbit-spin orbit-spin-reverse absolute inset-0" style={{ ['--orbit-duration' as string]: '110s' }}>
          <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible" fill="none">
            <ellipse cx="300" cy="300" rx="206" ry="150" transform="rotate(32 300 300)" stroke="#F5F7FA" strokeOpacity="0.06" />
            <circle cx="126" cy="410" r="1.8" fill="#F5F7FA" fillOpacity="0.7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
