'use client';

import React from 'react';
import { useGameStore } from '@/lib/engine/store';
import { playSfx } from '@/lib/sound';

interface OptionsPanelProps {
  onBack: () => void;
}

export default function OptionsPanel({ onBack }: OptionsPanelProps) {
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);

  return (
    <div className="w-full max-w-md bg-[#221F33] p-6 rounded-lg border-2 border-slate-700 shadow-2xl space-y-5 text-left">
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <h2 className="text-xl font-pixel text-[#E0A526] tracking-wider">
          OPÇÕES DE ACESSIBILIDADE
        </h2>
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white text-sm font-mono"
        >
          ✕ Fechar
        </button>
      </div>

      {/* Tamanho do Texto (§10.2) */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
          Tamanho do Texto
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['normal', 'large', 'xlarge'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateSettings({ textSize: size })}
              className={`py-2 text-xs font-bold rounded border transition ${
                settings.textSize === size
                  ? 'bg-[#E0A526] text-[#14121F] border-[#E0A526]'
                  : 'bg-[#14121F] text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              {size === 'normal' ? 'Normal' : size === 'large' ? 'Grande' : 'Muito Grande'}
            </button>
          ))}
        </div>
      </div>

      {/* Velocidade do Texto (§10.2) */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
          Velocidade do Diálogo ({settings.textSpeed}ms/char)
        </label>
        <input
          type="range"
          min="10"
          max="60"
          step="5"
          value={settings.textSpeed}
          onChange={(e) => updateSettings({ textSpeed: Number(e.target.value) })}
          className="w-full accent-[#E0A526] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>Mais Rápido</span>
          <span>Mais Lento</span>
        </div>
      </div>

      {/* Volume dos efeitos sonoros */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
          Efeitos sonoros ({Math.round((settings.soundVolume ?? 0) * 100)}%{settings.soundVolume ? '' : ' · mudo'})
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.soundVolume ?? 0}
          onChange={(e) => {
            const v = Number(e.target.value);
            updateSettings({ soundVolume: v });
            playSfx('click', v);
          }}
          className="w-full accent-[#E0A526] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>Mudo</span>
          <span>Máximo</span>
        </div>
      </div>

      {/* Desligar Tempo Limite (§10.2 & §12) */}
      <div className="flex items-center justify-between p-3 bg-[#14121F] rounded border border-slate-700">
        <div>
          <p className="text-sm font-semibold text-[#F2EFE6]">Desligar tempo limite</p>
          <p className="text-xs text-slate-400">Remove a contagem regressiva em decisões sob pressão.</p>
        </div>
        <input
          type="checkbox"
          checked={settings.disableTimer}
          onChange={(e) => updateSettings({ disableTimer: e.target.checked })}
          className="w-5 h-5 accent-[#E0A526] rounded cursor-pointer"
        />
      </div>

      {/* Reduzir Movimento (§12) */}
      <div className="flex items-center justify-between p-3 bg-[#14121F] rounded border border-slate-700">
        <div>
          <p className="text-sm font-semibold text-[#F2EFE6]">Reduzir movimento</p>
          <p className="text-xs text-slate-400">Desativa oscilações e animações contínuas.</p>
        </div>
        <input
          type="checkbox"
          checked={settings.reduceMotion}
          onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
          className="w-5 h-5 accent-[#E0A526] rounded cursor-pointer"
        />
      </div>

      <div className="pt-2">
        <button
          onClick={onBack}
          className="w-full py-2.5 bg-[#2B7A8C] hover:bg-[#2B7A8C]/80 text-white font-bold rounded text-sm transition font-mono uppercase tracking-wider"
        >
          Voltar ao Jogo
        </button>
      </div>
    </div>
  );
}
