'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/engine/store';
import { buildReport } from '@/lib/report';
import { SUBDIMENSIONS } from '@/lib/scoring';
import RadarChart from '@/components/report/RadarChart';
import {
  ENDING_NAMES,
  INTELLIGENCE_INFO,
  LIMITS_TEXT,
  MIRROR_CLOSING,
  SUBDIMENSION_INFO,
  WELL_DISTRIBUTED_TEXT,
} from '@/content/report/texts';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-[#221F33] print:bg-white border border-slate-700 print:border-slate-300 rounded-xl p-5 sm:p-6 space-y-4">
      <h2 className="text-xl sm:text-2xl font-pixel text-[#E0A526] print:text-[#8a5f00] tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

function subPhrase(rate: number, meaning: string) {
  if (rate >= 0.5) return `Você escolheu ${meaning} com frequência.`;
  if (rate > 0.2) return `Você escolheu ${meaning} algumas vezes.`;
  return `Você quase não escolheu ${meaning}.`;
}

export default function RelatorioPage() {
  const router = useRouter();
  const { runId, loadSavedGame, playerName, answered, vars, flags, mirror, completedAt, clearSavedGame, initGame } =
    useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!runId && !loadSavedGame()) router.push('/');
  }, [runId, loadSavedGame, router]);

  const report = useMemo(
    () => (runId ? buildReport(answered, vars, flags, mirror) : null),
    [runId, answered, vars, flags, mirror]
  );

  if (!mounted || !report) return null;
  if (!mirror) {
    router.push('/espelho');
    return null;
  }

  const { profile, ending, top, develop, attention, mirrorGaps } = report;
  const date = new Date(completedAt || Date.now()).toLocaleDateString('pt-BR');

  const playAgain = () => {
    const name = playerName;
    clearSavedGame();
    initGame(name, '');
    router.push('/jogar');
  };

  return (
    <main className="min-h-screen bg-[#14121F] print:bg-white text-[#F2EFE6] print:text-black flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl space-y-5">
        {/* 1. Cabeçalho */}
        <header className="text-center space-y-2 pb-2">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 print:text-slate-600 font-mono">
            Expediente · Mapa de preferências
          </p>
          <h1 className="text-3xl sm:text-4xl font-pixel text-[#E0A526] print:text-black">{playerName}</h1>
          <p className="text-slate-300 print:text-slate-700">
            {date} · Final {ending.ending}: <strong>{ENDING_NAMES[ending.ending]}</strong>
          </p>
        </header>

        <div className="print:hidden bg-[#E0A526]/10 border border-[#E0A526] rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <p className="text-sm">Salve este relatório em PDF para guardar ou entregar.</p>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 bg-[#E0A526] text-[#14121F] font-bold rounded-lg font-mono uppercase tracking-wider hover:bg-[#E0A526]/90"
          >
            Salvar em PDF
          </button>
        </div>

        {/* 2. Mapa */}
        <Section title="Seu mapa de preferências">
          <RadarChart profile={profile} />
          {profile.wellDistributed && (
            <p className="text-sm bg-[#14121F] print:bg-slate-100 border border-slate-700 print:border-slate-300 rounded p-3">
              {WELL_DISTRIBUTED_TEXT}
            </p>
          )}
        </Section>

        {/* 3. Mais escolhidas */}
        <Section title="As formas de agir que você mais escolheu">
          {top.length === 0 ? (
            <p>Nenhuma forma de agir ficou acima do que se esperaria ao acaso.</p>
          ) : (
            <ul className="space-y-4">
              {top.map((t) => (
                <li key={t.tag} className="border-l-4 border-[#E0A526] pl-4 space-y-1 break-inside-avoid">
                  <p className="font-bold text-lg">
                    {INTELLIGENCE_INFO[t.tag].name}{' '}
                    <span className="text-sm font-normal text-slate-400 print:text-slate-600">
                      (+{t.delta} acima do acaso{t.delta < 15 ? ', diferença pequena' : ''})
                    </span>
                  </p>
                  <p className="text-slate-300 print:text-slate-700">{INTELLIGENCE_INFO[t.tag].definition}</p>
                  {t.example && <p className="italic">“{t.example}”</p>}
                  <p className="text-sm text-slate-400 print:text-slate-600">{INTELLIGENCE_INFO[t.tag].strength}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* 4. Inter e intra em detalhe */}
        <Section title="Interpessoal e intrapessoal em detalhe">
          <ul className="space-y-3">
            {SUBDIMENSIONS.map((s) => {
              const d = profile.subdimensions[s];
              const rate = d.available ? d.chosen / d.available : 0;
              return (
                <li key={s}>
                  <div className="flex justify-between text-sm font-semibold gap-2">
                    <span>{SUBDIMENSION_INFO[s].name}</span>
                    <span className="font-mono whitespace-nowrap">{d.ratioText}</span>
                  </div>
                  <div className="h-3 bg-[#14121F] print:bg-slate-200 rounded mt-1 overflow-hidden">
                    <div
                      className={`h-full ${s.startsWith('INTER') ? 'bg-[#2B7A8C]' : 'bg-[#8E6CC4]'}`}
                      style={{ width: `${Math.round(rate * 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400 print:text-slate-600 mt-1">
                    {subPhrase(rate, SUBDIMENSION_INFO[s].meaning)}
                  </p>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* 5. O que desenvolver */}
        <Section title="O que desenvolver">
          <p className="text-sm text-slate-400 print:text-slate-600">
            Não há escolhas erradas. Estas são as formas de agir que você menos escolheu, e por isso são as que mais têm a
            ganhar com prática.
          </p>
          <ul className="space-y-5">
            {develop.map((d) => (
              <li key={d.tag} className="border-l-4 border-[#8E6CC4] pl-4 space-y-2 break-inside-avoid">
                <p className="font-bold text-lg">
                  {INTELLIGENCE_INFO[d.tag].name}
                  {d.practicesFocus && (
                    <span className="text-sm font-normal text-slate-400 print:text-slate-600"> · foco: {d.practicesFocus}</span>
                  )}
                </p>
                <p className="text-slate-300 print:text-slate-700">{INTELLIGENCE_INFO[d.tag].definition}</p>
                {d.missed && (
                  <p>
                    {d.missed.day}, havia a opção de <em>“{d.missed.missedText}”</em>. Você escolheu{' '}
                    <em>“{d.missed.chosenText}”</em>.
                  </p>
                )}
                <div>
                  <p className="text-sm font-semibold">Para praticar:</p>
                  <ul className="list-disc pl-5 text-sm space-y-0.5">
                    <li>{d.practices[0]}</li>
                    <li>{d.practices[1]}</li>
                  </ul>
                  <p className="text-xs text-slate-500 mt-1">Base: {d.practicesBase}</p>
                </div>
                <p className="text-sm">
                  <span className="font-semibold">Conexão com a disciplina:</span> {d.ementa}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {/* 6. Pontos de atenção */}
        {attention.length > 0 && (
          <Section title="Pontos de atenção">
            <ul className="space-y-3">
              {attention.map((a, i) => (
                <li key={i} className="space-y-0.5">
                  <p>{a.text}</p>
                  <p className="text-xs text-slate-500">Conexão com a disciplina: {a.ementa}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 7. Espelho */}
        <Section title="Espelho: como você se vê × o que escolheu">
          {mirrorGaps.length === 0 ? (
            <p>Sua autoavaliação ficou próxima do que suas escolhas mostraram.</p>
          ) : (
            <ul className="space-y-2">
              {mirrorGaps.map((g) => (
                <li key={g.tag}>
                  {g.kind === 'seesMore'
                    ? `Você se vê como alguém que usa bastante a forma ${INTELLIGENCE_INFO[g.tag].name.toLowerCase()}, mas nas suas escolhas ela apareceu pouco.`
                    : `Suas escolhas mostraram mais da forma ${INTELLIGENCE_INFO[g.tag].name.toLowerCase()} do que você se atribui. Vale reparar.`}
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm italic text-slate-400 print:text-slate-600">{MIRROR_CLOSING}</p>
        </Section>

        {/* 8. Limites (obrigatório) */}
        <Section title="Como ler este mapa">
          <p className="text-sm leading-relaxed">{LIMITS_TEXT}</p>
        </Section>

        {/* 9. Ações */}
        <div className="print:hidden grid sm:grid-cols-3 gap-3 pb-8">
          <button
            onClick={() => window.print()}
            className="py-3 bg-[#E0A526] text-[#14121F] font-bold rounded-lg font-mono uppercase tracking-wider"
          >
            Salvar em PDF
          </button>
          <button
            onClick={playAgain}
            className="py-3 bg-[#14121F] border border-slate-600 rounded-lg font-mono uppercase tracking-wider hover:border-[#E0A526]"
          >
            Jogar de novo
          </button>
          <button
            onClick={() => router.push('/')}
            className="py-3 bg-[#14121F] border border-slate-600 rounded-lg font-mono uppercase tracking-wider hover:border-[#E0A526]"
          >
            Início
          </button>
        </div>
      </div>
    </main>
  );
}
