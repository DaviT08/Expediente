'use client';

import React, { useState, useMemo } from 'react';
import type { EnrichedTimelineItem } from '@/lib/supabase/types';
import { CHARACTERS } from '@/content/characters';

interface PlayerTimelineProps {
  timeline: EnrichedTimelineItem[];
  playerName: string;
}

export default function PlayerTimeline({ timeline, playerName }: PlayerTimelineProps) {
  const [filterType, setFilterType] = useState<'all' | 'key' | 'profile'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredTimeline = useMemo(() => {
    let items = [...timeline];
    if (filterType === 'key') {
      items = items.filter((item) => item.decisionType === 'K' || item.decisionType === 'N');
    } else if (filterType === 'profile') {
      items = items.filter((item) => item.decisionType === 'P');
    }

    if (sortOrder === 'desc') {
      items.reverse();
    }
    return items;
  }, [timeline, filterType, sortOrder]);

  const getPovColor = (pov: string) => {
    switch (pov) {
      case 'lia':
        return 'text-[#E0A526] border-[#E0A526]/40 bg-[#E0A526]/10';
      case 'bruno':
        return 'text-[#2B7A8C] border-[#2B7A8C]/40 bg-[#2B7A8C]/10';
      case 'rafa':
        return 'text-[#8E6CC4] border-[#8E6CC4]/40 bg-[#8E6CC4]/10';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800';
    }
  };

  const getPovName = (pov: string) => {
    const char = CHARACTERS[pov as keyof typeof CHARACTERS];
    return char ? char.name : pov.toUpperCase();
  };

  const formatResponseTime = (ms?: number | null) => {
    if (ms === undefined || ms === null) return '—';
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-5 shadow-lg space-y-5">
      {/* Cabeçalho da Linha do Tempo e Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-[#E0A526] font-bold">
            HISTÓRICO CRONOLÓGICO DE DECISÕES
          </span>
          <h3 className="text-xl font-pixel text-[#F2EFE6] mt-0.5">
            Linha do Tempo de {playerName} ({timeline.length} decisões registradas)
          </h3>
        </div>

        {/* Controles de Filtro e Ordenação */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex bg-[#14121F] rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded transition ${
                filterType === 'all'
                  ? 'bg-[#2B7A8C] text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas ({timeline.length})
            </button>
            <button
              onClick={() => setFilterType('key')}
              className={`px-2.5 py-1 rounded transition ${
                filterType === 'key'
                  ? 'bg-[#2B7A8C] text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chave K/N
            </button>
            <button
              onClick={() => setFilterType('profile')}
              className={`px-2.5 py-1 rounded transition ${
                filterType === 'profile'
                  ? 'bg-[#2B7A8C] text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Perfil P
            </button>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2.5 py-1.5 bg-[#14121F] hover:bg-slate-800 border border-slate-800 rounded text-slate-300 transition"
            title="Inverter ordem"
          >
            {sortOrder === 'asc' ? '▲ Mais antigas' : '▼ Mais recentes'}
          </button>
        </div>
      </div>

      {/* Aviso Pedagógico Obrigatório (GDD §9) */}
      <div className="bg-[#14121F]/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-center space-x-2 font-mono">
        <span className="text-[#E0A526] font-bold text-sm">ℹ</span>
        <span>
          <strong>Aviso pedagógico:</strong> Tempo de resposta não indica traço de personalidade. Ele reflete leitura, reflexão e contexto do momento da partida.
        </span>
      </div>

      {/* Lista da Linha do Tempo */}
      {filteredTimeline.length === 0 ? (
        <div className="py-12 text-center text-slate-400 font-mono text-sm bg-[#14121F]/60 rounded-xl border border-slate-800">
          Nenhuma decisão registrada para este jogador ainda.
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:sm:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#E0A526] before:via-[#2B7A8C] before:to-slate-700">
          {filteredTimeline.map((item) => {
            const isKeyDecision = item.decisionType === 'K' || item.decisionType === 'N';

            return (
              <div key={item.id} className="relative group text-left">
                {/* Ponto / Marcador na Linha */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center font-pixel text-xs border-2 shadow-md transition-all ${
                    isKeyDecision
                      ? 'bg-[#E0A526] text-[#14121F] border-white font-bold ring-2 ring-[#E0A526]/50'
                      : 'bg-[#221F33] text-[#2B7A8C] border-[#2B7A8C]'
                  }`}
                >
                  {item.stepNumber}
                </div>

                {/* Card de Detalhe da Decisão */}
                <div
                  className={`bg-[#14121F] rounded-xl border p-4 shadow-sm transition-all hover:border-slate-600 ${
                    isKeyDecision ? 'border-[#E0A526]/50 bg-gradient-to-b from-[#1b172a] to-[#14121F]' : 'border-slate-800'
                  }`}
                >
                  {/* Cabeçalho do Card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span
                        className={`font-bold px-2 py-0.5 rounded border text-[11px] ${
                          item.decisionType === 'K'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                            : item.decisionType === 'N'
                            ? 'bg-purple-950/80 text-purple-300 border-purple-700'
                            : 'bg-sky-950/80 text-sky-300 border-sky-700'
                        }`}
                      >
                        {item.decisionType === 'K'
                          ? `CHAVE · ${item.decisionId}`
                          : item.decisionType === 'N'
                          ? `NEGOCIAÇÃO · ${item.decisionId}`
                          : `PERFIL · ${item.decisionId}`}
                      </span>

                      <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${getPovColor(item.pov)}`}>
                        POV: {getPovName(item.pov)}
                      </span>

                      <span className="text-slate-400">
                        Cap. {item.chapter} · {item.clock}
                      </span>
                    </div>

                    {/* Metadados da Resposta */}
                    <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400">
                      <span>⏱ {formatResponseTime(item.responseMs)}</span>
                      {item.timedOut && (
                        <span className="bg-rose-950 text-rose-400 border border-rose-800 px-1.5 py-0.5 rounded font-bold">
                          Tempo Esgotado
                        </span>
                      )}
                      <span>· {formatTimestamp(item.chosenAt)}</span>
                    </div>
                  </div>

                  {/* Situação / Pergunta Apresentada ao Aluno */}
                  <div className="mt-3">
                    <p className="text-xs uppercase font-mono text-slate-400 font-semibold mb-1">
                      Situação / Dilema:
                    </p>
                    <p className="text-sm font-body text-slate-200 italic leading-relaxed">
                      "{item.prompt}"
                    </p>
                  </div>

                  {/* Opção Escolhida */}
                  <div className="mt-3 p-3 bg-[#221F33] rounded-lg border border-[#2B7A8C]/40">
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="font-bold text-[#E0A526] uppercase">
                        ✓ Opção Escolhida ({item.optionId.toUpperCase()}):
                      </span>
                    </div>
                    <p className="text-sm text-[#F2EFE6] font-semibold leading-relaxed">
                      {item.optionText}
                    </p>

                    {/* Falas de Reação Imediata */}
                    {item.reactionLines && item.reactionLines.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/60 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                          Reação dos personagens:
                        </span>
                        {item.reactionLines.map((line, lIdx) => (
                          <p key={lIdx} className="text-xs text-slate-300 font-body">
                            {line.speaker && (
                              <strong className="text-[#2B7A8C] capitalize">
                                {line.speaker}:{' '}
                              </strong>
                            )}
                            {line.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Consequências e Efeitos da Escolha */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs">
                    {/* Efeitos de Relações */}
                    {item.effects &&
                      item.effects.map((eff, effIdx) => {
                        if (eff.op === 'add') {
                          const isUp = eff.value > 0;
                          return (
                            <span
                              key={effIdx}
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                                isUp
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                                  : 'bg-rose-950 text-rose-300 border-rose-700/60'
                              }`}
                            >
                              {eff.var}: {isUp ? `+${eff.value}` : eff.value}{' '}
                              {isUp ? '▲' : '▼'}
                            </span>
                          );
                        } else if (eff.op === 'set') {
                          return (
                            <span
                              key={effIdx}
                              className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-700/60"
                            >
                              Flag {eff.flag} = {String(eff.value)}
                            </span>
                          );
                        }
                        return null;
                      })}

                    {/* Tags de Inteligência Gardner */}
                    {item.tags &&
                      Object.entries(item.tags).map(([tagKey, weight]) => (
                        <span
                          key={tagKey}
                          className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#14121F] text-[#E0A526] border border-[#E0A526]/40"
                          title={`Peso Gardner: ${weight}`}
                        >
                          🏷 {tagKey} (+{weight})
                        </span>
                      ))}

                    {/* Snippet do Relatório */}
                    {item.reportSnippet && (
                      <span className="text-[11px] text-slate-400 italic font-sans ml-auto">
                        "{item.reportSnippet}"
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
