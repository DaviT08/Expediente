import React from 'react';
import type { ProfileResult, TopLevelTag } from '@/lib/scoring';
import { TOP_LEVEL_TAGS } from '@/lib/scoring';
import { INTELLIGENCE_INFO } from '@/content/report/texts';

interface Props {
  profile: ProfileResult;
  group?: boolean; // true no painel do professor (média da turma)
}

const SIZE = 420;
const C = SIZE / 2;
const R = 120;

function point(i: number, value: number) {
  const angle = (Math.PI * 2 * i) / TOP_LEVEL_TAGS.length - Math.PI / 2;
  const r = (R * Math.max(0, Math.min(100, value))) / 100;
  return [C + r * Math.cos(angle), C + r * Math.sin(angle)] as const;
}

function polygon(values: number[]) {
  return values.map((v, i) => point(i, v).map((n) => n.toFixed(1)).join(',')).join(' ');
}

export default function RadarChart({ profile, group = false }: Props) {
  const scores = TOP_LEVEL_TAGS.map((t) => profile.intelligences[t].score);
  const bases = TOP_LEVEL_TAGS.map((t) => profile.intelligences[t].base);
  const label = (t: TopLevelTag) =>
    `${INTELLIGENCE_INFO[t].short}: ${profile.intelligences[t].score} (acaso ${profile.intelligences[t].base})`;

  return (
    <figure className="w-full max-w-sm mx-auto">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Mapa de preferências. ${TOP_LEVEL_TAGS.map(label).join('; ')}`}
        className="w-full h-auto"
      >
        {[25, 50, 75, 100].map((ring) => (
          <polygon
            key={ring}
            points={polygon(TOP_LEVEL_TAGS.map(() => ring))}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.15}
          />
        ))}
        {TOP_LEVEL_TAGS.map((t, i) => {
          const [x, y] = point(i, 100);
          const [lx, ly] = point(i, 122);
          const anchor = Math.abs(lx - C) < 8 ? 'middle' : lx > C ? 'start' : 'end';
          return (
            <g key={t}>
              <line x1={C} y1={C} x2={x} y2={y} stroke="currentColor" strokeOpacity={0.15} />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={14}
                fill="currentColor"
                className="font-body"
              >
                {INTELLIGENCE_INFO[t].short}
              </text>
            </g>
          );
        })}
        <polygon
          points={polygon(bases)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.6}
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
        <polygon points={polygon(scores)} fill="#E0A526" fillOpacity={0.3} stroke="#E0A526" strokeWidth={2.5} />
        {scores.map((s, i) => {
          const [x, y] = point(i, s);
          return <rect key={i} x={x - 3} y={y - 3} width={6} height={6} fill="#E0A526" />;
        })}
      </svg>
      <figcaption className="text-sm text-slate-400 print:text-slate-600 text-center mt-2 leading-snug">
        <span className="inline-block w-3 h-3 bg-[#E0A526]/60 border border-[#E0A526] align-middle mr-1" /> {group ? 'média da turma' : 'suas escolhas'}
        <span className="inline-block w-5 border-t-2 border-dashed border-current align-middle mx-1 ml-4" /> escolha ao acaso
        <br />
        {group
          ? 'O tracejado mostra quanto alguém pontuaria escolhendo ao acaso. O que importa é o quanto a turma ficou acima ou abaixo dele.'
          : 'O tracejado mostra quanto alguém pontuaria escolhendo ao acaso. O que importa é o quanto você ficou acima ou abaixo dele.'}
      </figcaption>
    </figure>
  );
}
