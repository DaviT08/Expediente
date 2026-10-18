'use client';

import React from 'react';

interface HowToPlayModalProps {
  onStart: () => void;
}

export default function HowToPlayModal({ onStart }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-lg bg-[#221F33] border-2 border-[#2B7A8C] rounded-lg p-6 sm:p-8 shadow-2xl text-left space-y-6 my-auto">
        <div className="border-b border-slate-700 pb-3 flex justify-between items-center">
          <h2 className="text-2xl font-pixel text-[#E0A526] tracking-wider">
            COMO JOGAR
          </h2>
          <span className="text-xs font-mono text-slate-400">Guia Rápido · 30s</span>
        </div>

        {/* C.2 Instrução Inicial Obrigatória em destaque */}
        <div className="bg-[#14121F] border-l-4 border-[#E0A526] p-4 rounded text-sm sm:text-base text-[#F2EFE6] leading-relaxed shadow">
          <p className="font-bold text-[#E0A526] mb-1">Aviso Fundamental:</p>
          <p>
            Não existe resposta certa. Em cada escolha, pense no que <strong>você</strong> faria no lugar do personagem.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 font-body">
          <div className="flex items-start space-x-3">
            <span className="text-xl">👆</span>
            <div>
              <p className="font-semibold text-white">Avançar Diálogos:</p>
              <p className="text-slate-400">Toque na caixa de diálogo ou pressione Espaço / Enter para avançar o texto.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-xl">⌨</span>
            <div>
              <p className="font-semibold text-white">Tomar Decisões:</p>
              <p className="text-slate-400">Clique na opção desejada ou use as teclas numéricas de <strong>1 a 4</strong> no teclado.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-xl">🤝</span>
            <div>
              <p className="font-semibold text-white">Avisos de Relação:</p>
              <p className="text-slate-400">Notificações como <em>"Lia ↔ Bruno · confiança ▲"</em> mostram o impacto das suas atitudes no grupo.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-xl">⏳</span>
            <div>
              <p className="font-semibold text-white">Momentos de Pressão:</p>
              <p className="text-slate-400">Alguns momentos decisivos têm contagem de tempo (você pode desativar o tempo limite no menu de Pausa a qualquer momento).</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onStart}
            className="w-full py-3.5 bg-[#E0A526] hover:bg-[#E0A526]/90 text-[#14121F] font-bold rounded text-base transition font-mono uppercase tracking-wider shadow-lg active:scale-[0.99]"
          >
            Começar a Jogar
          </button>
        </div>
      </div>
    </div>
  );
}
