import { allStoryNodes } from '@/content/story';
import type { PNode, Tag, Var, Flag } from '@/content/tags';
import {
  calculateProfileScores,
  getTopLevelTag,
  SUBDIMENSIONS,
  TOP_LEVEL_TAGS,
  type ProfileResult,
  type SubdimensionTag,
  type TopLevelTag,
} from '@/lib/scoring';
import { calculateEnding, type EndingResult } from '@/lib/endings';
import { getAttentionPoints, type AttentionPoint } from '@/content/report/attentionRules';
import { PRACTICES } from '@/content/report/practices';
import { CHAPTER_DAY, INTELLIGENCE_INFO, SUBDIMENSION_INFO } from '@/content/report/texts';

const pNodes = allStoryNodes.filter((n): n is PNode => n.kind === 'decision' && n.type === 'P');

function primaryTops(tags: Partial<Record<Tag, 1 | 2>>): TopLevelTag[] {
  return (Object.entries(tags) as [Tag, number][])
    .filter(([, w]) => w === 2)
    .map(([t]) => getTopLevelTag(t));
}

export interface TopItem {
  tag: TopLevelTag;
  delta: number;
  example: string | null;
}

export interface DevelopItem {
  tag: TopLevelTag;
  delta: number;
  missed: { day: string; missedText: string; chosenText: string } | null;
  practices: [string, string];
  practicesBase: string;
  practicesFocus: string | null; // subdimensão usada para INTER/INTRA
  ementa: string;
}

export interface MirrorGap {
  tag: TopLevelTag;
  kind: 'seesMore' | 'seesLess';
}

export interface ReportData {
  profile: ProfileResult;
  ending: EndingResult;
  top: TopItem[];
  develop: DevelopItem[];
  attention: AttentionPoint[];
  mirrorGaps: MirrorGap[];
}

function topExample(tag: TopLevelTag, answered: Record<string, string>): string | null {
  for (const node of pNodes) {
    const opt = node.options.find((o) => o.id === answered[node.id]);
    if (opt && primaryTops(opt.tags).includes(tag)) return opt.reportSnippet;
  }
  return null;
}

function missedExample(tag: TopLevelTag, answered: Record<string, string>, used: Set<string>) {
  for (const node of pNodes) {
    if (used.has(node.id)) continue;
    const chosen = node.options.find((o) => o.id === answered[node.id]);
    if (!chosen || primaryTops(chosen.tags).includes(tag)) continue;
    const missed = node.options.find((o) => primaryTops(o.tags).includes(tag));
    if (missed) {
      used.add(node.id);
      return {
        day: CHAPTER_DAY[node.chapter] ?? 'Durante a semana',
        missedText: missed.text,
        chosenText: chosen.text,
      };
    }
  }
  return null;
}

function weakestSub(profile: ProfileResult, group: 'INTER' | 'INTRA'): SubdimensionTag {
  const subs = SUBDIMENSIONS.filter((s) => s.startsWith(group + '.'));
  return [...subs].sort((a, b) => {
    const ra = profile.subdimensions[a].available ? profile.subdimensions[a].chosen / profile.subdimensions[a].available : 1;
    const rb = profile.subdimensions[b].available ? profile.subdimensions[b].chosen / profile.subdimensions[b].available : 1;
    return ra - rb;
  })[0];
}

function rankPositions(values: Record<TopLevelTag, number>): Record<TopLevelTag, number> {
  // posição média para empates (1 = maior)
  const sorted = [...TOP_LEVEL_TAGS].sort((a, b) => values[b] - values[a]);
  const pos = {} as Record<TopLevelTag, number>;
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && values[sorted[j + 1]] === values[sorted[i]]) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) pos[sorted[k]] = avg;
    i = j + 1;
  }
  return pos;
}

export function buildReport(
  answered: Record<string, string>,
  vars: Record<Var, number>,
  flags: Record<Flag, boolean>,
  mirror: Record<string, number> | null
): ReportData {
  const profile = calculateProfileScores(
    Object.entries(answered).map(([decision_id, option_id]) => ({ decision_id, option_id }))
  );
  const ending = calculateEnding(vars, flags);

  const top: TopItem[] = profile.ranking
    .filter((t) => profile.intelligences[t].delta > 0)
    .slice(0, 3)
    .map((t) => ({ tag: t, delta: profile.intelligences[t].delta, example: topExample(t, answered) }));

  const usedDecisions = new Set<string>();
  const develop: DevelopItem[] = [...profile.ranking]
    .reverse()
    .slice(0, 3)
    .map((t) => {
      let key: keyof typeof PRACTICES;
      let focus: string | null = null;
      if (t === 'INTER' || t === 'INTRA') {
        const s = weakestSub(profile, t);
        key = s;
        focus = SUBDIMENSION_INFO[s].name;
      } else {
        key = t;
      }
      return {
        tag: t,
        delta: profile.intelligences[t].delta,
        missed: missedExample(t, answered, usedDecisions),
        practices: PRACTICES[key].items,
        practicesBase: PRACTICES[key].base,
        practicesFocus: focus,
        ementa: INTELLIGENCE_INFO[t].ementa,
      };
    });

  const mirrorGaps: MirrorGap[] = [];
  if (mirror) {
    const self = {} as Record<TopLevelTag, number>;
    const deltas = {} as Record<TopLevelTag, number>;
    for (const t of TOP_LEVEL_TAGS) {
      self[t] = mirror[t] ?? 3;
      deltas[t] = profile.intelligences[t].delta;
    }
    const ps = rankPositions(self);
    const pd = rankPositions(deltas);
    const gaps = TOP_LEVEL_TAGS.map((t) => ({ t, diff: pd[t] - ps[t] }))
      .filter((g) => Math.abs(g.diff) >= 3)
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
      .slice(0, 2);
    for (const g of gaps) {
      mirrorGaps.push({ tag: g.t, kind: g.diff > 0 ? 'seesMore' : 'seesLess' });
    }
  }

  return { profile, ending, top, develop, attention: getAttentionPoints(profile), mirrorGaps };
}
