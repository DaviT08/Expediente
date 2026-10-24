import { create } from 'zustand';
import { Var, Flag, Effect, Line } from '@/content/tags';
import { playSfx } from '@/lib/sound';

export interface GameSettings {
  textSize: 'normal' | 'large' | 'xlarge';
  textSpeed: number; // ms por caractere (padrão 25ms => ~40 chars/s)
  disableTimer: boolean;
  soundVolume: number;
  musicVolume: number;
  reduceMotion: boolean;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'up' | 'down' | 'info';
}

export interface GameState {
  // Dados da sessão
  runId: string;
  clientToken: string;
  playerName: string;
  classCode: string;
  startedAt: string;
  consentAt: string;
  consent: boolean;

  // Estado narrativo
  nodeId: string;
  lineIndex: number;
  inReaction: boolean;
  reactionLines: { speaker?: string; expression?: string; text: string }[];
  reactionNextNode: string;
  
  // Variáveis e flags (§5.4)
  vars: Record<Var, number>;
  flags: Record<Flag, boolean>;
  answered: Record<string, string>; // decisionId -> optionId
  mirror: Record<string, number> | null; // autoavaliação do Espelho (§8.3)
  completedAt: string;

  // UI e Notificações
  toasts: ToastMessage[];
  isPaused: boolean;
  isCompleted: boolean;
  settings: GameSettings;

  // Ações
  initGame: (playerName: string, classCode: string) => void;
  loadSavedGame: () => boolean;
  hasSavedGame: () => boolean;
  clearSavedGame: () => void;
  advanceDialogue: () => void;
  selectOption: (
    decisionId: string,
    optionId: string,
    effects: Effect[],
    reactionLines: Line[],
    nextNode: string,
    meta?: { responseMs?: number; timedOut?: boolean }
  ) => void;
  applyEffects: (effects: Effect[]) => void;
  setNode: (nodeId: string) => void;
  setPaused: (isPaused: boolean) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  addToast: (text: string, type: 'up' | 'down' | 'info') => void;
  removeToast: (id: string) => void;
  saveMirror: (mirror: Record<string, number>) => void;
}

const STORAGE_KEY = 'expediente_save_state_v1';

const DEFAULT_SETTINGS: GameSettings = {
  textSize: 'normal',
  textSpeed: 25,
  disableTimer: false,
  soundVolume: 0.8,
  musicVolume: 0.5,
  reduceMotion: false,
};

function clampVar(name: Var, val: number): number {
  if (name === 'LB' || name === 'BR' || name === 'RL') {
    return Math.max(-3, Math.min(3, val));
  }
  return val;
}

// Identificador aleatório no formato que o banco espera (UUID)
function newUuid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  } catch {}
  const b = new Uint8Array(16);
  try {
    crypto.getRandomValues(b);
  } catch {
    for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
  }
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Envia o progresso ao servidor para o painel do professor.
 * Acontece só em 3 momentos: início da partida, cada decisão e conclusão do Espelho.
 * Se falhar (sem internet), tenta mais uma vez depois de 4 s; o jogo continua normalmente.
 */
