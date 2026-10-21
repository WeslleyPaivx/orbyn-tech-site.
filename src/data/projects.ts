/**
 * PORTFÓLIO — arquivo central de projetos
 * ----------------------------------------------------------------------------
 * Para publicar um projeto:
 *   1. Coloque a imagem em /public/images/projetos/ (ex.: meu-projeto.webp).
 *      Recomendado: 1600 × 1000 px (proporção 16:10), formato .webp ou .jpg.
 *   2. Copie o modelo abaixo para dentro da lista `projects` e preencha os campos.
 *   3. Use status: 'publicado' para exibir no site, ou 'rascunho' para ocultar.
 *
 * Enquanto a lista não tiver projetos publicados, o site mostra a mensagem
 * "Novos projetos em breve." Nenhum componente visual precisa ser alterado.
 *
 * Modelo:
 * {
 *   id: 'nome-do-projeto',
 *   name: 'Nome do projeto',
 *   description: 'Uma ou duas frases sobre o que foi desenvolvido.',
 *   category: 'Site institucional',
 *   image: '/images/projetos/nome-do-projeto.webp',
 *   imageAlt: 'Página inicial do projeto exibida em um notebook',
 *   technologies: ['React', 'TypeScript', 'Tailwind CSS'],
 *   url: 'https://endereco-do-projeto.com.br',
 *   featured: true,
 *   status: 'publicado',
 * },
 */

export type ProjectCategory =
  | 'Site institucional'
  | 'Landing page'
  | 'Sistema SaaS'
  | 'Sistema personalizado'
  | 'Aplicativo'
  | 'Automação e IA';

export type ProjectStatus = 'publicado' | 'rascunho';

export type Project = {
  /** Identificador único, sem espaços (ex.: 'clinica-sorriso'). */
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  /** Caminho a partir de /public (ex.: '/images/projetos/arquivo.webp'). */
  image: string;
  /** Texto alternativo da imagem (acessibilidade e SEO). */
  imageAlt?: string;
  /** Opcional: deixe a lista vazia se não quiser exibir tecnologias. */
  technologies: string[];
  /** Link externo do projeto. Deixe vazio ('') para ocultar o botão. */
  url: string;
  /** Projetos em destaque aparecem primeiro e com mais área. */
  featured: boolean;
  status: ProjectStatus;
};

export const projects: Project[] = [
  // Adicione os projetos aqui seguindo o modelo acima.
];

/** Projetos visíveis no site: apenas publicados, destaques primeiro. */
export function getPublishedProjects(list: Project[] = projects): Project[] {
  return list
    .filter((project) => project.status === 'publicado')
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}
