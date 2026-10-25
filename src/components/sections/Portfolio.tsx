import { useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { whatsappMessages } from '../../config/site';
import { displayDomain, getPublishedProjects, type Project } from '../../data/projects';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { whatsappUrl } from '../../lib/whatsapp';
import { OrbynSymbol } from '../brand/Logo';
import { ButtonLink } from '../ui/Button';
import { ArrowUpRight, Lock } from '../ui/Icons';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SplitWords } from '../ui/SplitWords';

const ALL = 'Todos';
/** Os filtros por categoria só aparecem quando o portfólio crescer. */
const MIN_PROJECTS_FOR_FILTERS = 4;
const DEFAULT_COVER_BACKGROUND = 'linear-gradient(135deg, #1f1f1f 0%, #0b0b0b 100%)';

/** Moldura que inclina em 3D acompanhando o ponteiro (desligada em toque e com movimento reduzido). */
function TiltFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`);
    ref.current.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`);
    ref.current.style.setProperty('--glare-x', `${((x + 0.5) * 100).toFixed(1)}%`);
    ref.current.style.setProperty('--glare-y', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty('--tilt-x', '0deg');
    ref.current?.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}

/** Tela do navegador: captura do site → logo do cliente sobre as cores da marca → nome em tipografia. */
function Screen({ project }: { project: Project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  if (project.image && !imageFailed) {
    return (
      <img
        src={project.image}
        alt={project.imageAlt ?? `Página inicial do site ${project.name}`}
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        className="absolute inset-0 h-full w-full object-cover object-top transition-[object-position] duration-[6s] ease-in-out motion-safe:group-hover:object-bottom"
      />
    );
  }

  if (project.logo && !logoFailed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center p-[12%]"
        style={{ background: project.coverBackground ?? DEFAULT_COVER_BACKGROUND }}
      >
        <img
          src={project.logo}
          alt={`Logo ${project.name}`}
          loading="lazy"
          decoding="async"
          onError={() => setLogoFailed(true)}
          className="relative max-h-[58%] max-w-[74%] object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)]"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-end bg-ink-3 p-6 sm:p-9" aria-hidden="true">
      <p className="text-[clamp(1.75rem,4.2vw,3.1rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-white/90">
        {project.name}
      </p>
    </div>
  );
}

function BrowserMockup({ project }: { project: Project }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.14] bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex h-9 items-center gap-3 border-b border-line bg-[#111] px-3.5" aria-hidden="true">
        <span className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.16]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.11]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
        </span>
        {project.url && (
          <span className="mx-auto flex h-[1.4rem] min-w-0 items-center gap-1.5 rounded-md bg-white/[0.05] px-3 text-[0.72rem] text-white/50">
            <Lock className="h-3 w-3 shrink-0" strokeWidth={2} />
            <span className="truncate">{displayDomain(project.url)}</span>
          </span>
        )}
        <span className="w-[2.6rem] shrink-0" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-3">
        <Screen project={project} />
        {/* Reflexo que acompanha o ponteiro */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 30%), rgb(255 255 255 / 0.14), transparent 55%)',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function ProjectRow({ project, index, total }: { project: Project; index: number; total: number }) {
  const flip = index % 2 === 1;
  return (
    <article className="group grid items-center gap-10 border-t border-white/[0.12] py-14 sm:py-20 lg:grid-cols-12 lg:gap-14">
      <Reveal className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
        {project.url ? (
          <a href={project.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="block">
            <TiltFrame>
              <BrowserMockup project={project} />
            </TiltFrame>
          </a>
        ) : (
          <TiltFrame>
            <BrowserMockup project={project} />
          </TiltFrame>
        )}
      </Reveal>

      <div className={`legible lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <Reveal>
          <p className="text-sm text-white/50 tabular-nums">
            {String(index + 1).padStart(2, '0')} <span className="text-white/25">/ {String(total).padStart(2, '0')}</span>
            <span className="ml-4 text-mute">{project.segment}</span>
          </p>
        </Reveal>
        <SplitWords
          as="h3"
          lines={project.name}
          className="mt-5 text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.98] font-medium tracking-[-0.04em] text-white"
        />
        <Reveal delay={120}>
          <p className="mt-6 max-w-[46ch] leading-relaxed text-mute">{project.description}</p>
          {project.technologies.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tecnologias utilizadas">
              {project.technologies.map((tech) => (
                <li key={tech} className="rounded-full border border-white/[0.14] px-3 py-1 text-xs text-white/75">
                  {tech}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            {project.url && (
              <ButtonLink
                href={project.url}
                external
                variant="outline"
                aria-label={`Explorar projeto ${project.name} (abre em nova aba)`}
              >
                Explorar projeto
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </ButtonLink>
            )}
            <p className="text-sm text-white/55">{project.category}</p>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-line bg-ink-2 px-6 py-16 text-center sm:px-10 sm:py-20">
      <OrbynSymbol className="mx-auto h-12 w-12 text-white/90" />
      <p className="mt-8 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">Novos projetos em breve.</p>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-mute">
        Estamos preparando esta galeria. Enquanto isso, conte sobre a sua ideia e veja como podemos ajudar.
      </p>
      <div className="mt-9 flex justify-center">
        <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external variant="outline">
          Falar sobre meu projeto
        </ButtonLink>
      </div>
    </div>
  );
}

/** Portfólio: os fios se reorganizam em uma torre de treliça (data-stage="2"). */
export function Portfolio() {
  const published = useMemo(() => getPublishedProjects(), []);
  const categories = useMemo(() => [ALL, ...Array.from(new Set(published.map((p) => p.category)))], [published]);
  const [filter, setFilter] = useState(ALL);
  const visible = filter === ALL ? published : published.filter((p) => p.category === filter);
  const showFilters = published.length >= MIN_PROJECTS_FOR_FILTERS && categories.length > 2;

  return (
    <section id="portfolio" data-stage="2" aria-labelledby="portfolio-title" className="relative py-28 sm:py-40">
      <Container>
        <SectionHeading
          id="portfolio-title"
          index="03"
          label="Portfólio"
          title="Projetos realizados."
          subtitle="Conheça algumas das soluções desenvolvidas pela ORBYN TECH para empresas de diferentes segmentos."
        />

        <div className="mt-16 sm:mt-24">
          {published.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {showFilters && (
                <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar projetos por categoria">
                  {categories.map((category) => {
                    const selected = filter === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setFilter(category)}
                        aria-pressed={selected}
                        className={`min-h-10 rounded-full border px-4 text-sm transition-colors duration-300 ${
                          selected
                            ? 'border-white bg-white text-ink'
                            : 'border-line text-mute hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              )}
              {visible.map((project, index) => (
                <ProjectRow key={project.id} project={project} index={index} total={visible.length} />
              ))}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
