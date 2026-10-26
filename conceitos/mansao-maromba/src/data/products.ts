/**
 * Catálogo do conceito. Tudo o que aparece sobre cada produto vem daqui.
 *
 * Regras de conteúdo:
 * - Só informações visíveis no rótulo ou confirmadas pelo cliente (nome, volume, linha).
 * - Nada de preço, teor alcoólico ou ingredientes que não foram confirmados.
 * - `image: null` mostra o espaço reservado até chegar a foto oficial.
 */

export type ModeId = 'zero' | 'original' | 'resenha' | 'noite';

export interface Product {
  id: string;
  name: string;
  /** Linha curta para títulos grandes (vitrine). */
  display: string;
  category: string;
  volume: string;
  description: string;
  facts: string[];
  /** Caminho da fotografia original recortada; null = aguardando arquivo. */
  image: string | null;
  /** Proporção largura/altura da foto, para reservar espaço sem saltos de layout. */
  ratio: number;
  alcoholic: boolean;
  mode: ModeId;
  theme: { bg: string; accent: string; glow: string };
}

export const PRODUCTS: Product[] = [
  {
    id: 'original-zero',
    name: 'Sabor Energético Original Zero',
    display: 'ORIGINAL ZERO',
    category: 'Energético · sem álcool',
    volume: '1L',
    description: 'A versão Zero do Saabooor Energético.',
    facts: ['Zero açúcar', 'Sem cafeína', 'Sem taurina', 'Sem álcool'],
    image: null,
    ratio: 0.3,
    alcoholic: false,
    mode: 'zero',
    theme: { bg: '#14060d', accent: '#FF0878', glow: '#E9B957' },
  },
  {
    id: 'original',
    name: 'Sabor Energético Original',
    display: 'ORIGINAL',
    category: 'Energético · sem álcool',
    volume: '1L',
    description: 'A garrafa rosa que deu início ao Saabooor.',
    facts: ['Sem cafeína', 'Sem taurina', 'Sem álcool'],
    image: '/produtos/original.webp',
    ratio: 404 / 1384,
    alcoholic: false,
    mode: 'original',
    theme: { bg: '#2a0517', accent: '#FF0878', glow: '#FF4FA0' },
  },
  {
    id: 'gin-melancia',
    name: 'Gin + Combo Melancia',
    display: 'GIN MELANCIA',
    category: 'Cocktail alcoólico gaseificado · 18+',
    volume: '1L',
    description: 'Garrafa lilás e rosa da linha Gin.',
    facts: ['Cocktail alcoólico gaseificado', 'Linha Gin'],
    image: '/produtos/gin-melancia.webp',
    ratio: 300 / 1046,
    alcoholic: true,
    mode: 'resenha',
    theme: { bg: '#1c0a26', accent: '#D58CF0', glow: '#FF3B7F' },
  },
  {
    id: 'gin-tigrinho',
    name: 'Gin + Combo Tigrinho Tropical',
    display: 'GIN TIGRINHO',
    category: 'Cocktail alcoólico gaseificado · 18+',
    volume: '1L',
    description: 'Garrafa amarela da linha Gin.',
    facts: ['Cocktail alcoólico gaseificado', 'Linha Gin'],
    image: '/produtos/gin-tigrinho.webp',
    ratio: 304 / 1048,
    alcoholic: true,
    mode: 'resenha',
    theme: { bg: '#1f1205', accent: '#F4C430', glow: '#C04BE0' },
  },
  {
    id: 'whisky-combo',
    name: 'Whisky + Combo',
    display: 'WHISKY COMBO',
    category: 'Cocktail alcoólico gaseificado · 18+',
    volume: '1L',
    description: 'Garrafa preta com detalhes magenta.',
    facts: ['Cocktail alcoólico gaseificado', 'Linha Whisky'],
    image: '/produtos/whisky-combo.webp',
    ratio: 302 / 1044,
    alcoholic: true,
    mode: 'noite',
    theme: { bg: '#120a06', accent: '#FF2E9A', glow: '#C98A2E' },
  },
  {
    id: 'whisky-double-darkness',
    name: 'Whisky + Combo Double Darkness',
    display: 'DOUBLE DARKNESS',
    category: 'Cocktail alcoólico gaseificado · 18+',
    volume: '1L',
    description: 'Garrafa preta com acabamento prata.',
    facts: ['Cocktail alcoólico gaseificado', 'Linha Whisky'],
    image: '/produtos/whisky-double-darkness.webp',
    ratio: 316 / 1048,
    alcoholic: true,
    mode: 'noite',
    theme: { bg: '#0d0c0b', accent: '#C9CCD3', glow: '#B07A2A' },
  },
  {
    id: 'vodka-combo',
    name: 'Vodka + Combo',
    display: 'VODKA COMBO',
    category: 'Cocktail alcoólico gaseificado · 18+',
    volume: '1L',
    description: 'Garrafa azul com detalhes rosa.',
    facts: ['Cocktail alcoólico gaseificado', 'Linha Vodka'],
    image: '/produtos/vodka-combo.webp',
    ratio: 284 / 980,
    alcoholic: true,
    mode: 'noite',
    theme: { bg: '#07111c', accent: '#8FC8F5', glow: '#FF2E9A' },
  },
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id)!;

