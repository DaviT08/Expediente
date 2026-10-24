import { allStoryNodes } from '@/content/story';
import type { KNode, PNode } from '@/content/tags';
import { calculateEnding, type EndingId } from '@/lib/endings';
import { calculateProfileScores, TOP_LEVEL_TAGS, type ProfileResult, type TopLevelTag } from '@/lib/scoring';
import type { ChoiceRecord, RunRecord } from '@/lib/supabase/types';

// Cálculos do painel do professor (visão da turma, decisões e CSV).
// Tudo é recalculado a partir das escolhas gravadas em cada partida.

export const OBVIOUS_PCT = 70; // opção de perfil escolhida por mais de 70%…
export const OBVIOUS_MIN_N = 15; // …com pelo menos 15 respostas (GDD §6.6)

function answeredOf(run: RunRecord): Record<string, string> {
  return run.state?.answered ?? {};
}

export function profileOf(run: RunRecord): ProfileResult | null {
  const answered = answeredOf(run);
  if (Object.keys(answered).length === 0) return null;
  return calculateProfileScores(
    Object.entries(answered).map(([decision_id, option_id]) => ({ decision_id, option_id }))
  );
}

export function durationMs(run: RunRecord): number | null {
  if (run.status !== 'completed') return null;
  if (run.total_ms) return run.total_ms;
  if (run.completed_at && run.started_at) {
    return new Date(run.completed_at).getTime() - new Date(run.started_at).getTime();
  }
  return null;
}

export function endingOf(run: RunRecord): EndingId | null {
  if (run.status !== 'completed') return null;
  if (run.ending) return run.ending;
  if (run.state?.vars && run.state?.flags) return calculateEnding(run.state.vars, run.state.flags).ending;
  return null;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const v = [...values].sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : Math.round((v[mid - 1] + v[mid]) / 2);
}

// Formas de agir mais e menos escolhidas (só as que se afastam do acaso)
export function topAndBottom(profile: ProfileResult | null): { top: TopLevelTag[]; bottom: TopLevelTag[] } {
  if (!profile) return { top: [], bottom: [] };
  const top = profile.ranking.filter((t) => profile.intelligences[t].delta > 0).slice(0, 3);
  const bottom = [...profile.ranking]
    .reverse()
    .filter((t) => profile.intelligences[t].delta < 0)
    .slice(0, 3);
  return { top, bottom };
}

export interface ClassOverview {
  cards: {
    started: number;
    completed: number;
    inProgress: number;
    completionRate: number;
    medianDurationMs: number | null;
  };
  endings: Record<EndingId, number>;
  averageProfile: { tag: TopLevelTag; score: number; base: number; delta: number }[] | null;
  rows: {
    id: string;
    name: string;
    status: RunRecord['status'];
    ending: EndingId | null;
    top: TopLevelTag[];
    bottom: TopLevelTag[];
    durationMs: number | null;
    startedAt: string;
  }[];
  decisions: DecisionStat[];
}

export interface DecisionStat {
  id: string;
  type: 'P' | 'K' | 'N';
  chapter: number;
  prompt: string;
  total: number;
  options: { id: string; text: string; count: number; pct: number; obvious: boolean }[];
}

const decisionNodes = allStoryNodes.filter(
  (n): n is PNode | KNode => n.kind === 'decision'
);

export function computeOverview(runs: RunRecord[]): ClassOverview {
  const completed = runs.filter((r) => r.status === 'completed');
  const inProgress = runs.filter((r) => r.status === 'in_progress').length;

  const endings: Record<EndingId, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const r of completed) {
    const e = endingOf(r);
    if (e) endings[e]++;
  }

  // Perfil médio: só partidas concluídas
  const profiles = completed.map(profileOf).filter((p): p is ProfileResult => p !== null);
  const averageProfile =
    profiles.length === 0
      ? null
      : TOP_LEVEL_TAGS.map((tag) => {
          const avg = (f: (p: ProfileResult) => number) =>
            Math.round(profiles.reduce((s, p) => s + f(p), 0) / profiles.length);
          return {
            tag,
            score: avg((p) => p.intelligences[tag].score),
            base: avg((p) => p.intelligences[tag].base),
            delta: avg((p) => p.intelligences[tag].delta),
          };
        });

  const rows = runs.map((r) => {
    const { top, bottom } = r.status === 'completed' ? topAndBottom(profileOf(r)) : { top: [], bottom: [] };
    return {
      id: r.id,
      name: r.player_name,
      status: r.status,
      ending: endingOf(r),
      top,
      bottom,
      durationMs: durationMs(r),
      startedAt: r.started_at,
    };
  });

  // Frequência de cada opção (todas as partidas, inclusive em andamento)
  const decisions: DecisionStat[] = decisionNodes.map((node) => {
    const counts = new Map<string, number>();
    for (const r of runs) {
      const opt = answeredOf(r)[node.id];
      if (opt) counts.set(opt, (counts.get(opt) ?? 0) + 1);
    }
    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    return {
      id: node.id,
      type: node.type,
      chapter: node.chapter,
      prompt: node.prompt,
      total,
      options: (node.options as { id: string; text: string }[]).map((o) => {
        const count = counts.get(o.id) ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return {
          id: o.id,
          text: o.text,
          count,
          pct,
          // Só decisões de perfil (P) entram no alerta: nelas nenhuma opção deveria parecer "a certa".
          obvious: node.type === 'P' && total >= OBVIOUS_MIN_N && pct > OBVIOUS_PCT,
        };
      }),
    };
  });

  return {
    cards: {
      started: runs.length,
      completed: completed.length,
      inProgress,
      completionRate: runs.length > 0 ? Math.round((completed.length / runs.length) * 100) : 0,
      medianDurationMs: median(completed.map(durationMs).filter((d): d is number => d !== null)),
    },
    endings,
    averageProfile,
    rows,
    decisions,
  };
}

