import { Tag, PNode } from '@/content/tags';
import { allStoryNodes } from '@/content/story';

export type TopLevelTag = 'LIN' | 'LOG' | 'ESP' | 'COR' | 'MUS' | 'NAT' | 'INTER' | 'INTRA';

export const TOP_LEVEL_TAGS: TopLevelTag[] = [
  'LIN', 'LOG', 'ESP', 'COR', 'MUS', 'NAT', 'INTER', 'INTRA'
];

export const SUBDIMENSIONS = [
  'INTER.EMP', 'INTER.COL', 'INTER.COM', 'INTER.CONF',
  'INTRA.REG', 'INTRA.AUTO', 'INTRA.MOT', 'INTRA.REF'
] as const;

export type SubdimensionTag = typeof SUBDIMENSIONS[number];

export function getTopLevelTag(tag: Tag): TopLevelTag {
  if (tag.startsWith('INTER.')) return 'INTER';
  if (tag.startsWith('INTRA.')) return 'INTRA';
  return tag as TopLevelTag;
}

export interface IntelligenceScore {
  tag: TopLevelTag;
  raw: number;
  max: number;
  score: number;
  base: number;
  delta: number;
  classification: 'top' | 'intermediate' | 'bottom';
}

export interface SubdimensionScore {
  tag: SubdimensionTag;
  raw: number;
  max: number;
  score: number;
  base: number;
  delta: number;
  available: number;
  chosen: number;
  ratioText: string;
}

export interface SnippetExample {
  decisionId: string;
  chosenOptionId: string;
  snippet: string;
  intelligence: TopLevelTag;
}

export interface ProfileResult {
  intelligences: Record<TopLevelTag, IntelligenceScore>;
  subdimensions: Record<SubdimensionTag, SubdimensionScore>;
  ranking: TopLevelTag[]; // ordenado por delta decrescente
  wellDistributed: boolean;
  topIntelligences: TopLevelTag[];
  bottomIntelligences: TopLevelTag[];
  answeredCount: number;
}

/**
 * Calcula o perfil de inteligências múltiplas no servidor (§6.2, §6.4).
 * Função pura e determinística que recebe a lista de escolhas da partida.
 */
