'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/engine/store';
import HowToPlayModal from '@/components/game/HowToPlayModal';

export default function EntradaPage() {
  const router = useRouter();
  const initGame = useGameStore((state) => state.initGame);
  const loadSavedGame = useGameStore((state) => state.loadSavedGame);
  const hasSavedGame = useGameStore((state) => state.hasSavedGame);

  const [playerName, setPlayerName] = useState('');
  const [consent, setConsent] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  useEffect(() => {
    setHasSave(hasSavedGame());
  }, [hasSavedGame]);

  const handleStartClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !consent) return;
    setShowHowToPlay(true);
  };

  const handleStartGame = () => {
    initGame(playerName.trim(), '');
    router.push('/jogar');
  };

  const handleResumeGame = () => {
    if (loadSavedGame()) {
      router.push(useGameStore.getState().isCompleted ? '/relatorio' : '/jogar');
    }
  };

  const isFormValid = playerName.trim().length >= 2 && consent;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-[#14121F] text-[#F2EFE6] select-none">
      <div className="w-full max-w-lg bg-[#221F33] p-6 sm:p-8 rounded-xl shadow-2xl border border-[#2B7A8C]/40 text-center">
        {/* Logo / Título */}
        <h1 className="text-4xl sm:text-6xl font-pixel mb-1 tracking-wider text-[#E0A526] drop-shadow-md">
          EXPEDIENTE
        </h1>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-400 mb-6 font-mono">
          Uma semana decisiva na Raiz Alimentos
        </p>

        {/* Botão de Continuar (se houver save) (§4.1) */}
        {hasSave && (
          <div className="mb-6 p-4 bg-[#14121F] rounded-lg border border-[#2B7A8C] text-left">
            <p className="text-xs font-mono text-[#2B7A8C] mb-1 font-bold">
              PARTIDA EM ANDAMENTO ENCONTRADA
            </p>
            <p className="text-xs text-slate-400 mb-3">
              Você possui uma partida salva neste navegador.
            </p>
            <button
              onClick={handleResumeGame}
              className="w-full py-2.5 bg-[#2B7A8C] hover:bg-[#2B7A8C]/90 text-white font-bold rounded text-sm transition font-mono uppercase tracking-wider"
            >
              Continuar de onde parei ▶
            </button>
          </div>
        )}

        {/* Formulário de Nova Partida */}
        <form onSubmit={handleStartClick} className="space-y-5 text-left">
          <div>
            <label
              htmlFor="playerName"
              className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-mono font-semibold"
            >
              Seu nome *
            </label>
            <input
              id="playerName"
              type="text"
              required
              maxLength={60}
              placeholder="Digite seu nome"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#14121F] border border-slate-700 rounded-lg text-sm text-[#F2EFE6] placeholder-slate-500 focus:outline-none focus:border-[#E0A526] focus:ring-1 focus:ring-[#E0A526] transition"
            />
          </div>

          {/* Caixa de Ciência Obrigatória (Apêndice C.1) */}
          <div className="bg-[#14121F]/90 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
            <p>
              Esta é uma atividade educacional sobre as inteligências múltiplas. Suas escolhas ficam salvas só neste navegador. No final, você pode salvar seu relatório em PDF.
            </p>
            <label className="flex items-center space-x-2.5 cursor-pointer pt-1 font-semibold text-slate-200 hover:text-white">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 accent-[#E0A526] rounded cursor-pointer"
              />
              <span>Entendi e quero participar.</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3.5 font-bold rounded-lg uppercase tracking-wider text-sm sm:text-base font-mono transition shadow-lg ${
                isFormValid
                  ? 'bg-[#E0A526] hover:bg-[#E0A526]/90 text-[#14121F] cursor-pointer active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              Começar
            </button>
          </div>
        </form>

        <p className="mt-6 text-[11px] text-slate-500 font-mono">
          Expediente · Visual Novel em Pixel Art (~30 min)
        </p>
      </div>

      {/* Modal Como Jogar (§4.1 & Apêndice C.2) */}
      {showHowToPlay && (
        <HowToPlayModal onStart={handleStartGame} />
      )}
    </main>
  );
}
