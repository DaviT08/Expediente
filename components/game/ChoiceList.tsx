'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { shuffleWithSeed } from '@/lib/engine/shuffle';
import { useGameStore } from '@/lib/engine/store';

export interface ChoiceOption {
  id: string;
  text: string;
}

interface ChoiceListProps {
  decisionId: string;
  prompt: string;
  options: ChoiceOption[];
  onSelect: (optionId: string, responseMs: number) => void;
  disabled?: boolean;
}

export default function ChoiceList({
  decisionId,
  prompt,
  options,
  onSelect,
  disabled = false,
}: ChoiceListProps) {
  const runId = useGameStore((state) => state.runId);

  // Momento em que as opções apareceram, para medir o tempo de resposta
  const shownAtRef = useRef(0);
  useEffect(() => {
    shownAtRef.current = Date.now();
  }, [decisionId]);
  const choose = (id: string) => onSelect(id, Date.now() - shownAtRef.current);

  // Embaralha as opções de forma estável e determinística (GDD §11.4)
  const shuffledOptions = useMemo(() => {
    return shuffleWithSeed(options, `${runId}_${decisionId}`);
  }, [options, runId, decisionId]);

  // Atalhos de teclado 1 a 4 (§4.1 e §10.2)
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= shuffledOptions.length) {
        e.preventDefault();
        choose(shuffledOptions[keyNum - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffledOptions, disabled, onSelect]);

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Pergunta / Prompt da Decisão */}
      <div className="px-box bg-[#14121F]/95 px-5 py-3 text-left" style={{ ['--box-color' as string]: '#E0A526' }}>
        <p className="text-xl font-pixel tracking-wide text-[#E0A526]">
          {prompt}
        </p>
      </div>

      {/* Lista de Opções */}
      <div className="grid grid-cols-1 gap-3">
        {shuffledOptions.map((opt, index) => (
          <button
            key={opt.id}
            disabled={disabled}
            onClick={() => choose(opt.id)}
            className="group relative flex items-center w-full min-h-[56px] px-4 py-3 bg-[#221F33]/95 hover:bg-[#33295a] focus:bg-[#33295a] border-4 border-[#4a4168] hover:border-[#E0A526] focus:border-[#E0A526] focus:outline-none text-left text-lg text-[#F2EFE6] shadow-[4px_4px_0_#0b0a12] hover:translate-x-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Tag do atalho 1-4 */}
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-4 bg-[#14121F] border-2 border-slate-600 text-base font-pixel text-slate-300 group-hover:text-[#E0A526] group-hover:border-[#E0A526]">
              {index + 1}
            </span>

            {/* Texto da opção */}
            <span className="flex-grow font-body leading-snug">
              {opt.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
