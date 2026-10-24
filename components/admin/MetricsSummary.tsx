'use client';

import React from 'react';
import type { ProfessorDashboardMetrics } from '@/lib/supabase/types';

interface MetricsSummaryProps {
  metrics: ProfessorDashboardMetrics;
}

export default function MetricsSummary({ metrics }: MetricsSummaryProps) {
  const completionRate =
    metrics.totalRuns > 0
      ? Math.round((metrics.completedRuns / metrics.totalRuns) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Total de Partidas */}
      <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <span className="text-xs uppercase font-mono text-slate-400 font-semibold tracking-wider">
          Total de Alunos
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl sm:text-4xl font-pixel text-[#F2EFE6]">
            {metrics.totalRuns}
          </span>
          <span className="text-xs font-mono text-slate-400">partidas</span>
        </div>
      </div>

      {/* 2. Em Andamento */}
      <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <span className="text-xs uppercase font-mono text-sky-400 font-semibold tracking-wider flex items-center space-x-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>Em Andamento</span>
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl sm:text-4xl font-pixel text-sky-300">
            {metrics.inProgressRuns}
          </span>
          <span className="text-xs font-mono text-slate-400">ativos agora</span>
        </div>
      </div>

      {/* 3. Concluídas & Taxa */}
      <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <span className="text-xs uppercase font-mono text-emerald-400 font-semibold tracking-wider">
          Concluídos
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl sm:text-4xl font-pixel text-emerald-300">
            {metrics.completedRuns}
          </span>
          <span className="text-xs font-mono text-emerald-400/90 font-bold">
            {completionRate}% taxa
          </span>
        </div>
      </div>

      {/* 4. Coesão Média da Equipe */}
      <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <span className="text-xs uppercase font-mono text-[#E0A526] font-semibold tracking-wider">
          Coesão Média (LB+BR+RL)
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span
            className={`text-3xl sm:text-4xl font-pixel ${
              metrics.averageCohesion >= 0 ? 'text-[#E0A526]' : 'text-rose-400'
            }`}
          >
            {metrics.averageCohesion > 0 ? `+${metrics.averageCohesion}` : metrics.averageCohesion}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {metrics.averageCohesion >= 0 ? 'Equipe Unida' : 'Atrito'}
          </span>
        </div>
      </div>
    </div>
  );
}
