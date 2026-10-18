'use client';

import React from 'react';
import { useGameStore } from '@/lib/engine/store';

export default function RelationToast() {
  const toasts = useGameStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow-lg border text-sm font-pixel tracking-wide animate-bounce transition-all ${
            toast.type === 'up'
              ? 'bg-[#221F33]/90 border-emerald-500 text-emerald-300'
              : toast.type === 'down'
              ? 'bg-[#221F33]/90 border-amber-500 text-amber-300'
              : 'bg-[#221F33]/90 border-cyan-500 text-cyan-300'
          }`}
        >
          {toast.text}
        </div>
      ))}
    </div>
  );
}
