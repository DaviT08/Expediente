'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/engine/store';
import { getNodeById } from '@/content/story';
import { evalCondition } from '@/lib/engine/condition';
import { calculateEnding } from '@/lib/endings';
import Stage from '@/components/game/Stage';
import DialogueBox from '@/components/game/DialogueBox';
import ChoiceList from '@/components/game/ChoiceList';
import HUD from '@/components/game/HUD';
import RelationToast from '@/components/game/RelationToast';
import PauseMenu from '@/components/game/PauseMenu';
import TimerBar from '@/components/game/TimerBar';
import TitleCard from '@/components/game/TitleCard';
import ChapterFlowchart from '@/components/game/ChapterFlowchart';
import { Line, PNode, KNode, SceneNode } from '@/content/tags';
import type { CharacterId } from '@/content/characters';

const STAGE_WIDTH = 'max-w-[min(1200px,calc((100dvh_-_96px)*16/9))]';

export default function JogarPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [talking, setTalking] = useState(false);
  const [activeTitleCard, setActiveTitleCard] = useState<{ day: string; title: string } | null>(null);

  const {
    runId,
    playerName,
    nodeId,
    lineIndex,
    inReaction,
    reactionLines,
    vars,
    flags,
    answered,
    isPaused,
    loadSavedGame,
    advanceDialogue,
    selectOption,
    applyEffects,
    setNode,
  } = useGameStore();

  // Garante hidratação segura e carregamento do save
  useEffect(() => {
    setMounted(true);
    if (!runId) {
      const loaded = loadSavedGame();
      if (!loaded) {
        router.push('/');
      }
    }
  }, [runId, loadSavedGame, router]);

  // Recupera o nó narrativo atual
  const currentNode = useMemo(() => {
    return getNodeById(nodeId);
  }, [nodeId]);

  // Title card para início do Prólogo ou Capítulos
  useEffect(() => {
    if (nodeId === 'prologo_intro') {
      setActiveTitleCard({ day: 'DOMINGO · 22:00', title: 'Prólogo' });
    } else if (nodeId === 'cap1_intro') {
      setActiveTitleCard({ day: 'SEGUNDA-FEIRA', title: 'Capítulo 1 · Primeiro Dia' });
    } else if (nodeId === 'cap2_intro') {
      setActiveTitleCard({ day: 'TERÇA-FEIRA', title: 'Capítulo 2 · A Planilha' });
    } else if (nodeId === 'cap3_intro') {
      setActiveTitleCard({ day: 'QUARTA-FEIRA', title: 'Capítulo 3 · A Lista' });
    } else if (nodeId === 'cap4_intro') {
      setActiveTitleCard({ day: 'QUINTA-FEIRA', title: 'Capítulo 4 · Véspera' });
    } else if (nodeId === 'cap5_intro') {
      setActiveTitleCard({ day: 'SEXTA-FEIRA', title: 'Capítulo 5 · O Pitch' });
    } else if (nodeId === 'epilogo_intro') {
      setActiveTitleCard({ day: '3 MESES DEPOIS', title: 'Epílogo' });
    }
  }, [nodeId]);

  // Trata nó do tipo resolveEnding (§7.1)
  useEffect(() => {
    if (currentNode && currentNode.kind === 'resolveEnding') {
      const { ending } = calculateEnding(vars, flags);
      setNode(`final_${ending}_scene`);
    }
  }, [currentNode, vars, flags, setNode]);

  // Trata nós de ramificação (branch) automaticamente
  useEffect(() => {
    if (currentNode && currentNode.kind === 'branch') {
      const match = currentNode.when.find((w) => evalCondition(w.if, { vars, flags }));
      const nextTarget = match ? match.next : currentNode.else;
      setNode(nextTarget);
    }
  }, [currentNode, vars, flags, setNode]);

  // Fim da história → Espelho (§4.1, §8.3)
  useEffect(() => {
    if (nodeId === 'game_finished_screen') {
      router.push('/espelho');
    }
  }, [nodeId, router]);

  // Aplicação de efeitos em nós do tipo 'scene' (ex: M1, M2, M3)
  useEffect(() => {
    if (currentNode && currentNode.kind === 'scene' && currentNode.effects && currentNode.effects.length > 0) {
      applyEffects(currentNode.effects);
    }
  }, [currentNode?.id]);

  if (!mounted || !currentNode) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#14121F] text-slate-400 font-mono text-sm">
        Carregando história...
      </main>
    );
  }

  // Fim de capítulo
  if (currentNode.kind === 'chapterEnd') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#14121F] text-[#F2EFE6] select-none text-center">
        <div className="w-full max-w-lg bg-[#221F33] p-6 rounded-xl border-2 border-[#2B7A8C] shadow-2xl space-y-4">
          <span className="text-4xl">⏱</span>
          <h1 className="text-3xl font-pixel text-[#E0A526] tracking-wider">
            CAPÍTULO {currentNode.chapter} CONCLUÍDO
          </h1>
          <p className="text-sm font-body text-slate-300 leading-relaxed">
            Fim do dia. Estas foram as decisões que mudaram o rumo da história.
          </p>
          <ChapterFlowchart chapter={currentNode.chapter} answered={answered} />
          <div className="pt-2">
            <button
              onClick={() => setNode(currentNode.next)}
              className="w-full py-3.5 bg-[#E0A526] hover:bg-[#E0A526]/90 text-[#14121F] font-bold rounded uppercase tracking-wider text-sm font-mono transition shadow-lg"
            >
              Avançar para o Próximo Dia ▶
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Se for nó de branch ou técnico sem renderização direta, aguarda o useEffect
  if (currentNode.kind !== 'scene' && currentNode.kind !== 'decision') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#14121F] text-slate-400 font-mono text-sm">
        Processando...
      </main>
    );
  }

  const renderableNode = currentNode as SceneNode | PNode | KNode;

  // Filtragem de falas que atendem a condições (§11.3)
  const activeLines: Line[] = inReaction
    ? (reactionLines as Line[])
    : renderableNode.lines
    ? renderableNode.lines.filter((l: Line) => !l.if || evalCondition(l.if, { vars, flags }))
    : [];

  const hasLinesRemaining = lineIndex < activeLines.length;
  const currentLine = hasLinesRemaining ? activeLines[lineIndex] : null;

  // Trata transição de nós tipo 'scene' quando as falas acabam
  const handleAdvance = () => {
    if (hasLinesRemaining) {
      if (lineIndex + 1 < activeLines.length) {
        advanceDialogue();
      } else {
        if (inReaction) {
          advanceDialogue(); // encerra reação e vai para nextNode
        } else if (renderableNode.kind === 'scene') {
          setNode(renderableNode.next);
        } else {
          advanceDialogue();
        }
      }
    }
  };

  // Trata escolha de opções
  // meta: tempo de resposta (medido pela lista de opções) e se o tempo acabou
  const handleSelectOption = (optionId: string, meta: { responseMs?: number; timedOut?: boolean } = {}) => {
    if (isPaused && !meta.timedOut) return;
    if (renderableNode.kind === 'decision') {
      if (renderableNode.type === 'P') {
        const pNode = renderableNode as PNode;
        const opt = pNode.options.find((o) => o.id === optionId);
        if (opt) {
          selectOption(renderableNode.id, opt.id, [], opt.reaction, renderableNode.next, meta);
        }
      } else {
        const kNode = renderableNode as KNode;
        const opt = kNode.options.find((o) => o.id === optionId);
        if (opt) {
          selectOption(renderableNode.id, opt.id, opt.effects, opt.reaction, opt.next || renderableNode.next, meta);
        }
      }
    }
  };

  const isDecisionReady = renderableNode.kind === 'decision' && !inReaction && !hasLinesRemaining;

  // Outro personagem em cena: último que falou (além do POV) até a fala atual
  const sceneOther: CharacterId | null = (() => {
    const pool = inReaction ? activeLines : activeLines.slice(0, lineIndex + 1);
    for (let i = pool.length - 1; i >= 0; i--) {
      const sp = pool[i]?.speaker;
      if (sp && sp !== 'narrador' && sp !== renderableNode.pov) return sp;
    }
    return null;
  })();

  return (
    <main className="min-h-screen bg-[#0b0a12] text-[#F2EFE6] flex flex-col items-center justify-center px-6 py-2 select-none">
      {/* Largura limitada pela altura da tela: a cena 16:9 + HUD + rodapé cabem sem rolar (ex.: notebook 1366x768) */}
      <div className={`w-full ${STAGE_WIDTH}`}>
        <HUD clock={renderableNode.clock} />
      </div>

      <div className={`w-full ${STAGE_WIDTH} mt-1`}>
        <Stage
          bg={renderableNode.bg}
          pov={renderableNode.pov}
          speaker={currentLine?.speaker || 'narrador'}
          other={sceneOther}
          expression={currentLine?.expression || 'neutro'}
          talking={talking}
        >
          {/* Escolhas sobre o cenário */}
          {isDecisionReady && (
            <div className="absolute inset-0 z-20 flex items-center justify-end p-8 bg-gradient-to-r from-transparent via-[#0b0a12]/40 to-[#0b0a12]/80">
              <div className="w-[60%] space-y-2">
                {'timerSec' in renderableNode && renderableNode.timerSec && (
                  <TimerBar
                    key={renderableNode.id}
                    durationSec={renderableNode.timerSec}
                    paused={isPaused}
                    onTimeout={() => {
                      const timeoutOpt = (renderableNode as KNode).timeoutOption || (renderableNode as KNode).options[0].id;
                      handleSelectOption(timeoutOpt, {
                        responseMs: (renderableNode as KNode).timerSec! * 1000,
                        timedOut: true,
                      });
                    }}
                  />
                )}
                <ChoiceList
                  decisionId={renderableNode.id}
                  prompt={renderableNode.prompt}
                  options={renderableNode.options}
                  onSelect={(id, responseMs) => handleSelectOption(id, { responseMs })}
                  disabled={isPaused}
                />
              </div>
            </div>
          )}

          {/* Caixa de diálogo sobre o cenário */}
          {(!isDecisionReady || inReaction) && currentLine && (
            <div className="absolute left-[4%] right-[4%] bottom-[3.5%] z-20">
              <DialogueBox
                speaker={currentLine.speaker || 'narrador'}
                text={currentLine.text}
                canAdvance={true}
                onAdvance={handleAdvance}
                onTypingChange={setTalking}
              />
            </div>
          )}
        </Stage>
      </div>

      <footer className={`w-full ${STAGE_WIDTH} flex justify-between items-center text-xs font-pixel text-slate-500 pt-2`}>
        <span>Jogador: {playerName}</span>
        <span>Clique ou Espaço para avançar · 1–4 para escolher</span>
      </footer>

      {/* Modais flutuantes */}
      <RelationToast />
      <PauseMenu />
      {activeTitleCard && (
        <TitleCard
          day={activeTitleCard.day}
          title={activeTitleCard.title}
          onDismiss={() => setActiveTitleCard(null)}
        />
      )}
    </main>
  );
}
