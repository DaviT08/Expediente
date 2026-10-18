import { CharacterId } from './characters';

export type Tag =
  | 'LIN'
  | 'LOG'
  | 'ESP'
  | 'COR'
  | 'MUS'
  | 'NAT'
  | 'INTER.EMP'
  | 'INTER.COM'
  | 'INTER.CONF'
  | 'INTER.COL'
  | 'INTRA.AUTO'
  | 'INTRA.REG'
  | 'INTRA.MOT'
  | 'INTRA.REF';

export type TopLevelTag = 'LIN' | 'LOG' | 'ESP' | 'COR' | 'MUS' | 'NAT' | 'INTER' | 'INTRA';

export function getTopLevelTag(tag: Tag): TopLevelTag {
  if (tag.startsWith('INTER.')) return 'INTER';
  if (tag.startsWith('INTRA.')) return 'INTRA';
  return tag as TopLevelTag;
}

export type Var = 'LB' | 'BR' | 'RL' | 'COOP';
export type Flag = 'F_DADOS' | 'F_VOZ' | 'F_SOFIA' | 'F_SEGREDO' | 'F_LIA_GUARDOU' | 'K2_A';

export type Effect =
  | { op: 'add'; var: Var; value: number }
  | { op: 'set'; flag: Flag; value: boolean };

export type Condition =
  | { flag: Flag; equals: boolean }
  | { var: Var; gte?: number; lt?: number }
  | { all: Condition[] }
  | { any: Condition[] };

export type Expression = 'neutro' | 'tenso' | 'sorrindo';

export interface Line {
  speaker?: CharacterId;
  expression?: Expression;
  text: string;
  if?: Condition;
}

export interface POption {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  tags: Partial<Record<Tag, 1 | 2>>;
  reaction: Line[];
  reportSnippet: string;
}

export interface PNode {
  id: string;
  kind: 'decision';
  type: 'P';
  chapter: number;
  clock: string;
  bg: string;
  pov: CharacterId;
  lines?: Line[];
  prompt: string;
  next: string;
  options: POption[];
}

export interface KOption {
  id: string;
  text: string;
  effects: Effect[];
  reaction: Line[];
  next?: string;
}

export interface KNode {
  id: string;
  kind: 'decision';
  type: 'K' | 'N';
  chapter: number;
  clock: string;
  bg: string;
  pov: CharacterId;
  lines?: Line[];
  prompt: string;
  next: string;
  timerSec?: number;
  timeoutOption?: string;
  options: KOption[];
}

export interface SceneNode {
  id: string;
  kind: 'scene';
  chapter: number;
  clock: string;
  bg: string;
  pov: CharacterId;
  lines: Line[];
  effects?: Effect[];
  next: string;
}

export interface BranchNode {
  id: string;
  kind: 'branch';
  when: { if: Condition; next: string }[];
  else: string;
}

export interface ChapterEndNode {
  id: string;
  kind: 'chapterEnd';
  chapter: number;
  next: string;
}

export interface ResolveEndingNode {
  id: string;
  kind: 'resolveEnding';
}

export interface EndingNode {
  id: string;
  kind: 'ending';
  ending: 'A' | 'B' | 'C' | 'D';
  next: string;
}

export type GameNode =
  | SceneNode
  | PNode
  | KNode
  | BranchNode
  | ChapterEndNode
  | ResolveEndingNode
  | EndingNode;
