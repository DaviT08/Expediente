'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/engine/store';
import OptionsPanel from './OptionsPanel';

export default function PauseMenu() {
  const router = useRouter();
  const isPaused = useGameStore((state) => state.isPaused);
  const setPaused = useGameStore((state) => state.setPaused);
  const [showOptions, setShowOptions] = useState(false);

  if (!isPaused) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      {showOptions ? (
        <OptionsPanel onBack={() => setShowOptions(false)} />
      ) : (
        <div className="w-full max-w-sm bg-[#221F33] border-2 border-slate-700 rounded-lg p-6 shadow-2xl text-center space-y-4">
          <h2 className="text-2xl font-pixel text-[#E0A526] tracking-widest mb-4">
            JOGO PAUSADO
          </h2>

          <div className="space-y-3 font-mono">
            {/* Continuar */}
            <button
              onClick={() => setPaused(false)}
              className="w-full py-3 bg-[#E0A526] hover:bg-[#E0A526]/90 text-[#14121F] font-bold rounded text-sm transition uppercase tracking-wider"
            >
              Continuar
            </button>

            {/* Opções */}
            <button
              onClick={() => setShowOptions(true)}
              className="w-full py-3 bg-[#14121F] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded text-sm transition uppercase tracking-wider"
            >
              Opções
            </button>

            {/* Salvar e Sair */}
            <button
              onClick={() => {
                setPaused(false);
                router.push('/');
              }}
              className="w-full py-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 rounded text-sm transition uppercase tracking-wider"
            >
              Salvar e Sair
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-mono mt-4">
            Seu progresso é gravado automaticamente a cada fala.
          </p>
        </div>
      )}
    </div>
  );
}