function syncToServer(
  state: Partial<GameState>,
  extra: { choice?: { decisionId: string; optionId: string; responseMs?: number; timedOut?: boolean }; completed?: boolean } = {}
) {
  try {
    if (typeof window === 'undefined' || !state?.runId || !state?.playerName) return;
    const body = JSON.stringify({
      runId: state.runId,
      clientToken: state.clientToken,
      playerName: state.playerName,
      classCode: state.classCode || 'GERAL',
      consentAt: state.consentAt || state.startedAt,
      startedAt: state.startedAt,
      currentNode: state.nodeId,
      state: { vars: state.vars, flags: state.flags, answered: state.answered ?? {} },
      completed: extra.completed ?? state.isCompleted ?? false,
      mirror: state.mirror,
      choice: extra.choice,
    });
    const send = (retry: boolean) =>
      fetch('/api/runs/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
        .then((r) => {
          if (!r.ok && r.status >= 500 && retry) setTimeout(() => send(false), 4000);
        })
        .catch(() => {
          if (retry) setTimeout(() => send(false), 4000);
        });
    send(true);
  } catch {}
}

function saveToLocalStorage(state: Partial<GameState>) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const dataToSave = {
        runId: state.runId,
        clientToken: state.clientToken,
        playerName: state.playerName,
        classCode: state.classCode,
        startedAt: state.startedAt,
        consentAt: state.consentAt,
        consent: state.consent,
        nodeId: state.nodeId,
        lineIndex: state.lineIndex,
        inReaction: state.inReaction,
        reactionLines: state.reactionLines,
        reactionNextNode: state.reactionNextNode,
        vars: state.vars,
        flags: state.flags,
        answered: state.answered,
        mirror: state.mirror,
        completedAt: state.completedAt,
        isCompleted: state.isCompleted,
        settings: state.settings,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  } catch (err) {
    console.warn('Falha ao salvar no localStorage:', err);
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  runId: '',
  clientToken: '',
  playerName: '',
  classCode: '',
  startedAt: '',
  consentAt: '',
  consent: false,

  nodeId: 'prologo_intro',
  lineIndex: 0,
  inReaction: false,
  reactionLines: [],
  reactionNextNode: '',

  vars: {
    LB: 0,
    BR: 0,
    RL: 0,
    COOP: 0,
  },
  flags: {
    F_DADOS: false,
    F_VOZ: false,
    F_SOFIA: false,
    F_SEGREDO: false,
    F_LIA_GUARDOU: false,
    K2_A: false,
  },
  answered: {},
  mirror: null,
  completedAt: '',

  toasts: [],
  isPaused: false,
  isCompleted: false,
  settings: DEFAULT_SETTINGS,

  initGame: (playerName: string, classCode: string) => {
    const runId = newUuid();
    const clientToken = newUuid();
    const startedAt = new Date().toISOString();

    const newState = {
      runId,
      clientToken,
      playerName,
      classCode,
      startedAt,
      consentAt: startedAt,
      consent: true,
      nodeId: 'prologo_intro',
      lineIndex: 0,
      inReaction: false,
      reactionLines: [],
      reactionNextNode: '',
      vars: { LB: 0, BR: 0, RL: 0, COOP: 0 },
      flags: {
        F_DADOS: false,
        F_VOZ: false,
        F_SOFIA: false,
        F_SEGREDO: false,
        F_LIA_GUARDOU: false,
        K2_A: false,
      },
      answered: {},
      mirror: null,
      completedAt: '',
      isPaused: false,
      isCompleted: false,
    };

    set(newState);
    saveToLocalStorage({ ...get(), ...newState });
    syncToServer(get());
  },

  hasSavedGame: () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return !!(parsed && parsed.runId && parsed.playerName);
    } catch {
      return false;
    }
  },

  loadSavedGame: () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const saved = JSON.parse(raw);
      if (saved && saved.runId) {
        // Partidas salvas antes desta versão usavam um código que o banco não aceita: gera um novo.
        const migrated = !UUID_RE.test(saved.runId) || !UUID_RE.test(saved.clientToken || '');
        if (migrated) {
          saved.runId = newUuid();
          saved.clientToken = newUuid();
          saved.consentAt = saved.consentAt || saved.startedAt;
        }
        set({
          ...saved,
          settings: { ...DEFAULT_SETTINGS, ...(saved.settings || {}) },
          isPaused: false,
        });
        if (migrated) {
          saveToLocalStorage(get());
          syncToServer(get());
        }
        return true;
      }
    } catch (err) {
      console.warn('Erro ao carregar partida salva:', err);
    }
    return false;
  },

  clearSavedGame: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Erro ao limpar partida salva:', err);
    }
  },

  advanceDialogue: () => {
    const { inReaction, reactionLines, lineIndex, reactionNextNode, setNode } = get();
    if (inReaction) {
      if (lineIndex + 1 < reactionLines.length) {
        const nextIdx = lineIndex + 1;
        set({ lineIndex: nextIdx });
        saveToLocalStorage(get());
      } else {
        // Fim da reação local, transiciona para o próximo nó
        set({ inReaction: false, reactionLines: [], lineIndex: 0 });
        setNode(reactionNextNode);
      }
    } else {
      const nextIdx = lineIndex + 1;
      set({ lineIndex: nextIdx });
      saveToLocalStorage(get());
    }
  },

  applyEffects: (effects: Effect[]) => {
    const state = get();
    const newVars = { ...state.vars };
    const newFlags = { ...state.flags };

    for (const eff of effects) {
      if (eff.op === 'add') {
        const oldVal = newVars[eff.var] ?? 0;
        const clamped = clampVar(eff.var, oldVal + eff.value);
        newVars[eff.var] = clamped;

        // Relation toast alert: "Lia ↔ Bruno · confiança ▲"
        if (eff.var === 'LB' && eff.value !== 0) {
          get().addToast(`Lia ↔ Bruno · confiança ${eff.value > 0 ? '▲' : '▼'}`, eff.value > 0 ? 'up' : 'down');
        } else if (eff.var === 'BR' && eff.value !== 0) {
          get().addToast(`Bruno ↔ Rafa · confiança ${eff.value > 0 ? '▲' : '▼'}`, eff.value > 0 ? 'up' : 'down');
        } else if (eff.var === 'RL' && eff.value !== 0) {
          get().addToast(`Rafa ↔ Lia · confiança ${eff.value > 0 ? '▲' : '▼'}`, eff.value > 0 ? 'up' : 'down');
        } else if (eff.var === 'COOP' && eff.value > 0) {
          get().addToast(`Cooperativa · engajamento ▲`, 'up');
        }
      } else if (eff.op === 'set') {
        newFlags[eff.flag] = eff.value;
      }
    }

    set({ vars: newVars, flags: newFlags });
    saveToLocalStorage(get());
  },

  selectOption: (decisionId, optionId, effects, reactionLines, nextNode, meta) => {
    const { answered, applyEffects } = get();
    if (answered[decisionId]) return; // evita registrar a mesma decisão duas vezes (clique duplo)
    playSfx('click', get().settings.soundVolume);
    // Registra escolha
    const newAnswered = { ...answered, [decisionId]: optionId };
    set({ answered: newAnswered });

    // Aplica efeitos (se houver)
    if (effects && effects.length > 0) {
      applyEffects(effects);
    }

    // Um único envio por decisão: escolha + estado já com os efeitos aplicados
    syncToServer(get(), {
      choice: { decisionId, optionId, responseMs: meta?.responseMs, timedOut: meta?.timedOut },
    });

    // Se houver falas de reação local, entra em reação
    if (reactionLines && reactionLines.length > 0) {
      set({
        inReaction: true,
        reactionLines,
        reactionNextNode: nextNode,
        lineIndex: 0,
      });
    } else {
      get().setNode(nextNode);
    }
    saveToLocalStorage(get());
  },

  setNode: (nodeId: string) => {
    set({
      nodeId,
      lineIndex: 0,
      inReaction: false,
      reactionLines: [],
    });
    saveToLocalStorage(get());
  },

  setPaused: (isPaused: boolean) => {
    set({ isPaused });
  },

  updateSettings: (newSettings: Partial<GameSettings>) => {
    const updated = { ...get().settings, ...newSettings };
    set({ settings: updated });
    saveToLocalStorage(get());
  },

  addToast: (text: string, type: 'up' | 'down' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, text, type }],
    }));
    if (type !== 'info') playSfx(type, get().settings.soundVolume);

    // Auto-remove após 2.5s (conforme GDD §10.2)
    setTimeout(() => {
      get().removeToast(id);
    }, 2500);
  },

  saveMirror: (mirror: Record<string, number>) => {
    set({ mirror, isCompleted: true, completedAt: new Date().toISOString() });
    saveToLocalStorage(get());
    syncToServer(get(), { completed: true });
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
