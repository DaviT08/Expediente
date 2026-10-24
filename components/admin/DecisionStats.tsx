'use client';

import React, { useState } from 'react';
import type { DecisionStat } from '@/lib/professorStats';
import { OBVIOUS_MIN_N, OBVIOUS_PCT } from '@/lib/professorStats';

interface Props {
  decisions: DecisionStat[];
}

const TYPE_PT: Record<string, string> = { P: 'Perfil', K: 'Chave', N: 'Sofia' };
const DAY_PT = ['Prólogo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Epílogo'];

// Aba Decisões (GDD §9.3): frequência de cada opção e aviso de opção óbvia
export default function DecisionStats({ decisions }: Props) {
  const [onlyObvious, setOnlyObvious] = useState(false);
  const obviousCount = decisions.filter((d) => d.options.some((o) => o.obvious)).length;
  const list = onlyObvious ? decisions.filter((d) => d.options.some((o) => o.obvious)) : decisions;

  return (
    <div className="space-y-4">
      <div className="bg-[#221F33] border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-300 leading-relaxed">
          Uma opção de <b>perfil</b> escolhida por mais de {OBVIOUS_PCT}% da turma (com pelo menos {OBVIOUS_MIN_N}{' '}
          respostas) aparece como <span className="text-rose-300 font-bold">opção óbvia</span>. Nesse caso, reescreva a{' '}
          <b>pergunta</b>, não a opção.
          {obviousCount > 0 ? (
            <span className="block mt-1 text-rose-300 font-bold">{obviousCount} decisão(ões) para revisar.</span>
          ) : (
            <span className="block mt-1 text-emerald-300">Nenhuma opção óbvia até agora.</span>
          )}
        </p>
        <label className="flex items-center gap-2 text-xs font-mono whitespace-nowrap cursor-pointer">
          <input
            type="checkbox"
            checked={onlyObvious}
            onChange={(e) => setOnlyObvious(e.target.checked)}
            className="accent-[#E0A526]"
          />
          Só as para revisar
        </label>
      </div>

      {list.map((d) => {
        const hasObvious = d.options.some((o) => o.obvious);
        return (
          <section
            key={d.id}
            className={`bg-[#221F33] rounded-xl p-4 space-y-3 border ${hasObvious ? 'border-rose-500/70' : 'border-slate-700/80'}`}
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-pixel text-lg text-[#E0A526]">{d.id}</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#14121F] border border-slate-700 text-slate-300">
                {TYPE_PT[d.type]} · {DAY_PT[d.chapter] ?? `Cap. ${d.chapter}`}
              </span>
              <span className="text-xs font-mono text-slate-400">n = {d.total}</span>
              {hasObvious && (
                <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-600 text-rose-200">
                  opção óbvia — revisar redação
                </span>
              )}
            </div>
            <p className="text-sm text-slate-200">{d.prompt}</p>
            <ul className="space-y-2">
              {d.options.map((o) => (
                <li key={o.id}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className={o.obvious ? 'text-rose-200 font-semibold' : 'text-slate-300'}>
                      <span className="font-mono text-slate-500 mr-1">{o.id})</span>
                      {o.text}
                    </span>
                    <span className="font-mono whitespace-nowrap text-slate-300">
                      {o.count} · {o.pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#14121F] rounded mt-1 overflow-hidden">
                    <div
                      className={`h-full ${o.obvious ? 'bg-rose-500' : d.type === 'P' ? 'bg-[#8E6CC4]' : 'bg-[#2B7A8C]'}`}
                      style={{ width: `${o.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
