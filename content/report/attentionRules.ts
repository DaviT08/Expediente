import type { ProfileResult } from '@/lib/scoring';

export interface AttentionPoint {
  text: string;
  ementa: string;
}

const rate = (p: ProfileResult, s: keyof ProfileResult['subdimensions']) => {
  const d = p.subdimensions[s];
  return d.available > 0 ? d.chosen / d.available : 0;
};

// Regras da §8.4, aplicadas em ordem, no máximo 3
export function getAttentionPoints(p: ProfileResult): AttentionPoint[] {
  const out: AttentionPoint[] = [];
  const conf = p.subdimensions['INTER.CONF'];
  if (conf.available >= 5 && conf.chosen <= 1) {
    out.push({
      text: `Em divergências, você quase não escolheu enfrentar a conversa (${conf.chosen} de ${conf.available}). Conflito evitado costuma voltar maior.`,
      ementa: 'Conflito e negociação',
    });
  }
  if (rate(p, 'INTER.EMP') >= 0.5 && rate(p, 'INTER.COM') <= 0.2) {
    out.push({
      text: 'Você percebe bem o que os outros sentem, mas pouco escolheu dizer com clareza o que você pensa.',
      ementa: 'Comunicação',
    });
  }
  if (rate(p, 'INTRA.REG') <= 0.2) {
    out.push({
      text: 'Você raramente escolheu pausar antes de agir. Sob pressão, a primeira reação nem sempre é a melhor.',
      ementa: 'Emoções e estresse',
    });
  }
  if (p.intelligences.INTER.delta >= 15 && p.intelligences.INTRA.delta <= -10) {
    out.push({
      text: 'Você cuidou muito dos outros e pouco de si nesta semana.',
      ementa: 'Emoções; equilíbrio trabalho-vida',
    });
  }
  if (p.intelligences.INTRA.delta >= 15 && p.intelligences.INTER.delta <= -10) {
    out.push({
      text: 'Você olhou muito para dentro. Lembre que, no trabalho, as decisões também passam pelos outros.',
      ementa: 'Comportamento em grupo',
    });
  }
  if (rate(p, 'INTER.COL') <= 0.2) {
    out.push({
      text: 'Você tendeu a resolver sozinho(a). Em problemas complexos, juntar gente costuma render mais.',
      ementa: 'Equipes',
    });
  }
  return out.slice(0, 3);
}
