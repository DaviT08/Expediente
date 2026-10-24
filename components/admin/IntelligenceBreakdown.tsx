'use client';

import React, { useMemo } from 'react';
import type { RunRecord } from '@/lib/supabase/types';
import { calculateProfileScores, TOP_LEVEL_TAGS } from '@/lib/scoring';
import { INTELLIGENCE_INFO } from '@/content/report/texts';
import RadarChart from '@/components/report/RadarChart';

interface IntelligenceBreakdownProps {
  run: RunRecord;
}

export default function IntelligenceBreakdown({ run }: IntelligenceBreakdownProps) {
  const answered = run.state?.answered || {};

  const profile = useMemo(() => {
    try {
      if (Object.keys(answered).length > 0) {
        return calculateProfileScores(answered);
      }
    } catch (e) {
      console.warn('Erro ao calcular perfil de inteligências:', e);
    }
    return null;
  }, [answered]);

  if (!profile || profile.answeredCount === 0) {
    return (
      <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-5 text-center text-slate-400 font-mono text-xs">
        Nenhuma decisão de perfil (P) respondida ainda para gerar o mapa de inteligências.
      </div>
    );
  }

  return (
    <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-5 shadow-lg space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-[#E0A526] font-bold">
            PREFERÊNCIAS DE AÇÃO (GARDNER)
          </span>
          <h3 className="text-xl font-pixel text-[#F2EFE6] mt-0.5">
            Mapa de Inteligências Múltiplas ({profile.answeredCount} escolhas avaliadas)
          </h3>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Referência: Linha de base calculada ao acaso
        </span>
      </div>

      {/* Radar Chart Component */}
      <div className="py-2 flex justify-center">
        <RadarChart profile={profile} />
      </div>

      {/* Grid de Barras das 8 Inteligências */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {TOP_LEVEL_TAGS.map((tag) => {
          const item = profile.intelligences[tag];
          const info = INTELLIGENCE_INFO[tag];
          const isTop = profile.topIntelligences.includes(tag);
          const isBottom = profile.bottomIntelligences.includes(tag);

          return (
            <div
              key={tag}
              className={`p-3 rounded-lg border text-left transition ${
                isTop
                  ? 'bg-[#14121F] border-[#E0A526]/50'
                  : isBottom
                  ? 'bg-[#14121F]/60 border-slate-800'
                  : 'bg-[#14121F] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-[#F2EFE6] flex items-center space-x-1.5">
                  <span>{info.name}</span>
                  {isTop && (
                    <span className="text-[10px] bg-[#E0A526]/20 text-[#E0A526] px-1.5 py-0.2 rounded font-bold">
                      TOP
                    </span>
                  )}
                </span>
                <span className="font-pixel text-sm text-[#E0A526]">
                  {item.score}%
                </span>
              </div>

              {/* Barra de Score vs Baseline */}
              <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden my-1.5">
                {/* Linha de base ao acaso */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10"
                  style={{ left: `${item.base}%` }}
                  title={`Linha de base: ${item.base}%`}
                />
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    item.delta >= 0 ? 'bg-[#2B7A8C]' : 'bg-slate-600'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Delta vs acaso: <strong className={item.delta >= 0 ? 'text-emerald-400' : 'text-slate-400'}>{item.delta >= 0 ? `+${item.delta}` : item.delta}%</strong></span>
                <span>Base: {item.base}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
