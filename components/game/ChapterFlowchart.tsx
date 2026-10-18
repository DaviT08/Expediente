'use client';

import React, { useEffect, useState } from 'react';
import { allStoryNodes } from '@/content/story';
import type { KNode } from '@/content/tags';

const SEEN_KEY = 'expediente_seen_paths_v1';

function readSeen(): Set<string> {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(SEEN_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

// Fluxograma de fim de capítulo (GDD §5.8): só decisões K/N.
// Caminhos não escolhidos aparecem como "???" até serem vistos em outra partida neste navegador.
export default function ChapterFlowchart({ chapter, answered }: { chapter: number; answered: Record<string, string> }) {
  const nodes = allStoryNodes.filter(
    (n): n is KNode => n.kind === 'decision' && (n.type === 'K' || n.type === 'N') && n.chapter === chapter && !!answered[n.id]
  );
  const [seen, setSeen] = useState<Set<string>>(new Set());

  useEffect(() => {
    const s = readSeen();
    for (const n of nodes) s.add(`${n.id}:${answered[n.id]}`);
    try {
      window.localStorage.setItem(SEEN_KEY, JSON.stringify([...s]));
    } catch {
      /* sem storage: segue sem lembrar */
    }
    setSeen(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter]);

  if (nodes.length === 0) return null;

  return (
    <div className="space-y-4 text-left">
      {nodes.map((n) => (
        <div key={n.id} className="bg-[#14121F] rounded-lg border border-slate-700 p-3">
          <p className="text-xs font-mono text-[#2B7A8C] uppercase tracking-wider mb-2">{n.prompt}</p>
          <ul className="space-y-1.5 border-l-2 border-slate-700 pl-3">
            {n.options.map((o) => {
              const chosen = answered[n.id] === o.id;
              const known = chosen || seen.has(`${n.id}:${o.id}`);
              return (
                <li
                  key={o.id}
                  className={`text-sm leading-snug ${chosen ? 'text-[#E0A526] font-semibold' : known ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  <span aria-hidden className="mr-1.5">{chosen ? '●' : '○'}</span>
                  {known ? o.text : '???'}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <p className="text-xs text-slate-500">Jogue de novo para descobrir os caminhos marcados com ???.</p>
    </div>
  );
}
