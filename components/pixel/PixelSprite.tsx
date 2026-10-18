import React from 'react';
import type { CharacterId } from '@/content/characters';
import type { Expression } from '@/content/tags';
import { getSprite, SPRITE_H, SPRITE_W, type Rect } from './sprites';

interface Props {
  id: CharacterId;
  expression?: Expression;
  talking?: boolean;
  dim?: boolean;
  flip?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const draw = (rects: Rect[]) => rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.c} />);

export default function PixelSprite({ id, expression = 'neutro', talking = false, dim = false, flip = false, className, style }: Props) {
  const s = getSprite(id, expression);
  if (!s) return null;
  return (
    <svg
      viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}
      shapeRendering="crispEdges"
      className={`px-sprite ${dim ? 'px-dim' : 'px-bob'} ${className ?? ''}`}
      style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }}
      aria-hidden
    >
      <g>{draw(s.outline)}</g>
      <g>{draw(s.base)}</g>
      <g className="px-eyes-open">{draw(s.eyesOpen)}</g>
      <g className="px-eyes-blink">{draw(s.eyesBlink)}</g>
      <g className={talking ? 'px-mouth-a' : ''}>{draw(s.mouthIdle)}</g>
      {talking && <g className="px-mouth-b">{draw(s.mouthTalk)}</g>}
    </svg>
  );
}
