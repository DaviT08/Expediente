'use client';

import React from 'react';
import { CHARACTERS, CharacterId } from '@/content/characters';
import { Expression } from '@/content/tags';
import Scene, { SCENE_LABELS } from '@/components/pixel/Scenes';
import PixelSprite from '@/components/pixel/PixelSprite';

interface StageProps {
  bg: string;
  pov?: CharacterId;
  speaker?: CharacterId;
  other?: CharacterId | null; // outro personagem em cena (último que falou além do POV)
  expression?: Expression;
  talking?: boolean;
  children?: React.ReactNode; // sobreposições (diálogo, escolhas)
}

export default function Stage({ bg, pov = 'lia', speaker = 'narrador', other = null, expression = 'neutro', talking = false, children }: StageProps) {
  const povChar = CHARACTERS[pov] ?? CHARACTERS.lia;
  const showPov = pov !== 'narrador';
  const povSpeaking = speaker === pov;
  const otherSpeaking = !!other && speaker === other;

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-[#0b0a12] px-panel select-none">
      <Scene bg={bg} />

      {/* Placa do cenário e POV */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-[#14121F]/85 font-pixel text-sm tracking-wider text-[#F2EFE6] shadow-[3px_3px_0_#0b0a12]">
        {SCENE_LABELS[bg] ?? bg.replace(/_/g, ' ')}
      </div>
      {showPov && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-[#14121F]/85 font-pixel text-sm tracking-wider shadow-[3px_3px_0_#0b0a12]">
          <span className="text-slate-400">Você é </span>
          <span style={{ color: povChar.color }}>{povChar.name.split(' ')[0]}</span>
        </div>
      )}

      {/* Personagens */}
      {showPov && (
        <PixelSprite
          id={pov}
          expression={povSpeaking ? expression : 'neutro'}
          talking={povSpeaking && talking}
          dim={!povSpeaking && speaker !== 'narrador'}
          className="absolute bottom-0 left-[6%] h-[62%] w-auto z-[5]"
        />
      )}
      {other && other !== pov && (
        <PixelSprite
          id={other}
          expression={otherSpeaking ? expression : 'neutro'}
          talking={otherSpeaking && talking}
          dim={!otherSpeaking}
          flip
          className={`absolute bottom-0 right-[6%] w-auto z-[5] ${other === 'sofia' ? 'h-[48%]' : 'h-[62%]'}`}
        />
      )}

      {children}
    </div>
  );
}
