'use client';

import React from 'react';
import { useGameStore } from '@/lib/engine/store';

interface HUDProps {
  clock: string;
}

export default function HUD({ clock }: HUDProps) {
  const setPaused = useGameStore((state) => state.setPaused);

  return (
    <header className="w-full flex justify-between items-center py-2 px-1 text-xs sm:text-sm font-pixel select-none">
      {/* Relógio HUD (§10.1) */}
      <div className="flex items-center space-x-2 bg-[#221F33] px-3 py-1.5 rounded border border-slate-700 shadow">
        <span className="text-[#E0A526]">⏱</span>
        <span className="text-[#F2EFE6] tracking-wider">{clock}</span>
      </div>

      {/* Botão de Pausa */}
      <button
        onClick={() => setPaused(true)}
        className="flex items-center space-x-1 bg-[#221F33] hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded border border-slate-700 transition active:scale-95 shadow"
        title="Pausar jogo"
      >
        <span>⏸</span>
        <span className="hidden sm:inline">Pausa</span>
      </button>
    </header>
  );
}
