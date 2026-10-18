'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/engine/store';

interface TimerBarProps {
  durationSec: number;
  onTimeout: () => void;
  paused?: boolean;
}

export default function TimerBar({ durationSec, onTimeout, paused = false }: TimerBarProps) {
  const disableTimer = useGameStore((state) => state.settings.disableTimer);
  const [timeLeft, setTimeLeft] = useState(durationSec);

  useEffect(() => {
    if (disableTimer || paused) return;

    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [timeLeft, disableTimer, paused, onTimeout]);

  if (disableTimer) return null;

  const percentage = Math.max(0, Math.min(100, (timeLeft / durationSec) * 100));
  const isUrgent = timeLeft <= 5;

  return (
    <div className="w-full bg-[#14121F]/80 p-2 rounded border border-slate-700/60 mb-2">
      <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-300">
        <span className={isUrgent ? 'text-red-400 font-bold animate-pulse' : 'text-slate-400'}>
          {isUrgent ? '⚠ TEMPO ESGOTANDO' : 'TEMPO DE RESPOSTA'}
        </span>
        <span className={isUrgent ? 'text-red-400 font-bold' : 'text-slate-400'}>
          {Math.ceil(timeLeft)}s
        </span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${
            isUrgent ? 'bg-red-500 animate-pulse' : 'bg-[#E0A526]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