export interface Mode {
  id: ModeId;
  index: string;
  label: string;
  tag: string;
  title: string;
  text: string;
  products: string[];
  alcoholic: boolean;
  theme: { bg: string; bg2: string; accent: string; glow: string };
}

export const MODES: Mode[] = [
  {
    id: 'zero',
    index: '01',
    label: 'Zero',
    tag: 'Destaque',
    title: 'TODO O SABOR. ZERO AÇÚCAR.',
    text: 'Sabor Energético Original Zero 1L. Sem açúcar, sem cafeína, sem taurina e sem álcool.',
    products: ['original-zero'],
    alcoholic: false,
    theme: { bg: '#0b0306', bg2: '#3a0a22', accent: '#FF0878', glow: '#E9B957' },
  },
  {
    id: 'original',
    index: '02',
    label: 'Original',
    tag: 'Energético',
    title: 'O ORIGINAL TEM SAABOOOR.',
    text: 'Sabor Energético Original 1L. A garrafa rosa, sem cafeína, sem taurina e sem álcool.',
    products: ['original'],
    alcoholic: false,
    theme: { bg: '#1a0310', bg2: '#7a0a3e', accent: '#FF0878', glow: '#E9B957' },
  },
  {
    id: 'resenha',
    index: '03',
    label: 'Resenha',
    tag: '18+',
    title: 'CADA ENCONTRO TEM SUA RESENHA.',
    text: 'Linha Gin: Gin + Combo Melancia e Gin + Combo Tigrinho Tropical. Cocktails alcoólicos gaseificados de 1L.',
    products: ['gin-melancia', 'gin-tigrinho'],
    alcoholic: true,
    theme: { bg: '#0c0414', bg2: '#3b0d52', accent: '#E040B0', glow: '#8B3CF0' },
  },
  {
    id: 'noite',
    index: '04',
    label: 'Noite',
    tag: '18+',
    title: 'O SABOR TEM OUTRO CENÁRIO.',
    text: 'Linha Whisky e Vodka: Whisky + Combo, Whisky + Combo Double Darkness e Vodka + Combo. Cocktails alcoólicos gaseificados de 1L.',
    products: ['whisky-combo', 'whisky-double-darkness', 'vodka-combo'],
    alcoholic: true,
    theme: { bg: '#050403', bg2: '#2b1a07', accent: '#E9B957', glow: '#A8661C' },
  },
];

export const RESPONSIBLE = 'Beba com moderação. Se beber, não dirija. Venda proibida para menores de 18 anos.';
