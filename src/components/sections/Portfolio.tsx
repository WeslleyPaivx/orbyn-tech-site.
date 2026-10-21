import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { whatsappMessages } from '../../config/site';
import { getPublishedProjects, type Project } from '../../data/projects';
import { whatsappUrl } from '../../lib/whatsapp';
import { OrbynSymbol } from '../brand/Logo';
import { ButtonLink } from '../ui/Button';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const ALL = 'Todos';

function ProjectCard({ project, wide }: { project: Project; wide: boolean }) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[1.5rem] border border-line bg-ink-2 transition-colors duration-500 hover:border-white/25 ${
        wide ? 'md:col-span-2 lg:grid lg:grid-cols-[1.35fr_1fr]' : ''
      }`}
    >
      <div className={`relative overflow-hidden bg-ink-3 aspect-[16/10] ${wide ? 'lg:aspect-auto lg:min-h-[22rem]' : ''}`}>
        <img
          src={project.image}
          alt={project.imageAlt ?? `Tela do projeto ${project.name}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="text-sm text-mute">{project.category}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.015em] text-white sm:text-2xl">{project.name}</h3>
        <p className="mt-3 max-w-prose leading-relaxed text-mute">{project.description}</p>

        {project.technologies.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tecnologias utilizadas">
            {project.technologies.map((tech) => (
              <li key={tech} className="rounded-full border border-line px-3 py-1 text-xs text-white/80">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {project.url && (
          <div className="mt-auto pt-7">
            <ButtonLink
              href={project.url}
              external
              variant="outline"
              aria-label={`Visualizar projeto ${project.name} (abre em nova aba)`}
            >
              Visualizar projeto
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </ButtonLink>
          </div>
        )}
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

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="border-t border-line/60 py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="portfolio-title"
          title="Projetos que transformam ideias em realidade."
          subtitle="Conheça algumas das soluções desenvolvidas pela ORBYN TECH."
        />

        <Reveal className="mt-14 sm:mt-20">
          {published.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {categories.length > 2 && (
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
                  <ProjectCard key={project.id} project={project} wide={project.featured && filter === ALL} />
                ))}
              </div>
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
