import { getNodeById } from '@/content/story';
import type { PNode, KNode } from '@/content/tags';
import { createAdminClient } from './admin';
import { getSupabaseClient } from './client';
import type {
  ClassRecord,
  RunRecord,
  ChoiceRecord,
  EnrichedTimelineItem,
  ProfessorDashboardMetrics,
} from './types';

// Dados de demonstração (fallback rico e realista quando Supabase não estiver configurado)
const DEMO_CLASSES: ClassRecord[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    code: 'GERAL',
    name: 'Turma Geral / Demonstração',
    is_open: true,
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    code: 'ADM-2026',
    name: 'Administração 2º Semestre (Comportamento Organizacional)',
    is_open: true,
    created_at: '2026-10-15T14:30:00Z',
  },
];

const DEMO_RUNS: RunRecord[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    class_id: 'c0000000-0000-0000-0000-000000000002',
    class_code: 'ADM-2026',
    class_name: 'Administração 2º Semestre (Comportamento Organizacional)',
    player_name: 'Mariana Souza',
    attempt: 1,
    content_version: '1.0.0',
    status: 'in_progress',
    current_node: 'cap3_p06',
    state: {
      vars: { LB: 1, BR: 2, RL: 1, COOP: 2 },
      flags: {
        F_DADOS: true,
        F_VOZ: false,
        F_SOFIA: true,
        F_SEGREDO: true,
        F_LIA_GUARDOU: true,
        K2_A: true,
      },
      answered: {
        L01: 'a',
        B01: 'b',
        R01: 'c',
        K1: 'a',
        L02: 'b',
        B02: 'a',
        R02: 'd',
        K2: 'a',
        L03: 'c',
        B03: 'a',
        K3: 'b',
      },
    },
    consent_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    started_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    choices_count: 11,
    last_choice_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    class_id: 'c0000000-0000-0000-0000-000000000002',
    class_code: 'ADM-2026',
    class_name: 'Administração 2º Semestre (Comportamento Organizacional)',
    player_name: 'Lucas Andrade',
    attempt: 1,
    content_version: '1.0.0',
    status: 'completed',
    current_node: 'game_finished_screen',
    state: {
      vars: { LB: 2, BR: 2, RL: 1, COOP: 3 },
      flags: {
        F_DADOS: true,
        F_VOZ: true,
        F_SOFIA: true,
        F_SEGREDO: true,
        F_LIA_GUARDOU: true,
        K2_A: true,
      },
      answered: {
        L01: 'a',
        B01: 'a',
        R01: 'a',
        K1: 'a',
        L02: 'a',
        B02: 'b',
        K2: 'a',
        K3: 'a',
        K4: 'a',
        N1: 'a',
        K5: 'a',
        K6: 'a',
      },
    },
    scores: {
      raw: { LIN: 24, LOG: 26, ESP: 18, COR: 12, MUS: 14, NAT: 15, INTER: 32, INTRA: 28 },
      scores: { LIN: 68, LOG: 75, ESP: 50, COR: 35, MUS: 40, NAT: 42, INTER: 90, INTRA: 82 },
      deltas: { LIN: 18, LOG: 25, ESP: 0, COR: -15, MUS: -10, NAT: -8, INTER: 40, INTRA: 32 },
    },
    mirror: { LIN: 4, LOG: 4, ESP: 3, COR: 2, MUS: 2, NAT: 3, INTER: 5, INTRA: 4 },
    ending: 'A',
    consent_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    started_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 88 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 88 * 60 * 1000).toISOString(),
    total_ms: 1920000,
    choices_count: 12,
    last_choice_at: new Date(Date.now() - 88 * 60 * 1000).toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    class_id: 'c0000000-0000-0000-0000-000000000002',
    class_code: 'ADM-2026',
    class_name: 'Administração 2º Semestre (Comportamento Organizacional)',
    player_name: 'Beatriz Lima',
    attempt: 1,
    content_version: '1.0.0',
    status: 'in_progress',
    current_node: 'K1',
    state: {
      vars: { LB: 0, BR: 0, RL: 0, COOP: 0 },
      flags: {
        F_DADOS: false,
        F_VOZ: false,
        F_SOFIA: false,
        F_SEGREDO: false,
        F_LIA_GUARDOU: false,
        K2_A: false,
      },
      answered: {
        L01: 'b',
        B01: 'c',
        R01: 'b',
      },
    },
    consent_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    started_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    choices_count: 3,
    last_choice_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    class_id: 'c0000000-0000-0000-0000-000000000001',
    class_code: 'GERAL',
    class_name: 'Turma Geral / Demonstração',
    player_name: 'Thiago Neves',
    attempt: 1,
    content_version: '1.0.0',
    status: 'abandoned',
    current_node: 'cap2_intro',
    state: {
      vars: { LB: -1, BR: 0, RL: 0, COOP: 0 },
      flags: {
        F_DADOS: false,
        F_VOZ: false,
        F_SOFIA: false,
        F_SEGREDO: false,
        F_LIA_GUARDOU: false,
        K2_A: false,
      },
      answered: {
        L01: 'c',
        B01: 'd',
        R01: 'a',
        K1: 'b',
      },
    },
    consent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    started_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    choices_count: 4,
    last_choice_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  },
];

