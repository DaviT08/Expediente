'use client';

import React, { useMemo, useState } from 'react';
import RadarChart from '@/components/report/RadarChart';
import { ENDING_NAMES, INTELLIGENCE_INFO } from '@/content/report/texts';
import type { ProfileResult, TopLevelTag } from '@/lib/scoring';
import type { ClassOverview as Overview } from '@/lib/professorStats';

interface Props {
  data: Overview;
  onOpenRun: (runId: string) => void;
}

const STATUS_PT: Record<string, string> = {
  in_progress: 'Em andamento',
  completed: 'Concluída',
  abandoned: 'Abandonada',
};

function fmtDuration(ms: number | null): string {
  if (ms === null) return '—';
  const min = Math.round(ms / 60000);
  return `${min} min`;
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

const shortName = (t: TopLevelTag) => INTELLIGENCE_INFO[t].short;

function Card({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-4">
      <p className="text-xs uppercase font-mono text-slate-400 font-semibold tracking-wider">{label}</p>
      <p className="text-3xl font-pixel text-[#F2EFE6] mt-2">{value}</p>
      {hint && <p className="text-[11px] font-mono text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

// Visão da turma (GDD §9.2): cartões, finais, perfil médio e tabela sem ranking
export default function ClassOverview({ data, onOpenRun }: Props) {
  const [sort, setSort] = useState<'name' | 'date'>('date');

  const rows = useMemo(() => {
    const r = [...data.rows];
    if (sort === 'name') r.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    else r.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    return r;
  }, [data.rows, sort]);

  // O radar reaproveita o componente do relatório com as médias da turma
  const avgProfile = useMemo(() => {
    if (!data.averageProfile) return null;
    const intelligences = Object.fromEntries(
      data.averageProfile.map((p) => [p.tag, { tag: p.tag, raw: 0, max: 0, score: p.score, base: p.base, delta: p.delta, classification: 'intermediate' }])
    );
    return { intelligences } as unknown as ProfileResult;
  }, [data.averageProfile]);

  const totalEndings = Object.values(data.endings).reduce((a, b) => a + b, 0);
  const durationOk =
    data.cards.medianDurationMs === null
      ? undefined
      : data.cards.medianDurationMs < 25 * 60000
      ? 'abaixo da meta de 25–35 min'
      : data.cards.medianDurationMs > 35 * 60000
      ? 'acima da meta de 25–35 min'
      : 'dentro da meta de 25–35 min';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card label="Iniciadas" value={data.cards.started} hint={`${data.cards.inProgress} em andamento`} />
        <Card label="Concluídas" value={data.cards.completed} />
        <Card label="Taxa de conclusão" value={`${data.cards.completionRate}%`} />
        <Card label="Duração mediana" value={fmtDuration(data.cards.medianDurationMs)} hint={durationOk} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição dos finais */}
        <section className="bg-[#221F33] border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h2 className="text-xl font-pixel text-[#E0A526]">Distribuição dos finais</h2>
          {totalEndings === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma partida concluída ainda.</p>
          ) : (
            <ul className="space-y-3">
              {(['A', 'B', 'C', 'D'] as const).map((e) => {
                const n = data.endings[e];
                const pct = Math.round((n / totalEndings) * 100);
                return (
                  <li key={e}>
                    <div className="flex justify-between text-sm gap-2">
                      <span>
                        <b>Final {e}</b> · {ENDING_NAMES[e]}
                      </span>
                      <span className="font-mono text-slate-300 whitespace-nowrap">
                        {n} · {pct}%
                      </span>
                    </div>
                    <div className="h-3 bg-[#14121F] rounded mt-1 overflow-hidden">
                      <div className="h-full bg-[#2B7A8C]" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Perfil médio */}
        <section className="bg-[#221F33] border border-slate-700/80 rounded-xl p-5 space-y-3">
          <h2 className="text-xl font-pixel text-[#E0A526]">Perfil médio da turma</h2>
          <p className="text-xs bg-[#14121F] border border-slate-700 rounded p-2 text-slate-300">
            Descreve o grupo, não indivíduos. Só entram partidas concluídas.
          </p>
          {avgProfile && data.averageProfile ? (
            <>
              <RadarChart profile={avgProfile} group />
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
                {data.averageProfile.map((p) => (
                  <li key={p.tag} className="flex justify-between">
                    <span className="text-slate-300">{INTELLIGENCE_INFO[p.tag].name}</span>
                    <span className={p.delta >= 0 ? 'text-emerald-300' : 'text-amber-300'}>
                      {p.delta > 0 ? '+' : ''}
                      {p.delta} vs. acaso
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-slate-400">Aparece quando houver partidas concluídas.</p>
          )}
        </section>
      </div>

      {/* Tabela: ordena só por nome ou data (sem ranking) */}
      <section className="bg-[#221F33] border border-slate-700/80 rounded-xl p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-pixel text-[#E0A526]">Alunos</h2>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Ordenar por:</span>
            {(['date', 'name'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`px-2.5 py-1 rounded border ${
                  sort === k ? 'bg-[#E0A526] text-[#14121F] border-[#E0A526] font-bold' : 'border-slate-700 text-slate-300'
                }`}
              >
                {k === 'date' ? 'Data' : 'Nome'}
              </button>
            ))}
          </div>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma partida registrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase font-mono text-slate-400 border-b border-slate-700">
                  <th className="py-2 pr-3">Aluno</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Final</th>
                  <th className="py-2 pr-3">Mais escolheu</th>
                  <th className="py-2 pr-3">Menos escolheu</th>
                  <th className="py-2 pr-3">Duração</th>
                  <th className="py-2">Início</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => onOpenRun(r.id)}
                    className="border-b border-slate-800 hover:bg-[#14121F] cursor-pointer"
                    title="Abrir a partida"
                  >
                    <td className="py-2 pr-3 font-semibold">{r.name}</td>
                    <td className="py-2 pr-3">{STATUS_PT[r.status] ?? r.status}</td>
                    <td className="py-2 pr-3">{r.ending ?? '—'}</td>
                    <td className="py-2 pr-3 text-emerald-300">{r.top.map(shortName).join(', ') || '—'}</td>
                    <td className="py-2 pr-3 text-amber-300">{r.bottom.map(shortName).join(', ') || '—'}</td>
                    <td className="py-2 pr-3 font-mono">{fmtDuration(r.durationMs)}</td>
                    <td className="py-2 font-mono text-slate-400">{fmtDate(r.startedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
