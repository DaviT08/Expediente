'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/lib/engine/store';
import { playSfx } from '@/lib/sound';

interface TimerBarProps {
  durationSec: number;
  onTimeout: () => void;
  paused?: boolean;
}

// Contagem regressiva das decisões sob pressão. Para quando o jogo está pausado.
export default function TimerBar({ durationSec, onTimeout, paused = false }: TimerBarProps) {
  const disableTimer = useGameStore((state) => state.settings.disableTimer);
  const volume = useGameStore((state) => state.settings.soundVolume);
  const [timeLeft, setTimeLeft] = useState(durationSec);

  // Guarda as funções e o volume mais recentes sem reiniciar o relógio
  const onTimeoutRef = useRef(onTimeout);
  const volumeRef = useRef(volume);
  const firedRef = useRef(false);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
    volumeRef.current = volume;
  }, [onTimeout, volume]);

  // O relógio só anda enquanto não está pausado
  useEffect(() => {
    if (disableTimer || paused) return;
    let last = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      setTimeLeft((prev) => Math.max(0, prev - dt));
    }, 100);
    return () => clearInterval(interval);
  }, [disableTimer, paused]);

  // Bipe a cada segundo nos últimos 5 s e aviso de tempo esgotado
  const whole = Math.ceil(timeLeft);
  useEffect(() => {
    if (disableTimer || paused) return;
    if (timeLeft <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        playSfx('timeout', volumeRef.current);
        onTimeoutRef.current();
      }
      return;
    }
    if (whole <= 5 && whole < durationSec) playSfx('tick', volumeRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whole, disableTimer]);

  if (disableTimer) return null;

  const percentage = Math.max(0, Math.min(100, (timeLeft / durationSec) * 100));
  const isUrgent = timeLeft <= 5;

  return (
    <div className="w-full bg-[#14121F]/80 p-2 rounded border border-slate-700/60 mb-2">
      <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-300">
        <span className={isUrgent ? 'text-red-400 font-bold animate-pulse' : 'text-slate-400'}>
          {paused ? 'PAUSADO' : isUrgent ? '⚠ TEMPO ESGOTANDO' : 'TEMPO DE RESPOSTA'}
        </span>
        <span className={isUrgent ? 'text-red-400 font-bold' : 'text-slate-400'}>{whole}s</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-[#E0A526]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