const DEMO_CHOICES: Record<string, ChoiceRecord[]> = {
  '11111111-1111-1111-1111-111111111111': [
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'L01', option_id: 'a', decision_type: 'P', response_ms: 4200, timed_out: false, chosen_at: new Date(Date.now() - 34 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'B01', option_id: 'b', decision_type: 'P', response_ms: 5100, timed_out: false, chosen_at: new Date(Date.now() - 31 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'R01', option_id: 'c', decision_type: 'P', response_ms: 3800, timed_out: false, chosen_at: new Date(Date.now() - 28 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'K1',  option_id: 'a', decision_type: 'K', response_ms: 8500, timed_out: false, chosen_at: new Date(Date.now() - 24 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'L02', option_id: 'b', decision_type: 'P', response_ms: 4600, timed_out: false, chosen_at: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'B02', option_id: 'a', decision_type: 'P', response_ms: 6200, timed_out: false, chosen_at: new Date(Date.now() - 16 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'R02', option_id: 'd', decision_type: 'P', response_ms: 3900, timed_out: false, chosen_at: new Date(Date.now() - 13 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'K2',  option_id: 'a', decision_type: 'K', response_ms: 7100, timed_out: false, chosen_at: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'L03', option_id: 'c', decision_type: 'P', response_ms: 4900, timed_out: false, chosen_at: new Date(Date.now() - 7 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'B03', option_id: 'a', decision_type: 'P', response_ms: 5400, timed_out: false, chosen_at: new Date(Date.now() - 4 * 60 * 1000).toISOString() },
    { run_id: '11111111-1111-1111-1111-111111111111', decision_id: 'K3',  option_id: 'b', decision_type: 'K', response_ms: 9200, timed_out: false, chosen_at: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
  ],
  '22222222-2222-2222-2222-222222222222': [
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'L01', option_id: 'a', decision_type: 'P', response_ms: 3100, timed_out: false, chosen_at: new Date(Date.now() - 118 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'B01', option_id: 'a', decision_type: 'P', response_ms: 4200, timed_out: false, chosen_at: new Date(Date.now() - 115 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'R01', option_id: 'a', decision_type: 'P', response_ms: 2900, timed_out: false, chosen_at: new Date(Date.now() - 112 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'K1',  option_id: 'a', decision_type: 'K', response_ms: 6100, timed_out: false, chosen_at: new Date(Date.now() - 108 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'L02', option_id: 'a', decision_type: 'P', response_ms: 4800, timed_out: false, chosen_at: new Date(Date.now() - 104 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'B02', option_id: 'b', decision_type: 'P', response_ms: 5200, timed_out: false, chosen_at: new Date(Date.now() - 100 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'K2',  option_id: 'a', decision_type: 'K', response_ms: 7400, timed_out: false, chosen_at: new Date(Date.now() - 95 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'K3',  option_id: 'a', decision_type: 'K', response_ms: 6300, timed_out: false, chosen_at: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'K4',  option_id: 'a', decision_type: 'K', response_ms: 5900, timed_out: false, chosen_at: new Date(Date.now() - 85 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'N1',  option_id: 'a', decision_type: 'N', response_ms: 8900, timed_out: false, chosen_at: new Date(Date.now() - 78 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'K5',  option_id: 'a', decision_type: 'K', response_ms: 6400, timed_out: false, chosen_at: new Date(Date.now() - 72 * 60 * 1000).toISOString() },
    { run_id: '22222222-2222-2222-2222-222222222222', decision_id: 'K6',  option_id: 'a', decision_type: 'K', response_ms: 7100, timed_out: false, chosen_at: new Date(Date.now() - 65 * 60 * 1000).toISOString() },
  ],
  '33333333-3333-3333-3333-333333333333': [
    { run_id: '33333333-3333-3333-3333-333333333333', decision_id: 'L01', option_id: 'b', decision_type: 'P', response_ms: 6800, timed_out: false, chosen_at: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
    { run_id: '33333333-3333-3333-3333-333333333333', decision_id: 'B01', option_id: 'c', decision_type: 'P', response_ms: 4200, timed_out: false, chosen_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { run_id: '33333333-3333-3333-3333-333333333333', decision_id: 'R01', option_id: 'b', decision_type: 'P', response_ms: 7100, timed_out: false, chosen_at: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
  ],
};

/**
 * Enriquece uma lista de escolhas brutas com os dados do catálogo narrativo de história
 */
export function enrichChoicesWithStoryCatalog(choices: ChoiceRecord[]): EnrichedTimelineItem[] {
  return choices.map((choice, index) => {
    const node = getNodeById(choice.decision_id);
    let prompt = `Decisão ${choice.decision_id}`;
    let chapter = 1;
    let clock = '09:00';
    let pov = 'desconhecido';
    let optionText = `Opção ${choice.option_id.toUpperCase()}`;
    let reactionLines: { speaker?: string; expression?: string; text: string }[] | undefined;
    let tags: Partial<Record<string, number>> | undefined;
    let effects: any[] | undefined;
    let reportSnippet: string | undefined;

    if (node && node.kind === 'decision') {
      prompt = node.prompt;
      chapter = node.chapter;
      clock = node.clock;
      pov = node.pov;

      if (node.type === 'P') {
        const pNode = node as PNode;
        const opt = pNode.options.find((o) => o.id === choice.option_id);
        if (opt) {
          optionText = opt.text;
          reactionLines = opt.reaction;
          tags = opt.tags;
          reportSnippet = opt.reportSnippet;
        }
      } else {
        const kNode = node as KNode;
        const opt = kNode.options.find((o) => o.id === choice.option_id);
        if (opt) {
          optionText = opt.text;
          reactionLines = opt.reaction;
          effects = opt.effects;
        }
      }
    }

    return {
      id: `${choice.run_id}_${choice.decision_id}`,
      stepNumber: index + 1,
      decisionId: choice.decision_id,
      decisionType: choice.decision_type,
      chapter,
      clock,
      pov,
      prompt,
      optionId: choice.option_id,
      optionText,
      reactionLines,
      tags,
      effects,
      reportSnippet,
      responseMs: choice.response_ms,
      timedOut: choice.timed_out,
      chosenAt: choice.chosen_at,
    };
  });
}

/**
 * Busca todas as turmas cadastradas
 */
export async function getClasses(): Promise<ClassRecord[]> {
  const supabase = createAdminClient() || getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) {
        return data as ClassRecord[];
      }
    } catch (err) {
      console.warn('Erro ao consultar turmas no Supabase, usando dados locais/demo:', err);
    }
  }
  return DEMO_CLASSES;
}

/**
 * Busca partidas com filtros de turma e busca por nome
 */
export async function getTeacherRuns(filters?: {
  classId?: string;
  status?: string;
  search?: string;
}): Promise<{ runs: RunRecord[]; isLive: boolean }> {
  const supabase = createAdminClient() || getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase
        .from('runs')
        .select(`
          *,
          classes (
            code,
            name
          )
        `)
        .order('updated_at', { ascending: false });

      if (filters?.classId && filters.classId !== 'all') {
        query = query.eq('class_id', filters.classId);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.search && filters.search.trim()) {
        query = query.ilike('player_name', `%${filters.search.trim()}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        const mappedRuns: RunRecord[] = data.map((r: any) => ({
          ...r,
          class_code: r.classes?.code,
          class_name: r.classes?.name,
          choices_count: r.choices_count ?? (r.state?.answered ? Object.keys(r.state.answered).length : 0),
        }));
        return { runs: mappedRuns, isLive: true };
      }
    } catch (err) {
      console.warn('Erro ao consultar runs no Supabase:', err);
    }
  }

  // Fallback para dados de demonstração com filtros aplicados
  let filtered = [...DEMO_RUNS];
  if (filters?.classId && filters.classId !== 'all') {
    filtered = filtered.filter((r) => r.class_id === filters.classId);
  }
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((r) => r.status === filters.status);
  }
  if (filters?.search && filters.search.trim()) {
    const s = filters.search.toLowerCase().trim();
    filtered = filtered.filter((r) => r.player_name.toLowerCase().includes(s));
  }

  return { runs: filtered, isLive: false };
}

/**
 * Busca detalhes completos de uma partida específica e sua linha do tempo enriquecida
 */
export async function getPlayerRunDetails(runId: string): Promise<{
  run: RunRecord | null;
  timeline: EnrichedTimelineItem[];
  isLive: boolean;
}> {
  const supabase = createAdminClient() || getSupabaseClient();

  if (supabase) {
    try {
      // 1. Busca os dados da partida
      const { data: runData, error: runError } = await supabase
        .from('runs')
        .select(`
          *,
          classes (
            code,
            name
          )
        `)
        .eq('id', runId)
        .maybeSingle();

      if (!runError && runData) {
        // 2. Busca o histórico de escolhas ordenado
        const { data: choicesData } = await supabase
          .from('choices')
          .select('*')
          .eq('run_id', runId)
          .order('chosen_at', { ascending: true });

        const choices: ChoiceRecord[] = (choicesData as ChoiceRecord[]) || [];
        const enrichedTimeline = enrichChoicesWithStoryCatalog(choices);

        const mappedRun: RunRecord = {
          ...runData,
          class_code: runData.classes?.code,
          class_name: runData.classes?.name,
          choices_count: choices.length,
        };

        return {
          run: mappedRun,
          timeline: enrichedTimeline,
          isLive: true,
        };
      }
    } catch (err) {
      console.warn(`Erro ao consultar detalhes da partida ${runId} no Supabase:`, err);
    }
  }

  // Fallback para dados de demonstração
  const demoRun = DEMO_RUNS.find((r) => r.id === runId) || null;
  const rawChoices = DEMO_CHOICES[runId] || [];

  // Se o demoRun tiver escolhas no estado answered que não estão no DEMO_CHOICES, sintetiza
  if (demoRun && rawChoices.length === 0 && demoRun.state?.answered) {
    const synthChoices: ChoiceRecord[] = Object.entries(demoRun.state.answered).map(
      ([decisionId, optionId], idx) => ({
        run_id: runId,
        decision_id: decisionId,
        option_id: optionId,
        decision_type: decisionId.startsWith('K') ? 'K' : decisionId.startsWith('N') ? 'N' : 'P',
        response_ms: 3000 + idx * 400,
        timed_out: false,
        chosen_at: new Date(new Date(demoRun.started_at).getTime() + idx * 3 * 60 * 1000).toISOString(),
      })
    );
    return {
      run: demoRun,
      timeline: enrichChoicesWithStoryCatalog(synthChoices),
      isLive: false,
    };
  }

  return {
    run: demoRun,
    timeline: enrichChoicesWithStoryCatalog(rawChoices),
    isLive: false,
  };
}

/**
 * Calcula métricas agregadas da turma para o dashboard
 */
export function calculateClassMetrics(runs: RunRecord[]): ProfessorDashboardMetrics {
  const totalRuns = runs.length;
  let inProgressRuns = 0;
  let completedRuns = 0;
  let abandonedRuns = 0;
  let totalDurationMs = 0;
  let completedWithDuration = 0;
  let sumCohesion = 0;

  const endingDistribution: Record<string, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  for (const r of runs) {
    if (r.status === 'in_progress') inProgressRuns++;
    if (r.status === 'completed') {
      completedRuns++;
      if (r.ending) {
        endingDistribution[r.ending] = (endingDistribution[r.ending] || 0) + 1;
      }
      if (r.total_ms) {
        totalDurationMs += r.total_ms;
        completedWithDuration++;
      }
    }
    if (r.status === 'abandoned') abandonedRuns++;

    // Coesão
    const vars = r.state?.vars;
    if (vars) {
      const coesao = (vars.LB ?? 0) + (vars.BR ?? 0) + (vars.RL ?? 0);
      sumCohesion += coesao;
    }
  }

  return {
    totalRuns,
    inProgressRuns,
    completedRuns,
    abandonedRuns,
    averageDurationMs: completedWithDuration > 0 ? Math.round(totalDurationMs / completedWithDuration) : 0,
    averageCohesion: totalRuns > 0 ? Number((sumCohesion / totalRuns).toFixed(1)) : 0,
    endingDistribution: endingDistribution as any,
  };
}

/**
 * Salva ou atualiza uma partida no Supabase a partir do cliente ou rota da API
 */
export async function syncRunProgressToSupabase(payload: {
  runId: string;
  playerName: string;
  classCode?: string;
  currentNode: string;
  state: {
    vars: any;
    flags: any;
    answered?: Record<string, string>;
  };
  status?: 'in_progress' | 'completed' | 'abandoned';
  mirror?: Record<string, number>;
  scores?: any;
  ending?: string;
  totalMs?: number;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient() || getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado.' };
  }

  try {
    // 1. Resolve id da turma se código foi fornecido
    let classId: string | null = null;
    const targetCode = payload.classCode?.trim().toUpperCase() || 'GERAL';

    const { data: classData } = await supabase
      .from('classes')
      .select('id')
      .eq('code', targetCode)
      .maybeSingle();

    if (classData) {
      classId = classData.id;
    }

    // 2. Prepara objeto para upsert
    const runObj: any = {
      id: payload.runId,
      player_name: payload.playerName,
      current_node: payload.currentNode,
      state: payload.state,
      status: payload.status || 'in_progress',
      updated_at: new Date().toISOString(),
    };

    if (classId) {
      runObj.class_id = classId;
    }
    if (payload.mirror) {
      runObj.mirror = payload.mirror;
    }
    if (payload.scores) {
      runObj.scores = payload.scores;
    }
    if (payload.ending) {
      runObj.ending = payload.ending;
    }
    if (payload.totalMs) {
      runObj.total_ms = payload.totalMs;
    }
    if (payload.status === 'completed') {
      runObj.completed_at = new Date().toISOString();
    }

    const { error: upsertError } = await supabase
      .from('runs')
      .upsert(runObj, { onConflict: 'id' });

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro inesperado' };
  }
}

/**
 * Grava uma escolha pontual tomada pelo jogador
 */
export async function recordChoiceToSupabase(choice: {
  runId: string;
  decisionId: string;
  optionId: string;
  decisionType: 'P' | 'K' | 'N';
  responseMs?: number;
  timedOut?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient() || getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado.' };
  }

  try {
    const { error } = await supabase
      .from('choices')
      .upsert(
        {
          run_id: choice.runId,
          decision_id: choice.decisionId,
          option_id: choice.optionId,
          decision_type: choice.decisionType,
          response_ms: choice.responseMs || null,
          timed_out: choice.timedOut || false,
          chosen_at: new Date().toISOString(),
        },
        { onConflict: 'run_id,decision_id' }
      );

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro inesperado' };
  }
}

/**
 * Exclui uma partida e suas escolhas (atendimento à LGPD/direito de exclusão do aluno)
 */
export async function deletePlayerRun(runId: string): Promise<boolean> {
  const supabase = createAdminClient() || getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('runs').delete().eq('id', runId);
      return !error;
    } catch {
      return false;
    }
  }

  // Se for demo, simula exclusão na memória da sessão
  const idx = DEMO_RUNS.findIndex((r) => r.id === runId);
  if (idx !== -1) {
    DEMO_RUNS.splice(idx, 1);
    delete DEMO_CHOICES[runId];
    return true;
  }
  return false;
}
