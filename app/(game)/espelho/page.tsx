'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/engine/store';
import { MIRROR_ITEMS } from '@/content/report/texts';

const SCALE = ['Quase nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Quase sempre'];

export default function EspelhoPage() {
  const router = useRouter();
  const { runId, loadSavedGame, saveMirror, mirror } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
    if (!runId && !loadSavedGame()) router.push('/');
  }, [runId, loadSavedGame, router]);

  useEffect(() => {
    if (mirror) setValues(mirror);
  }, [mirror]);

  if (!mounted) return null;

  const complete = MIRROR_ITEMS.every((i) => values[i.tag]);

  const submit = () => {
    if (!complete) return;
    saveMirror(values);
    router.push('/relatorio');
  };

  return (
    <main className="min-h-screen bg-[#14121F] text-[#F2EFE6] flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-pixel text-[#E0A526] tracking-wider">ESPELHO</h1>
          <p className="text-slate-300">
            Antes de ver seu mapa: quando você enfrenta um problema no trabalho ou na faculdade, o quanto costuma…
          </p>
        </header>

        <ol className="space-y-4">
          {MIRROR_ITEMS.map((item, idx) => (
            <li key={item.tag} className="bg-[#221F33] border border-slate-700 rounded-lg p-4">
              <p className="mb-3 font-semibold">
                {idx + 1}. …{item.text}
              </p>
              <div role="radiogroup" aria-label={item.text} className="grid grid-cols-5 gap-1.5">
                {SCALE.map((label, i) => {
                  const v = i + 1;
                  const selected = values[item.tag] === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setValues((s) => ({ ...s, [item.tag]: v }))}
                      className={`min-h-[48px] rounded px-1 py-2 text-xs sm:text-sm leading-tight border transition ${
                        selected
                          ? 'bg-[#E0A526] text-[#14121F] border-[#E0A526] font-bold'
                          : 'bg-[#14121F] text-slate-300 border-slate-700 hover:border-[#E0A526]'
                      }`}
                    >
                      <span className="block font-pixel text-base">{v}</span>
                      <span className="hidden sm:block">{label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 sm:hidden">
                <span>Quase nunca</span>
                <span>Quase sempre</span>
              </div>
            </li>
          ))}
        </ol>

        <button
          onClick={submit}
          disabled={!complete}
          className={`w-full py-4 rounded-lg font-mono font-bold uppercase tracking-wider transition ${
            complete
              ? 'bg-[#E0A526] text-[#14121F] hover:bg-[#E0A526]/90'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          Ver meu mapa de preferências ▶
        </button>
      </div>
    </main>
  );
}