// ---------- CSV (abre direto no Excel em português: separador ";" e BOM UTF-8) ----------

function cell(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(header: string[], rows: unknown[][]): string {
  return '﻿' + [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n') + '\r\n';
}

const STATUS_PT: Record<string, string> = {
  in_progress: 'em andamento',
  completed: 'concluída',
  abandoned: 'abandonada',
};

function dateBR(iso?: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

export function runsCsv(runs: RunRecord[]): string {
  const header = [
    'aluno',
    'turma',
    'status',
    'final',
    'coesao',
    'negociacao',
    'LB',
    'BR',
    'RL',
    'COOP',
    'mais_escolheu',
    'menos_escolheu',
    'inicio',
    'conclusao',
    'duracao_min',
    'decisoes_respondidas',
    ...TOP_LEVEL_TAGS.flatMap((t) => [`${t}_pontuacao`, `${t}_acaso`, `${t}_delta`]),
    ...TOP_LEVEL_TAGS.map((t) => `${t}_espelho`),
    'id_partida',
  ];
  const rows: unknown[][] = runs.map((r) => {
    const profile = profileOf(r);
    const { top, bottom } = r.status === 'completed' ? topAndBottom(profile) : { top: [], bottom: [] };
    const end = r.state?.vars && r.state?.flags ? calculateEnding(r.state.vars, r.state.flags) : null;
    const d = durationMs(r);
    return [
      r.player_name,
      r.class_code ?? '',
      STATUS_PT[r.status] ?? r.status,
      endingOf(r) ?? '',
      end?.coesao ?? '',
      end?.negociacao ?? '',
      r.state?.vars?.LB ?? '',
      r.state?.vars?.BR ?? '',
      r.state?.vars?.RL ?? '',
      r.state?.vars?.COOP ?? '',
      top.join(' '),
      bottom.join(' '),
      dateBR(r.started_at),
      dateBR(r.completed_at),
      d !== null ? Math.round(d / 60000) : '',
      Object.keys(r.state?.answered ?? {}).length,
      ...TOP_LEVEL_TAGS.flatMap((t): (number | string)[] =>
        profile ? [profile.intelligences[t].score, profile.intelligences[t].base, profile.intelligences[t].delta] : ['', '', '']
      ),
      ...TOP_LEVEL_TAGS.map((t) => r.mirror?.[t] ?? ''),
      r.id,
    ];
  });
  return toCsv(header, rows);
}

export function choicesCsv(runs: RunRecord[], choices: ChoiceRecord[]): string {
  const byId = new Map(runs.map((r) => [r.id, r]));
  const nodes = new Map(decisionNodes.map((n) => [n.id, n]));
  const header = [
    'aluno',
    'turma',
    'dia',
    'decisao',
    'tipo',
    'pergunta',
    'opcao',
    'texto_opcao',
    'tags',
    'tempo_resposta_s',
    'tempo_esgotado',
    'momento',
    'id_partida',
  ];
  const sorted = [...choices].sort((a, b) => {
    const na = byId.get(a.run_id)?.player_name ?? '';
    const nb = byId.get(b.run_id)?.player_name ?? '';
    return na.localeCompare(nb, 'pt-BR') || a.run_id.localeCompare(b.run_id) || a.chosen_at.localeCompare(b.chosen_at);
  });
  const rows = sorted.map((c) => {
    const run = byId.get(c.run_id);
    const node = nodes.get(c.decision_id);
    const opt = node?.options.find((o) => o.id === c.option_id) as
      | { text: string; tags?: Record<string, number> }
      | undefined;
    return [
      run?.player_name ?? '',
      run?.class_code ?? '',
      node?.chapter ?? '',
      c.decision_id,
      c.decision_type,
      node?.prompt ?? '',
      c.option_id,
      opt?.text ?? '',
      opt?.tags ? Object.entries(opt.tags).map(([k, w]) => (w === 2 ? k : `${k}(sec)`)).join(' ') : '',
      typeof c.response_ms === 'number' ? (c.response_ms / 1000).toFixed(1).replace('.', ',') : '',
      c.timed_out ? 'sim' : 'não',
      dateBR(c.chosen_at),
      c.run_id,
    ];
  });
  return toCsv(header, rows);
}
