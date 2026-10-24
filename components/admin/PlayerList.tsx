'use client';

import React from 'react';
import type { RunRecord, RunStatus } from '@/lib/supabase/types';

interface PlayerListProps {
  runs: RunRecord[];
  selectedRunId: string | null;
  onSelectRun: (runId: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export default function PlayerList({
  runs,
  selectedRunId,
  onSelectRun,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: PlayerListProps) {
  const getStatusBadge = (status: RunStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950/80 text-sky-300 border border-sky-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>Em andamento</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
            <span>✓ Concluído</span>
          </span>
        );
      case 'abandoned':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <span>Pausado / Abandonado</span>
          </span>
        );
    }
  };

  const formatNodeLabel = (nodeId: string) => {
    if (!nodeId) return 'Início';
    if (nodeId.startsWith('prologo')) return 'Prólogo';
    if (nodeId.startsWith('cap1')) return 'Capítulo 1';
    if (nodeId.startsWith('cap2')) return 'Capítulo 2';
    if (nodeId.startsWith('cap3')) return 'Capítulo 3';
    if (nodeId.startsWith('cap4')) return 'Capítulo 4';
    if (nodeId.startsWith('cap5')) return 'Capítulo 5';
    if (nodeId.startsWith('final') || nodeId === 'game_finished_screen') return 'Fim do Jogo';
    if (nodeId.startsWith('epilogo')) return 'Epílogo';
    return nodeId;
  };

  return (
    <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-4 shadow-md flex flex-col h-full">
      {/* Cabeçalho da Lista e Busca */}
      <div className="space-y-3 pb-3 border-b border-slate-700/70">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#E0A526] font-bold">
            Jogadores ({runs.length})
          </h2>
        </div>

        {/* Campo de Busca */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar aluno por nome..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#14121F] border border-slate-700 rounded-lg px-3 py-2 text-xs text-[#F2EFE6] placeholder-slate-500 focus:outline-none focus:border-[#E0A526] focus:ring-1 focus:ring-[#E0A526] transition"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtros de Status */}
        <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'in_progress', label: 'Em andamento' },
            { id: 'completed', label: 'Concluídos' },
            { id: 'abandoned', label: 'Pausados' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => onStatusFilterChange(f.id)}
              className={`px-2.5 py-1 rounded transition ${
                statusFilter === f.id
                  ? 'bg-[#2B7A8C] text-white font-bold'
                  : 'bg-[#14121F] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Alunos com Rolagem */}
      <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1 max-h-[640px]">
        {runs.length === 0 ? (
          <div className="text-center py-10 px-4 text-xs font-mono text-slate-400">
            Nenhum jogador encontrado com os filtros atuais.
          </div>
        ) : (
          runs.map((run) => {
            const isSelected = selectedRunId === run.id;
            const vars = run.state?.vars || { LB: 0, BR: 0, RL: 0 };
            const coesao = (vars.LB ?? 0) + (vars.BR ?? 0) + (vars.RL ?? 0);

            return (
              <div
                key={run.id}
                onClick={() => onSelectRun(run.id)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#2B7A8C]/20 border-[#E0A526] shadow-md ring-1 ring-[#E0A526]/50'
                    : 'bg-[#14121F]/80 hover:bg-[#14121F] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-sm text-[#F2EFE6] truncate">
                    {run.player_name}
                  </span>
                  {getStatusBadge(run.status)}
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="text-slate-300">
                    📍 {formatNodeLabel(run.current_node)}
                  </span>
                  <span className="text-[#E0A526]">
                    {run.choices_count ?? 0} decisões
                  </span>
                </div>

                {/* Mini indicadores de variáveis */}
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex space-x-2 text-slate-400">
                    <span title="Lia ↔ Bruno">
                      LB: <strong className={vars.LB > 0 ? 'text-emerald-400' : vars.LB < 0 ? 'text-rose-400' : 'text-slate-300'}>
                        {vars.LB > 0 ? `+${vars.LB}` : vars.LB}
                      </strong>
                    </span>
                    <span title="Bruno ↔ Rafa">
                      BR: <strong className={vars.BR > 0 ? 'text-emerald-400' : vars.BR < 0 ? 'text-rose-400' : 'text-slate-300'}>
                        {vars.BR > 0 ? `+${vars.BR}` : vars.BR}
                      </strong>
                    </span>
                    <span title="Rafa ↔ Lia">
                      RL: <strong className={vars.RL > 0 ? 'text-emerald-400' : vars.RL < 0 ? 'text-rose-400' : 'text-slate-300'}>
                        {vars.RL > 0 ? `+${vars.RL}` : vars.RL}
                      </strong>
                    </span>
                  </div>

                  <span
                    className={`font-bold ${
                      coesao >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                    title="Coesão Geral (LB+BR+RL)"
                  >
                    Coesão: {coesao > 0 ? `+${coesao}` : coesao}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
