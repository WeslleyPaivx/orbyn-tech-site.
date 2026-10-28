/**
 * PORTFÓLIO — arquivo central de projetos
 * ----------------------------------------------------------------------------
 * Para adicionar um cliente, copie um dos projetos abaixo e altere os campos.
 * Nenhum componente visual precisa ser modificado.
 *
 * Capturas de tela:
 *   1. Tire uma captura da página inicial no computador (ideal: 1440 px de
 *      largura). Pode ser só a primeira tela ou a página inteira — capturas
 *      longas "rolam" suavemente dentro do card quando o mouse passa por cima.
 *   2. Salve em /public/images/projetos/ (ex.: zanfel.webp ou zanfel.jpg).
 *   3. Preencha o campo `image` com o caminho: '/images/projetos/zanfel.webp'.
 *
 * Logo do cliente (usada enquanto não houver captura de tela):
 *   1. Salve a logo em /public/images/projetos/ (de preferência SVG ou PNG com
 *      fundo transparente, ex.: zanfel-logo.png).
 *   2. Preencha `logo` com o caminho e `coverBackground` com um gradiente nas
 *      cores da marca do cliente (veja os exemplos abaixo).
 *
 * Ordem de exibição na moldura: captura de tela → logo → nome em tipografia.
 *
 * Use status: 'publicado' para exibir no site ou 'rascunho' para ocultar.
 */

export type ProjectStatus = 'publicado' | 'rascunho';

export type Project = {
  /** Identificador único, sem espaços (ex.: 'zanfel'). */
  id: string;
  name: string;
  /** Ramo de atuação do cliente. */
  segment: string;
  /** Tipo de solução entregue (ex.: 'Site institucional', 'Landing page', 'Aplicativo'). */
  category: string;
  description: string;
  /** Captura de tela a partir de /public (ex.: '/images/projetos/zanfel.webp'). Vazio = capa tipográfica. */
  image: string;
  /** Logo do cliente a partir de /public (ex.: '/images/projetos/zanfel-logo.png'). Vazio = nome em tipografia. */
  logo: string;
  /** Fundo da capa com a logo: cor ou gradiente CSS nas cores da marca (ex.: 'linear-gradient(135deg, #B6B985, #1E3B2A)'). */
  coverBackground?: string;
  /** Texto alternativo da captura (acessibilidade e SEO). */
  imageAlt?: string;
  /** Opcional: deixe a lista vazia para não exibir tecnologias. */
  technologies: string[];
  /** Endereço do site do cliente. Deixe vazio ('') para ocultar o botão. */
  url: string;
  /** Projetos em destaque aparecem primeiro. */
  featured: boolean;
  status: ProjectStatus;
};

export const projects: Project[] = [
  {
    id: 'zanfel',
    name: 'ZanFel',
    segment: 'Papéis gráficos e papel offset A4',
    category: 'Site institucional / Catálogo de produtos',
    description:
      'Desenvolvimento de presença digital para empresa do setor de papéis gráficos, com apresentação dos produtos e navegação moderna.',
    // Captura real da página inicial (1440 px de largura, reduzida para 1120 px)
    image: '/images/projetos/zanfel-site.webp',
    logo: '/images/projetos/zanfel-logo.webp',
    // Gradiente nas cores da marca: sálvia, oliva e verde-escuro
    coverBackground:
      'radial-gradient(60% 70% at 50% 46%, rgb(237 233 223 / 0.32), transparent 70%), linear-gradient(135deg, #B6B985 0%, #838B58 48%, #1E3B2A 100%)',
    imageAlt: 'Página inicial do site da ZanFel, com o título “Papel de qualidade para grandes ideias”',
    technologies: [],
    url: 'https://zanfell.bolt.host',
    featured: true,
    status: 'publicado',
  },
  {
    id: 'mabs-contabilidade',
    name: 'MABS Contabilidade',
    segment: 'Contabilidade e serviços empresariais',
    category: 'Site institucional',
    description:
      'Desenvolvimento de site institucional para escritório de contabilidade, destacando seus serviços, identidade profissional e canais de atendimento.',
    image: '/images/projetos/mabs-contabilidade-site.webp',
    logo: '/images/projetos/mabs-contabilidade-logo.webp',
    // Gradiente nas cores da marca: dourado sobre preto
    coverBackground:
      'radial-gradient(60% 75% at 50% 48%, rgb(220 168 83 / 0.2), transparent 70%), linear-gradient(135deg, #3A2A10 0%, #17110A 50%, #080B10 100%)',
    imageAlt: 'Página inicial do site da MABS Contabilidade, com o título “Contabilidade estratégica para empresas que querem crescer com segurança”',
    technologies: [],
    url: 'https://mabs-contabilidade.bolt.host',
    featured: true,
    status: 'publicado',
  },
];

/** Projetos visíveis no site: apenas publicados, destaques primeiro (ordem do arquivo é mantida). */
export function getPublishedProjects(list: Project[] = projects): Project[] {
  return list
    .filter((project) => project.status === 'publicado')
    .map((project) => ({
      ...project,
      url: safeExternalUrl(project.url),
      image: safeLocalAsset(project.image),
      logo: safeLocalAsset(project.logo),
    }))
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

/** Aceita apenas endereços https válidos (bloqueia javascript:, http: e erros de digitação). */
export function safeExternalUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' ? parsed.href : '';
  } catch {
    return '';
  }
}

/** Aceita apenas arquivos do próprio site (caminhos que começam com uma única "/"). */
export function safeLocalAsset(path: string): string {
  return /^\/(?!\/)[\w\-./]+$/.test(path) && !path.includes('..') ? path : '';
}

/** Mostra só o domínio (ex.: 'zanfell.bolt.host') na barra do navegador do mockup. */
export function displayDomain(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}
