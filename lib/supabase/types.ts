import type { Var, Flag } from '@/content/tags';
import type { EndingId } from '@/lib/endings';

export type RunStatus = 'in_progress' | 'completed' | 'abandoned';

export interface ClassRecord {
  id: string;
  code: string;
  name: string;
  is_open: boolean;
  created_at: string;
}

export interface RunRecord {
  id: string;
  class_id?: string;
  class_code?: string;
  class_name?: string;
  player_name: string;
  attempt: number;
  client_token?: string;
  report_token?: string;
  content_version: string;
  status: RunStatus;
  current_node: string;
  state: {
    vars: Record<Var, number>;
    flags: Record<Flag, boolean>;
    answered?: Record<string, string>;
  };
  scores?: {
    raw?: Record<string, number>;
    scores?: Record<string, number>;
    deltas?: Record<string, number>;
  } | null;
  mirror?: Record<string, number> | null;
  ending?: EndingId | null;
  consent_at: string;
  started_at: string;
  updated_at: string;
  completed_at?: string | null;
  total_ms?: number | null;
  choices_count?: number;
  last_choice_at?: string | null;
}

export interface ChoiceRecord {
  id?: number;
  run_id: string;
  decision_id: string;
  option_id: string;
  decision_type: 'P' | 'K' | 'N';
  response_ms?: number | null;
  timed_out: boolean;
  chosen_at: string;
}

// Item enriquecido da linha do tempo com dados narrativos do catálogo
export interface EnrichedTimelineItem {
  id: string;
  stepNumber: number;
  decisionId: string;
  decisionType: 'P' | 'K' | 'N';
  chapter: number;
  clock: string;
  pov: string;
  prompt: string;
  optionId: string;
  optionText: string;
  reactionLines?: { speaker?: string; expression?: string; text: string }[];
  tags?: Partial<Record<string, number>>;
  effects?: { op: string; var?: string; flag?: string; value: any }[];
  reportSnippet?: string;
  responseMs?: number | null;
  timedOut: boolean;
  chosenAt: string;
}

export interface ProfessorDashboardMetrics {
  totalRuns: number;
  inProgressRuns: number;
  completedRuns: number;
  abandonedRuns: number;
  averageDurationMs: number;
  averageCohesion: number;
  endingDistribution: Record<EndingId, number>;
}
