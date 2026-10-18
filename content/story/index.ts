import { GameNode } from '@/content/tags';
import { prologoStory } from './prologo';
import { cap1Story } from './cap1';
import { cap2Story } from './cap2';
import { cap3Story } from './cap3';
import { cap4Story } from './cap4';
import { cap5Story } from './cap5';
import { finaisStory } from './finais';
import { epilogoStory } from './epilogo';

// Catálogo com TODOS os nós narrativos do jogo completo (§5.5)
export const allStoryNodes: GameNode[] = [
  ...prologoStory,
  ...cap1Story,
  ...cap2Story,
  ...cap3Story,
  ...cap4Story,
  ...cap5Story,
  ...finaisStory,
  ...epilogoStory,
];

const nodesMap = new Map<string, GameNode>();
for (const node of allStoryNodes) {
  nodesMap.set(node.id, node);
}

export function getNodeById(id: string): GameNode | undefined {
  return nodesMap.get(id);
}