export function calculateProfileScores(
  choices: { decision_id: string; option_id: string }[]
): ProfileResult {
  const answeredMap = new Map<string, string>();
  for (const c of choices) {
    answeredMap.set(c.decision_id, c.option_id);
  }

  // Filtrar todos os nós de decisão P
  const pNodes = allStoryNodes.filter(
    (n): n is PNode => n.kind === 'decision' && n.type === 'P'
  );

  const topAcc: Record<TopLevelTag, { raw: number; max: number; sumAvg: number }> = {
    LIN: { raw: 0, max: 0, sumAvg: 0 },
    LOG: { raw: 0, max: 0, sumAvg: 0 },
    ESP: { raw: 0, max: 0, sumAvg: 0 },
    COR: { raw: 0, max: 0, sumAvg: 0 },
    MUS: { raw: 0, max: 0, sumAvg: 0 },
    NAT: { raw: 0, max: 0, sumAvg: 0 },
    INTER: { raw: 0, max: 0, sumAvg: 0 },
    INTRA: { raw: 0, max: 0, sumAvg: 0 },
  };

  const subAcc: Record<
    SubdimensionTag,
    { raw: number; max: number; sumAvg: number; available: number; chosen: number }
  > = {
    'INTER.EMP': { raw: 0, max: 0, sumAvg: 0, available: 0, chosen: 0 },
    'INTER.COL': { raw: 0, max: 0, sumAvg: 0, available: 0, chosen: 0 },
    'INTER.COM': { raw: 0, max: 0, sumAvg: 0, available: 0, chosen: 0 },
    'INTER.CONF': { raw: 0, max: 0, sumAvg: 0, available: 0, chosen: 0 },
    'INTRA.REG': { raw: 0, max: 0, sumAvg: 0, available: 0, chosen: 0 },
    'INTRA.AUTO': { raw: 0, max: 0, sumAvg: 0, available: 0, chosen: 0 },
    'INTRA.MOT': { raw: 0, max: 0, sumAvg: 0, available: 0, chosen: 0 },
    'INTRA.REF': { raw: 0, max: 0, sumAvg: 0, available: 0, chosen: 0 },
  };

  let answeredPCount = 0;

  for (const node of pNodes) {
    const chosenOptionId = answeredMap.get(node.id);
    if (!chosenOptionId) {
      continue; // Não respondida ainda
    }

    const chosenOption = node.options.find((o) => o.id === chosenOptionId);
    if (!chosenOption) {
      continue;
    }

    answeredPCount++;

    // Pesos da opção escolhida
    const chosenTopWeight: Record<TopLevelTag, number> = {
      LIN: 0, LOG: 0, ESP: 0, COR: 0, MUS: 0, NAT: 0, INTER: 0, INTRA: 0,
    };
    const chosenSubWeight: Record<SubdimensionTag, number> = {
      'INTER.EMP': 0, 'INTER.COL': 0, 'INTER.COM': 0, 'INTER.CONF': 0,
      'INTRA.REG': 0, 'INTRA.AUTO': 0, 'INTRA.MOT': 0, 'INTRA.REF': 0,
    };

    for (const [tag, w] of Object.entries(chosenOption.tags) as [Tag, 1 | 2][]) {
      const top = getTopLevelTag(tag);
      chosenTopWeight[top] = (chosenTopWeight[top] || 0) + w;
      if (tag in chosenSubWeight) {
        chosenSubWeight[tag as SubdimensionTag] = (chosenSubWeight[tag as SubdimensionTag] || 0) + w;
      }
    }

    // Máximos e médias das opções da decisão
    const decTopMax: Record<TopLevelTag, number> = {
      LIN: 0, LOG: 0, ESP: 0, COR: 0, MUS: 0, NAT: 0, INTER: 0, INTRA: 0,
    };
    const decTopSum: Record<TopLevelTag, number> = {
      LIN: 0, LOG: 0, ESP: 0, COR: 0, MUS: 0, NAT: 0, INTER: 0, INTRA: 0,
    };
    const decSubMax: Record<SubdimensionTag, number> = {
      'INTER.EMP': 0, 'INTER.COL': 0, 'INTER.COM': 0, 'INTER.CONF': 0,
      'INTRA.REG': 0, 'INTRA.AUTO': 0, 'INTRA.MOT': 0, 'INTRA.REF': 0,
    };
    const decSubSum: Record<SubdimensionTag, number> = {
      'INTER.EMP': 0, 'INTER.COL': 0, 'INTER.COM': 0, 'INTER.CONF': 0,
      'INTRA.REG': 0, 'INTRA.AUTO': 0, 'INTRA.MOT': 0, 'INTRA.REF': 0,
    };

    // Verificar disponibilidade de subdimensões nesta decisão (tag principal peso 2)
    for (const sub of SUBDIMENSIONS) {
      const hasMain = node.options.some((o) => (o.tags as any)[sub] === 2);
      if (hasMain) {
        subAcc[sub].available++;
        if ((chosenOption.tags as any)[sub] === 2) {
          subAcc[sub].chosen++;
        }
      }
    }

    for (const opt of node.options) {
      const optTop: Record<TopLevelTag, number> = {
        LIN: 0, LOG: 0, ESP: 0, COR: 0, MUS: 0, NAT: 0, INTER: 0, INTRA: 0,
      };
      const optSub: Record<SubdimensionTag, number> = {
        'INTER.EMP': 0, 'INTER.COL': 0, 'INTER.COM': 0, 'INTER.CONF': 0,
        'INTRA.REG': 0, 'INTRA.AUTO': 0, 'INTRA.MOT': 0, 'INTRA.REF': 0,
      };

      for (const [tag, w] of Object.entries(opt.tags) as [Tag, 1 | 2][]) {
        const top = getTopLevelTag(tag);
        optTop[top] = (optTop[top] || 0) + w;
        if (tag in optSub) {
          optSub[tag as SubdimensionTag] = (optSub[tag as SubdimensionTag] || 0) + w;
        }
      }

      for (const t of TOP_LEVEL_TAGS) {
        decTopMax[t] = Math.max(decTopMax[t], optTop[t]);
        decTopSum[t] += optTop[t];
      }
      for (const s of SUBDIMENSIONS) {
        decSubMax[s] = Math.max(decSubMax[s], optSub[s]);
        decSubSum[s] += optSub[s];
      }
    }

    const nOpt = node.options.length;
    for (const t of TOP_LEVEL_TAGS) {
      topAcc[t].raw += chosenTopWeight[t];
      topAcc[t].max += decTopMax[t];
      topAcc[t].sumAvg += decTopSum[t] / nOpt;
    }
    for (const s of SUBDIMENSIONS) {
      subAcc[s].raw += chosenSubWeight[s];
      subAcc[s].max += decSubMax[s];
      subAcc[s].sumAvg += decSubSum[s] / nOpt;
    }
  }

  // Montar pontuação final por inteligência
  const intelligences = {} as Record<TopLevelTag, IntelligenceScore>;
  const deltas: number[] = [];

  for (const t of TOP_LEVEL_TAGS) {
    const { raw, max, sumAvg } = topAcc[t];
    const score = max > 0 ? Math.round((100 * raw) / max) : 0;
    const base = max > 0 ? Math.round((100 * sumAvg) / max) : 0;
    const delta = score - base;
    deltas.push(delta);

    let classification: 'top' | 'intermediate' | 'bottom';
    if (delta >= 15) {
      classification = 'top';
    } else if (delta <= -10) {
      classification = 'bottom';
    } else {
      classification = 'intermediate';
    }

    intelligences[t] = {
      tag: t,
      raw,
      max,
      score,
      base,
      delta,
      classification,
    };
  }

  // Ordenar por delta descrescente (§6.2: "A ordenação do perfil usa delta_i, não score_i")
  const ranking = [...TOP_LEVEL_TAGS].sort((a, b) => {
    const diff = intelligences[b].delta - intelligences[a].delta;
    if (diff !== 0) return diff;
    return intelligences[b].score - intelligences[a].score;
  });

  const maxDelta = Math.max(...deltas);
  const minDelta = Math.min(...deltas);
  const wellDistributed = (maxDelta - minDelta) < 20;

  // Subdimensões
  const subdimensions = {} as Record<SubdimensionTag, SubdimensionScore>;
  for (const s of SUBDIMENSIONS) {
    const { raw, max, sumAvg, available, chosen } = subAcc[s];
    const score = max > 0 ? Math.round((100 * raw) / max) : 0;
    const base = max > 0 ? Math.round((100 * sumAvg) / max) : 0;
    const delta = score - base;
    const ratioText = `${chosen} de ${available} vezes`;

    subdimensions[s] = {
      tag: s,
      raw,
      max,
      score,
      base,
      delta,
      available,
      chosen,
      ratioText,
    };
  }

  return {
    intelligences,
    subdimensions,
    ranking,
    wellDistributed,
    topIntelligences: ranking.slice(0, 3),
    bottomIntelligences: ranking.slice(-3).reverse(),
    answeredCount: answeredPCount,
  };
}
