export type CharacterId =
  | 'lia'
  | 'bruno'
  | 'rafa'
  | 'marta'
  | 'patricia'
  | 'jorge'
  | 'kaio'
  | 'dani'
  | 'seu_antonio'
  | 'sofia'
  | 'henrique'
  | 'narrador';

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  role: string;
  color: string;
  initials: string;
}

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  lia: {
    id: 'lia',
    name: 'Lia Moura',
    role: 'Estagiária de Marketing',
    color: '#E0A526', // mostarda
    initials: 'LM',
  },
  bruno: {
    id: 'bruno',
    name: 'Bruno Ferraz',
    role: 'Coordenador do Galpão',
    color: '#2B7A8C', // azul-petróleo
    initials: 'BF',
  },
  rafa: {
    id: 'rafa',
    name: 'Rafa Duarte',
    role: 'Analista Financeiro',
    color: '#8E6CC4', // lilás
    initials: 'RD',
  },
  marta: {
    id: 'marta',
    name: 'Marta Ramos',
    role: 'Diretora-Geral',
    color: '#D97706',
    initials: 'MR',
  },
  patricia: {
    id: 'patricia',
    name: 'Patrícia Leme',
    role: 'Coordenadora de Marketing',
    color: '#EC4899',
    initials: 'PL',
  },
  jorge: {
    id: 'jorge',
    name: 'Jorge Silva',
    role: 'Operador Sênior',
    color: '#10B981',
    initials: 'JS',
  },
  kaio: {
    id: 'kaio',
    name: 'Kaio Santos',
    role: 'Operador',
    color: '#F97316',
    initials: 'KS',
  },
  dani: {
    id: 'dani',
    name: 'Dani Rocha',
    role: 'Operadora',
    color: '#06B6D4',
    initials: 'DR',
  },
  seu_antonio: {
    id: 'seu_antonio',
    name: 'Seu Antônio',
    role: 'Presidente da Coop. Vale Verde',
    color: '#84CC16',
    initials: 'SA',
  },
  sofia: {
    id: 'sofia',
    name: 'Sofia',
    role: 'Filha do Bruno',
    color: '#F472B6',
    initials: 'SF',
  },
  henrique: {
    id: 'henrique',
    name: 'Henrique Paes',
    role: 'Comprador Grupo Orbe',
    color: '#94A3B8',
    initials: 'HP',
  },
  narrador: {
    id: 'narrador',
    name: '',
    role: '',
    color: '#A1A1AA',
    initials: '—',
  },
};
