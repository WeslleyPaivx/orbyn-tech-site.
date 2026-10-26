/**
 * VOLTRA — energético fictício criado para este conceito.
 * Nome, cores, sabores e textos são inventados; não representam nenhuma marca real.
 */
export const BRAND = {
  name: 'VOLTRA',
  tagline: 'Ganhe altitude.',
  ink: '#08080B',
  chrome: '#C9CED6',
  volt: '#FF4A1C',
  spark: '#FFB21E',
};

export type Flavor = {
  id: string;
  name: string;
  subtitle: string;
  notes: string[];
  /** Cores da lata: fundo, faixa e texto. */
  can: { base: string; band: string; text: string; accent: string };
  stats: { label: string; value: number }[];
};

export const FLAVORS: Flavor[] = [
  {
    id: 'original',
    name: 'Original',
    subtitle: 'O clássico que decola.',
    notes: ['Cítrico', 'Picante', 'Final seco'],
    can: { base: '#0B0B10', band: '#FF4A1C', text: '#F4F5F7', accent: '#FFB21E' },
    stats: [
      { label: 'Energia', value: 92 },
      { label: 'Intensidade', value: 88 },
      { label: 'Doçura', value: 46 },
    ],
  },
  {
    id: 'ciclone',
    name: 'Ciclone',
    subtitle: 'Tropical, gelado, sem freio.',
    notes: ['Maracujá', 'Abacaxi', 'Toque de limão'],
    can: { base: '#0E5E66', band: '#FFD23F', text: '#F4FFFB', accent: '#FF4A1C' },
    stats: [
      { label: 'Energia', value: 84 },
      { label: 'Intensidade', value: 72 },
      { label: 'Doçura', value: 70 },
    ],
  },
  {
    id: 'zero',
    name: 'Zero',
    subtitle: 'Toda a altitude, zero açúcar.',
    notes: ['Limão siciliano', 'Gengibre', 'Zero açúcar'],
    can: { base: '#E9ECF1', band: '#101218', text: '#0B0C10', accent: '#FF4A1C' },
    stats: [
      { label: 'Energia', value: 86 },
      { label: 'Intensidade', value: 80 },
      { label: 'Doçura', value: 18 },
    ],
  },
];

export type Mode = { id: string; label: string; line: string; flavor: string; bars: number[] };

/** "Qual é o seu modo?": cada modo recomenda um sabor. */
export const MODES: Mode[] = [
  { id: 'foco', label: 'Foco', line: 'Prazo apertado, cabeça no lugar.', flavor: 'zero', bars: [80, 62, 90] },
  { id: 'treino', label: 'Treino', line: 'Mais uma série. E outra.', flavor: 'original', bars: [95, 88, 70] },
  { id: 'noite', label: 'Noite', line: 'A cidade acordada com você.', flavor: 'ciclone', bars: [78, 92, 64] },
  { id: 'estrada', label: 'Estrada', line: 'Quilômetros sem piloto automático.', flavor: 'original', bars: [88, 70, 85] },
];

/** Contato da agência que criou o conceito (chamada final do site). */
export const AGENCY = {
  name: 'ORBYN TECH',
  whatsapp: 'https://wa.me/5511948108450?text=' + encodeURIComponent('Olá, ORBYN TECH! Vi o conceito VOLTRA e quero um site assim.'),
  site: 'https://orbyntech.vercel.app/',
};
