'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CHARACTERS, CharacterId } from '@/content/characters';
import { useGameStore } from '@/lib/engine/store';

interface DialogueBoxProps {
  speaker?: CharacterId;
  text: string;
  onAdvance: () => void;
  canAdvance: boolean;
  onTypingChange?: (typing: boolean) => void;
}

export default function DialogueBox({
  speaker = 'narrador',
  text,
  onAdvance,
  canAdvance,
  onTypingChange,
}: DialogueBoxProps) {
  const settings = useGameStore((state) => state.settings);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onTypingChange?.(isTyping);
  }, [isTyping, onTypingChange]);

  const character = CHARACTERS[speaker] || CHARACTERS.narrador;
  const isNarrator = speaker === 'narrador' || !character.name;

  // Tamanhos de fonte acessíveis (§10.1 & §12)
  const textSizeClass = {
    normal: 'text-xl leading-relaxed',
    large: 'text-2xl leading-relaxed',
    xlarge: 'text-3xl leading-relaxed',
  }[settings.textSize || 'normal'];

  // Efeito máquina de escrever (~40 caracteres/s => 25ms por char)
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    if (settings.reduceMotion) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    const speed = Math.max(10, settings.textSpeed || 25);

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      currentIndex++;
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, speed);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [text, settings.textSpeed, settings.reduceMotion]);

  const handleClick = () => {
    if (isTyping) {
      // Toque durante digitação: completa imediatamente
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(text);
      setIsTyping(false);
    } else if (canAdvance) {
      // Toque com texto completo: avança a fala
      onAdvance();
    }
  };

  // Espaço / Enter avançam o texto (§4.1, §12 — navegação por teclado)
  const handleClickRef = useRef(handleClick);
  handleClickRef.current = handleClick;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (useGameStore.getState().isPaused) return; // jogo pausado: não avança a fala
      const target = e.target as HTMLElement | null;
      if (target && ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      e.preventDefault();
      handleClickRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      onClick={handleClick}
      role="region"
      aria-live="polite"
      className="px-box relative w-full bg-[#14121F]/92 px-6 pt-5 pb-4 select-none cursor-pointer"
      style={{ minHeight: '128px', ['--box-color' as string]: isNarrator ? '#8a8aa0' : character.color }}
    >
      {/* Nome do Personagem (aba) */}
      {!isNarrator && (
        <div
          className="absolute -top-5 left-5 px-3 py-1 flex items-baseline gap-2 font-pixel text-lg tracking-wider text-[#14121F] shadow-[3px_3px_0_#0b0a12]"
          style={{ backgroundColor: character.color }}
        >
          <span className="font-bold">{character.name}</span>
          <span className="text-xs font-body opacity-80">{character.role}</span>
        </div>
      )}

      {/* Texto do Diálogo / Narração */}
      <p
        className={`text-[#F2EFE6] font-body ${textSizeClass} ${
          isNarrator ? 'italic text-slate-300' : ''
        }`}
      >
        {displayedText}
      </p>

      {/* Indicador ▼ piscando para avançar */}
      {!isTyping && canAdvance && (
        <div className="absolute bottom-2 right-4 text-xs font-pixel text-[#E0A526] animate-bounce flex items-center space-x-1">
          <span>Avançar</span>
          <span className="text-sm">▼</span>
        </div>
      )}
    </div>
  );
}
