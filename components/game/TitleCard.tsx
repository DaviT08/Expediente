'use client';

import React, { useEffect } from 'react';

interface TitleCardProps {
  day: string;
  title: string;
  onDismiss: () => void;
}

export default function TitleCard({ day, title, onDismiss }: TitleCardProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#14121F] p-6 text-center select-none cursor-pointer animate-fadeIn"
    >
      <div className="border-t border-b border-[#E0A526]/50 py-8 px-12 max-w-lg">
        <p className="text-sm sm:text-base font-mono uppercase tracking-[0.3em] text-[#2B7A8C] mb-2 font-bold">
          {day}
        </p>
        <h1 className="text-3xl sm:text-5xl font-pixel text-[#E0A526] tracking-wider uppercase drop-shadow-md">
          {title}
        </h1>
      </div>
      <p className="mt-8 text-xs font-mono text-slate-500 animate-pulse">
        Toque ou aguarde para continuar...
      </p>
    </div>
  );
}
