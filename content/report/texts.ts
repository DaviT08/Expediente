import type { TopLevelTag, SubdimensionTag } from '@/lib/scoring';

// Nomes e definições exibidos no relatório (§2.1, §2.2)
export const INTELLIGENCE_INFO: Record<
  TopLevelTag,
  { name: string; short: string; definition: string; strength: string; ementa: string }
> = {
  LIN: {
    name: 'Linguística',
    short: 'Linguística',
    definition: 'Resolver pela palavra: escrever, nomear, narrar, argumentar.',
    strength: 'No trabalho, ajuda a registrar decisões, escrever com clareza e convencer com bons argumentos.',
    ementa: 'Comunicação nas organizações',
  },
  LOG: {
    name: 'Lógico-matemática',
    short: 'Lógica',
    definition: 'Resolver com números, causa e efeito, sequência e hipóteses.',
    strength: 'No trabalho, ajuda a checar premissas, comparar cenários e sustentar decisões com dados.',
    ementa: 'Percepção e tomada de decisão',
  },
  ESP: {
    name: 'Espacial',
    short: 'Espacial',
    definition: 'Resolver com imagens, mapas, layouts e visualização de cenários.',
    strength: 'No trabalho, ajuda a explicar processos complexos com um desenho e a enxergar o todo.',
    ementa: 'Comunicação e mapeamento de processos',
  },
  COR: {
    name: 'Corporal-cinestésica',
    short: 'Corporal',
    definition: 'Resolver com o corpo, as mãos, o movimento e a presença física.',
    strength: 'No trabalho, ajuda a ir aonde o problema acontece, prototipar e liderar pelo exemplo.',
    ementa: 'Liderança e cultura organizacional',
  },
  MUS: {
    name: 'Musical',
    short: 'Musical',
    definition: 'Perceber e usar ritmo, som e tom de voz.',
    strength: 'No trabalho, ajuda a ler o tom de uma conversa e a ajustar ritmo e entonação ao falar.',
    ementa: 'Comunicação e clima organizacional',
  },
  NAT: {
    name: 'Naturalista',
    short: 'Naturalista',
    definition: 'Observar e classificar padrões do ambiente, da natureza e da origem das coisas.',
    strength: 'No trabalho, ajuda a entender cadeias de suprimento, sazonalidade e impacto ambiental.',
    ementa: 'Organização e ambiente; sustentabilidade',
  },
  INTER: {
    name: 'Interpessoal',
    short: 'Interpessoal',
    definition: 'Entender e agir sobre emoções, intenções e relações dos outros.',
    strength: 'No trabalho, ajuda a escutar, mediar conflitos e mobilizar pessoas em torno de um objetivo.',
    ementa: 'Comportamento em grupo, conflito e liderança',
  },
  INTRA: {
    name: 'Intrapessoal',
    short: 'Intrapessoal',
    definition: 'Entender e manejar a si mesmo: emoções, motivações e valores.',
    strength: 'No trabalho, ajuda a manter a calma sob pressão e a decidir de acordo com seus valores.',
    ementa: 'Emoções, estresse e motivação',
  },
};

export const SUBDIMENSION_INFO: Record<SubdimensionTag, { name: string; meaning: string }> = {
  'INTER.EMP': { name: 'Empatia / leitura do outro', meaning: 'perceber o que o outro sente e precisa' },
  'INTER.COM': { name: 'Comunicação clara e assertiva', meaning: 'dizer o que precisa ser dito, com clareza e respeito' },
  'INTER.CONF': { name: 'Manejo de conflito e negociação', meaning: 'enfrentar a divergência e buscar acordo' },
  'INTER.COL': { name: 'Colaboração e mobilização', meaning: 'juntar pessoas, dividir trabalho, cocriar' },
  'INTRA.AUTO': { name: 'Autoconsciência', meaning: 'nomear a própria emoção e a causa dela' },
  'INTRA.REG': { name: 'Autorregulação', meaning: 'pausar e não reagir no impulso' },
  'INTRA.MOT': { name: 'Automotivação / propósito', meaning: 'conectar a ação a metas e valores próprios' },
  'INTRA.REF': { name: 'Reflexão', meaning: 'pensar sobre valores, aprendizados e quem quer ser' },
};

export const ENDING_NAMES: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: 'Mesa Cheia',
  B: 'Contrato fechado, cadeiras vazias',
  C: 'Recomeço',
  D: 'Fim de expediente',
};

export const CHAPTER_DAY: Record<number, string> = {
  0: 'Na véspera',
  1: 'Na segunda',
  2: 'Na terça',
  3: 'Na quarta',
  4: 'Na quinta',
  5: 'Na sexta',
  6: 'No epílogo',
};

// Apêndice C.3 — obrigatório
export const LIMITS_TEXT =
  'Ele mostra as formas de agir que você escolheu numa história de cerca de 30 minutos. Ele não mede inteligência, capacidade nem personalidade, e não é um teste psicológico. A teoria das inteligências múltiplas, de Howard Gardner, é uma lente útil para pensar em diferentes formas de resolver problemas, mas tem pouca comprovação científica como medida de inteligências separadas. Use este mapa como ponto de partida para refletir e conversar, não como rótulo.';

// Apêndice C.4
export const MIRROR_CLOSING =
  'Diferenças entre como nos vemos e como agimos são material de autoconhecimento, não erro.';

export const WELL_DISTRIBUTED_TEXT =
  'Suas escolhas ficaram bem distribuídas. O mapa não mostra preferências marcantes, o que também é uma informação.';

// Itens do Espelho (§8.3)
export const MIRROR_ITEMS: { tag: TopLevelTag; text: string }[] = [
  { tag: 'LIN', text: 'escrever, conversar ou argumentar com palavras' },
  { tag: 'LOG', text: 'organizar em números, causas e etapas' },
  { tag: 'ESP', text: 'desenhar, esquematizar ou visualizar' },
  { tag: 'COR', text: 'pôr a mão na massa, se movimentar, testar fisicamente' },
  { tag: 'MUS', text: 'prestar atenção a ritmo, som e tom de voz' },
  { tag: 'NAT', text: 'observar padrões do ambiente, da natureza, de onde as coisas vêm' },
  { tag: 'INTER', text: 'entender o que os outros sentem e envolver pessoas' },
  { tag: 'INTRA', text: 'olhar para o que você sente e pensa antes de agir' },
];
