'use client';

import React from 'react';
import type { RunRecord } from '@/lib/supabase/types';
import { ENDING_NAMES } from '@/content/report/texts';
import { COESAO_MIN, NEGOCIACAO_MIN } from '@/content/config';

interface PlayerStateCardProps {
  run: RunRecord;
}

export default function PlayerStateCard({ run }: PlayerStateCardProps) {
  const vars = run.state?.vars || { LB: 0, BR: 0, RL: 0, COOP: 0 };
  const flags = run.state?.flags || {
    F_DADOS: false,
    F_VOZ: false,
    F_SOFIA: false,
    F_SEGREDO: false,
    F_LIA_GUARDOU: false,
    K2_A: false,
  };

  const lb = Math.max(-3, Math.min(3, vars.LB ?? 0));
  const br = Math.max(-3, Math.min(3, vars.BR ?? 0));
  const rl = Math.max(-3, Math.min(3, vars.RL ?? 0));
  const coop = vars.COOP ?? 0;
  const coesao = lb + br + rl;

  const fDados = !!flags.F_DADOS;
  const fVoz = !!flags.F_VOZ;
  const negociacao = (fDados ? 1 : 0) + (fVoz ? 1 : 0) + (coop >= 2 ? 1 : 0);

  // Projeção do final (§7.1)
  let projectedEnding: 'A' | 'B' | 'C' | 'D' = 'D';
  if (coesao >= COESAO_MIN && negociacao >= NEGOCIACAO_MIN) {
    projectedEnding = 'A';
  } else if (coesao < COESAO_MIN && negociacao >= NEGOCIACAO_MIN) {
    projectedEnding = 'B';
  } else if (coesao >= COESAO_MIN && negociacao < NEGOCIACAO_MIN) {
    projectedEnding = 'C';
  } else {
    projectedEnding = 'D';
  }

  const effectiveEnding: 'A' | 'B' | 'C' | 'D' = (run.ending as 'A' | 'B' | 'C' | 'D' | undefined) || projectedEnding;

  // Identificação do capítulo
  const getChapterNumber = (nodeId: string): number => {
    if (!nodeId || nodeId.startsWith('prologo')) return 0;
    if (nodeId.startsWith('cap1') || nodeId.startsWith('L0') || nodeId.startsWith('B0') || nodeId.startsWith('R0') || nodeId === 'K1') return 1;
    if (nodeId.startsWith('cap2') || nodeId === 'K2') return 2;
    if (nodeId.startsWith('cap3') || nodeId === 'K3' || nodeId === 'K4') return 3;
    if (nodeId.startsWith('cap4') || nodeId === 'N1' || nodeId === 'K5') return 4;
    if (nodeId.startsWith('cap5') || nodeId === 'K6') return 5;
    return 6;
  };

  const currentChapter = getChapterNumber(run.current_node);
  const chapterSteps = [
    { num: 0, label: 'Prólogo' },
    { num: 1, label: 'Cap. 1' },
    { num: 2, label: 'Cap. 2' },
    { num: 3, label: 'Cap. 3' },
    { num: 4, label: 'Cap. 4' },
    { num: 5, label: 'Cap. 5' },
    { num: 6, label: 'Desfecho' },
  ];

  // Renderizador de medidor de relação (-3 a +3)
  const renderRelationGauge = (label: string, value: number, description: string) => {
    const percentage = ((value + 3) / 6) * 100;
    const isPositive = value > 0;
    const isNegative = value < 0;

    return (
      <div className="bg-[#14121F] p-3 rounded-lg border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-300">{label}</span>
          <span
            className={`font-pixel text-sm px-1.5 py-0.5 rounded ${
              isPositive
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : isNegative
                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {value > 0 ? `+${value}` : value}
          </span>
        </div>

        {/* Barra de progresso centrada em 0 */}
        <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          {/* Marca de centro zero */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 z-10" />
          <div
            className={`h-full transition-all duration-300 ${
              isPositive ? 'bg-emerald-500' : isNegative ? 'bg-rose-500' : 'bg-slate-500'
            }`}
            style={{ width: `${Math.max(5, percentage)}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 font-sans">{description}</p>
      </div>
    );
  };

  return (
    <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-5 shadow-lg space-y-6">
      {/* 1. Cabeçalho de Status e Posição Narrativa */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-[#E0A526] font-bold">
              ESTADO ATUAL DO JOGADOR
            </span>
            <h3 className="text-2xl font-pixel text-[#F2EFE6] mt-0.5">
              {run.player_name}
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-[#14121F] border border-slate-800 text-slate-300">
              Nó: <strong className="text-[#E0A526]">{run.current_node}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#14121F] border border-slate-800 text-slate-300">
              Turma: <strong className="text-sky-300">{run.class_code || 'GERAL'}</strong>
            </span>
          </div>
        </div>

        {/* Barra de Progresso Narrativo pelos Capítulos */}
        <div className="mt-4">
          <p className="text-xs font-mono text-slate-400 mb-2">Jornada na História:</p>
          <div className="grid grid-cols-7 gap-1">
            {chapterSteps.map((step) => {
              const isPast = step.num < currentChapter;
              const isCurrent = step.num === currentChapter;
              return (
                <div key={step.num} className="text-center">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-[#E0A526] ring-2 ring-[#E0A526]/50 shadow-sm'
                        : isPast
                        ? 'bg-[#2B7A8C]'
                        : 'bg-slate-800'
                    }`}
                  />
                  <span
                    className={`block text-[10px] font-mono mt-1 ${
                      isCurrent
                        ? 'text-[#E0A526] font-bold'
                        : isPast
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Relações Interpessoais e Variáveis de Equipe (GDD §5.4) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-300 font-bold">
            Variáveis de Relação e Confiança
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            Escala de -3 a +3 (Mínimo: -3 · Máximo: +3)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {renderRelationGauge(
            'Lia ↔ Bruno (LB)',
            lb,
            lb > 0
              ? 'Lia e Bruno construíram aliança estratégica.'
              : lb < 0
              ? 'Divergência entre o pragmatismo e as metas.'
              : 'Relação neutra até o momento.'
          )}

          {renderRelationGauge(
            'Bruno ↔ Rafa (BR)',
            br,
            br > 0
              ? 'Alinhamento em marketing e produto.'
              : br < 0
              ? 'Atrito sobre prazos e rigor analítico.'
              : 'Sem posições antagônicas marcadas.'
          )}

          {renderRelationGauge(
            'Rafa ↔ Lia (RL)',
            rl,
            rl > 0
              ? 'Cumplicidade entre operação e fábrica.'
              : rl < 0
              ? 'Tensão na linha de produção.'
              : 'Relação equilibrada.'
          )}
        </div>

        {/* Resumo de Coesão e Cooperativa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-[#14121F] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-300 block">
                Coesão Geral (LB + BR + RL)
              </span>
              <span className="text-[11px] text-slate-400">
                {coesao >= COESAO_MIN
                  ? '✓ Equipe coesa (suficiente para decisões conjuntas)'
                  : '✗ Equipe fragmentada (abaixo do limiar mínimo)'}
              </span>
            </div>
            <span
              className={`text-xl font-pixel px-2 py-1 rounded ${
                coesao >= COESAO_MIN
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}
            >
              {coesao > 0 ? `+${coesao}` : coesao}
            </span>
          </div>

          <div className="bg-[#14121F] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-300 block">
                Engajamento Cooperativa (COOP)
              </span>
              <span className="text-[11px] text-slate-400">
                {coop >= 2
                  ? 'Apoio sólido dos produtores e cooperados'
                  : 'Apoio pontual ou incipiente'}
              </span>
            </div>
            <span className="text-xl font-pixel px-2 py-1 rounded bg-[#2B7A8C]/20 text-[#2B7A8C] border border-[#2B7A8C]/40">
              {coop}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Decisões Estruturais e Flags Narrativas */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase font-mono tracking-wider text-slate-300 font-bold">
          Decisões Estruturais e Flags Ativas
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            {
              flag: 'F_DADOS',
              active: fDados,
              title: 'Planilha de Sofia',
              desc: 'Usou dados detalhados para embasar a proposta',
            },
            {
              flag: 'F_VOZ',
              active: fVoz,
              title: 'Voz da Comunidade',
              desc: 'Gravou/apresentou depoimentos de cooperados',
            },
            {
              flag: 'F_SOFIA',
              active: !!flags.F_SOFIA,
              title: 'Confiança de Sofia',
              desc: 'Sofia apoia ativamente a iniciativa dos estagiários',
            },
            {
              flag: 'F_SEGREDO',
              active: !!flags.F_SEGREDO,
              title: 'Sigilo da Crise',
              desc: 'Preservou a informação confidencial sobre a cooperativa',
            },
            {
              flag: 'F_LIA_GUARDOU',
              active: !!flags.F_LIA_GUARDOU,
              title: 'Lealdade de Lia',
              desc: 'Lia manteve lealdade ao grupo',
            },
            {
              flag: 'K2_A',
              active: !!flags.K2_A,
              title: 'Colaboração em K2',
              desc: 'Optou pelo diálogo conjunto em vez de atuação isolada',
            },
          ].map((item) => (
            <div
              key={item.flag}
              className={`p-2.5 rounded-lg border text-left transition ${
                item.active
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                  : 'bg-[#14121F]/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-1.5 font-mono text-xs font-bold">
                <span>{item.active ? '●' : '○'}</span>
                <span>{item.title}</span>
              </div>
              <p className="text-[10px] mt-1 line-clamp-2 leading-tight">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Análise de Desfecho / Final Previsto ou Alcançado */}
      <div className="bg-[#14121F] p-4 rounded-xl border border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-wider text-[#E0A526] font-bold">
            {run.status === 'completed' ? 'Desfecho Conquistado' : 'Projeção de Final (Tendência)'}
          </span>
          <span className="text-xs font-mono text-slate-400">
            Poder de Negociação: {negociacao} / 3
          </span>
        </div>

        <div className="flex items-start space-x-3 pt-1">
          <div className="text-3xl font-pixel text-[#E0A526] px-3 py-1 bg-[#221F33] rounded border border-[#E0A526]/40">
            {effectiveEnding}
          </div>
          <div>
            <h5 className="font-pixel text-lg text-[#F2EFE6]">
              {ENDING_NAMES[effectiveEnding] || 'Desfecho'}
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
              {effectiveEnding === 'A' &&
                'A equipe unida e bem fundamentada conquista autonomia completa na gestão do projeto com a cooperativa.'}
              {effectiveEnding === 'B' &&
                'A proposta técnica avança em aliança com a diretoria, mas a equipe opera com autonomia delegada por falta de união interna.'}
              {effectiveEnding === 'C' &&
                'O time mantém harmonia interpessoal, porém a falta de dados estruturados força concessões comerciais com a diretoria.'}
              {effectiveEnding === 'D' &&
                'Equipe dividida e projeto sem dados suficientes levam ao cancelamento da expansão e reatribuição das áreas.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
