import { getPublishedProjects, type Project } from '../../data/projects';
import { handleAnchorClick } from '../../lib/scroll';
import { useProjectChoreography } from '../../motion/useProjectChoreography';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';

/**
 * Miniatura do site do cliente, desenhada em HTML.
 *
 * Não é captura de tela: é uma redução tipográfica da página real, com a cor e
 * o título que o cliente usa. Uma captura reduzida a 285px de altura vira
 * borrão ilegível; a redução mantém a identidade reconhecível em miniatura.
 */
const SKINS: Record<string, { site: string; logo: string; title: string }> = {
  'mabs-contabilidade': {
    site: 'mabs',
    logo: 'MABS CONTABILIDADE',
    title: 'Contabilidade com confiança para o seu negócio.',
  },
  zanfel: {
    site: 'zanfel',
    logo: 'ZanFel.',
    title: 'Papel de qualidade para grandes ideias.',
  },
};

function BrowserMock({ project }: { project: Project }) {
  const skin = SKINS[project.id] ?? {
    site: 'other',
    logo: project.name.toUpperCase(),
    title: project.description,
  };
  return (
    <div className="project-visual">
      <div className="browser-z" data-site={skin.site} aria-hidden="true">
        <div className="brow-bar">
          <i />
          <i />
          <i />
        </div>
        <div className="browser-body">
          <div className="browser-logo">{skin.logo}</div>
          <div className="browser-title">{skin.title}</div>
          <div className="browser-block">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 04 — PORTFÓLIO.
 *
 * É aqui que o movimento do ARTEFAKT entra, no lugar da jaqueta: cada projeto
 * chega torcido em perspectiva, se endireita ao alcançar o centro da tela e
 * depois cede lugar ao próximo. A coreografia vem da ROLAGEM, não de hover —
 * assim ela continua existindo no celular, onde não há ponteiro.
 */
export function Portfolio() {
  const projects = getPublishedProjects();
  const gridRef = useProjectChoreography();

  return (
    <section className="section-z surface-dark surface-grid" id="portfolio" aria-labelledby="portfolio-title">
      <div className="container-z">
        <Reveal>
          <Eyebrow index="04" label="Portfólio" />
        </Reveal>

        <Reveal className="header-row-z">
          <h2 id="portfolio-title" className="subhead-z">
            Projetos que
            <br />
            transformam negócios.
          </h2>
          <p className="dim-z">
            Cada projeto é único e nasce de uma combinação de estratégia, design e tecnologia voltada a resultados
            reais para os nossos clientes.
          </p>
        </Reveal>

        <div className="portfolio-grid" ref={gridRef}>
          {projects.map((project, index) => (
            <Reveal as="article" key={project.id} delay={index * 110} className="project-z">
              <BrowserMock project={project} />
              <div className="project-details">
                <h3>{project.name}</h3>
                <div className="dim-z">{project.description}</div>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    Acessar projeto ↗
                  </a>
                )}
              </div>
            </Reveal>
          ))}

          {/* Convite no lugar de cliente inventado: a vaga existe, o projeto não. */}
          <Reveal as="article" delay={projects.length * 110} className="project-z">
            <div className="project-visual">
              <div className="browser-z" data-site="other" aria-hidden="true">
                <div className="brow-bar">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="browser-body">
                  <div className="browser-logo">ZANIVA — PROJETOS</div>
                  <div className="browser-title">Experiências digitais com identidade.</div>
                  <div className="browser-block">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            </div>
            <div className="project-details">
              <h3>Outros projetos</h3>
              <div className="dim-z">
                Novos trabalhos poderão ser adicionados à galeria conforme forem aprovados para divulgação.
              </div>
              <a href="#contato" onClick={handleAnchorClick('contato')}>
                Solicitar portfólio ↗
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
