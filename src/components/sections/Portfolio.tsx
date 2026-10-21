import { useMemo, useState, type ReactNode } from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { whatsappMessages } from '../../config/site';
import { displayDomain, getPublishedProjects, type Project } from '../../data/projects';
import { whatsappUrl } from '../../lib/whatsapp';
import { OrbynSymbol } from '../brand/Logo';
import { ButtonLink } from '../ui/Button';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const ALL = 'Todos';
/** Os filtros por categoria só aparecem quando o portfólio crescer. */
const MIN_PROJECTS_FOR_FILTERS = 4;

/** Capa exibida enquanto o projeto não tem captura de tela: o nome em tipografia, sem imagem genérica. */
function ProjectCover({ project }: { project: Project }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-end overflow-hidden bg-[radial-gradient(120%_95%_at_85%_0%,#202020_0%,#0b0b0b_62%)] p-6 sm:p-9"
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 250" className="absolute -top-[30%] -right-[18%] h-[150%] w-auto text-white" fill="none">
        <ellipse cx="200" cy="125" rx="170" ry="62" transform="rotate(-24 200 125)" stroke="currentColor" strokeOpacity="0.09" />
        <ellipse cx="200" cy="125" rx="118" ry="88" transform="rotate(30 200 125)" stroke="currentColor" strokeOpacity="0.06" />
        <circle cx="200" cy="125" r="122" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="2 6" />
      </svg>
      <p className="relative text-[clamp(1.75rem,4.2vw,3.1rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-white/90">
        {project.name}
      </p>
    </div>
  );
}

const DEFAULT_COVER_BACKGROUND = '#F2F2F0';

/** Capa com a logo do cliente sobre fundo claro (ou na cor definida em `coverBackground`). */
function LogoCover({ project, onError }: { project: Project; onError: () => void }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-[12%]"
      style={{ background: project.coverBackground ?? DEFAULT_COVER_BACKGROUND }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_45%,rgb(255_255_255/0.55),transparent_70%)]"
        aria-hidden="true"
      />
      <img
        src={project.logo}
        alt={`Logo ${project.name}`}
        loading="lazy"
        decoding="async"
        onError={onError}
        className="relative max-h-[58%] max-w-[72%] object-contain transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
      />
    </div>
  );
}

/** Moldura de navegador desktop com a captura real do site (ou a capa, sem captura). */
function BrowserMockup({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const hasImage = Boolean(project.image) && !failed;
  const hasLogo = Boolean(project.logo) && !logoFailed;

  return (
    <div className="relative overflow-hidden rounded-t-[0.85rem] border border-b-0 border-white/[0.12] bg-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] transition-transform duration-700 ease-[var(--ease-soft)] group-hover:-translate-y-1.5">
      {/* Barra do navegador */}
      <div className="flex h-8 items-center gap-3 border-b border-line bg-[#131313] px-3 sm:h-9 sm:px-3.5" aria-hidden="true">
        <span className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.16]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.11]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
        </span>
        {project.url && (
          <span className="mx-auto flex h-[1.4rem] min-w-0 items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 text-[0.7rem] text-white/50 sm:px-3 sm:text-[0.72rem]">
            <Lock className="h-3 w-3 shrink-0" strokeWidth={2} />
            <span className="truncate">{displayDomain(project.url)}</span>
          </span>
        )}
        <span className="w-[2.6rem] shrink-0" />
      </div>

      {/* Tela */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-3">
        {hasImage ? (
          <img
            src={project.image}
            alt={project.imageAlt ?? `Página inicial do site ${project.name}`}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            // Capturas de página inteira rolam devagar ao passar o mouse
            className="absolute inset-0 h-full w-full object-cover object-top transition-[object-position] duration-[6s] ease-in-out motion-safe:group-hover:object-bottom"
          />
        ) : hasLogo ? (
          <LogoCover project={project} onError={() => setLogoFailed(true)} />
        ) : (
          <ProjectCover project={project} />
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const stageClass =
    'relative block overflow-hidden bg-[radial-gradient(90%_80%_at_50%_0%,rgb(255_255_255/0.07),transparent_70%)] px-5 pt-7 sm:px-10 sm:pt-11';
  const stage: ReactNode = <BrowserMockup project={project} />;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-ink-2 transition-colors duration-500 hover:border-white/25">
      {project.url ? (
        // Atalho visual: o botão "Explorar projeto" é o link acessível do card
        <a href={project.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className={stageClass}>
          {stage}
        </a>
      ) : (
        <div className={stageClass}>{stage}</div>
      )}

      <div className="flex flex-1 flex-col border-t border-line p-6 sm:p-9">
        <p className="text-sm text-mute">{project.segment}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-[1.75rem]">{project.name}</h3>
        <p className="mt-4 max-w-[52ch] leading-relaxed text-mute">{project.description}</p>

        {project.technologies.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tecnologias utilizadas">
            {project.technologies.map((tech) => (
              <li key={tech} className="rounded-full border border-line px-3 py-1 text-xs text-white/80">
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-5 pt-8">
          <span className="rounded-full border border-line px-3 py-1.5 text-xs text-white/75">{project.category}</span>
          {project.url && (
            <ButtonLink
              href={project.url}
              external
              variant="outline"
              className="group-hover:border-white/60"
              aria-label={`Explorar projeto ${project.name} (abre em nova aba)`}
            >
              Explorar projeto
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-line bg-ink-2 px-6 py-16 text-center sm:px-10 sm:py-24">
      <div
        className="absolute top-1/2 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -z-10 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.06]"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.07),transparent_70%)]"
        aria-hidden="true"
      />

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

export function Portfolio() {
  const published = useMemo(() => getPublishedProjects(), []);
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(published.map((project) => project.category)))],
    [published],
  );
  const [filter, setFilter] = useState(ALL);
  const visible = filter === ALL ? published : published.filter((project) => project.category === filter);
  const showFilters = published.length >= MIN_PROJECTS_FOR_FILTERS && categories.length > 2;

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="border-t border-line/60 py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="portfolio-title"
          title="Projetos realizados."
          subtitle="Conheça algumas das soluções desenvolvidas pela ORBYN TECH para empresas de diferentes segmentos."
        />

        <Reveal className="mt-14 sm:mt-20">
          {published.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {showFilters && (
                <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar projetos por categoria">
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

              <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
                {visible.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              <div className="mt-10 flex flex-col items-start gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md leading-relaxed text-mute">
                  Quer o próximo projeto aqui ser o da sua empresa? Conte sua ideia e receba um orçamento.
                </p>
                <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external variant="outline">
                  Solicitar orçamento
                </ButtonLink>
              </div>
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
