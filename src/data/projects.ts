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
 *   2. Salve em /public/images/projetos/ (ex.: zanfell.webp ou zanfell.jpg).
 *   3. Preencha o campo `image` com o caminho: '/images/projetos/zanfell.webp'.
 *
 * Logo do cliente (usada enquanto não houver captura de tela):
 *   1. Salve a logo em /public/images/projetos/ (de preferência SVG ou PNG com
 *      fundo transparente, ex.: zanfell-logo.png).
 *   2. Preencha `logo` com o caminho e, se quiser, `coverBackground` com a cor
 *      de fundo da capa (ex.: '#FFFFFF' ou a cor da marca do cliente).
 *
 * Ordem de exibição na moldura: captura de tela → logo → nome em tipografia.
 *
 * Use status: 'publicado' para exibir no site ou 'rascunho' para ocultar.
 */

export type ProjectStatus = 'publicado' | 'rascunho';

export type Project = {
  /** Identificador único, sem espaços (ex.: 'zanfell'). */
  id: string;
  name: string;
  /** Ramo de atuação do cliente. */
  segment: string;
  /** Tipo de solução entregue (ex.: 'Site institucional', 'Landing page', 'Aplicativo'). */
  category: string;
  description: string;
  /** Captura de tela a partir de /public (ex.: '/images/projetos/zanfell.webp'). Vazio = capa tipográfica. */
  image: string;
  /** Logo do cliente a partir de /public (ex.: '/images/projetos/zanfell-logo.png'). Vazio = nome em tipografia. */
  logo: string;
  /** Cor de fundo da capa com a logo (ex.: '#FFFFFF'). Padrão: cinza bem claro. */
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
    id: 'zanfell',
    name: 'ZanFell',
    segment: 'Papéis gráficos e papel offset A4',
    category: 'Site institucional / Catálogo de produtos',
    description:
      'Desenvolvimento de presença digital para empresa do setor de papéis gráficos, com apresentação dos produtos e navegação moderna.',
    image: '',
    logo: '',
    imageAlt: 'Página inicial do site da ZanFell',
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
    image: '',
    logo: '',
    imageAlt: 'Página inicial do site da MABS Contabilidade',
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
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

/** Mostra só o domínio (ex.: 'zanfell.bolt.host') na barra do navegador do mockup. */
export function displayDomain(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}
