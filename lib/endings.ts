import { COESAO_MIN, NEGOCIACAO_MIN } from '@/content/config';
import { Var, Flag, KNode } from '@/content/tags';
import { allStoryNodes } from '@/content/story';

export type EndingId = 'A' | 'B' | 'C' | 'D';

export interface EndingResult {
  ending: EndingId;
  coesao: number;
  negociacao: number;
  lb: number;
  br: number;
  rl: number;
  coop: number;
  fDados: boolean;
  fVoz: boolean;
}

export function calculateEnding(
  vars: Record<Var, number>,
  flags: Record<Flag, boolean>
): EndingResult {
  const lb = Math.max(-3, Math.min(3, vars.LB ?? 0));
  const br = Math.max(-3, Math.min(3, vars.BR ?? 0));
  const rl = Math.max(-3, Math.min(3, vars.RL ?? 0));
  const coesao = lb + br + rl;

  const fDados = !!flags.F_DADOS;
  const fVoz = !!flags.F_VOZ;
  const coop = vars.COOP ?? 0;
  const negociacao = (fDados ? 1 : 0) + (fVoz ? 1 : 0) + (coop >= 2 ? 1 : 0);

  let ending: EndingId;
  if (coesao >= COESAO_MIN && negociacao >= NEGOCIACAO_MIN) {
    ending = 'A';
  } else if (coesao < COESAO_MIN && negociacao >= NEGOCIACAO_MIN) {
    ending = 'B';
  } else if (coesao >= COESAO_MIN && negociacao < NEGOCIACAO_MIN) {
    ending = 'C';
  } else {
    ending = 'D';
  }

  return {
    ending,
    coesao,
    negociacao,
    lb,
    br,
    rl,
    coop,
    fDados,
    fVoz,
  };
}

/**
 * Reconstrói o estado de relações, flags e determina o Final canônico (§7.1)
 * a partir das escolhas gravadas no banco de dados e dos efeitos da narrativa.
 */
export function reconstructEndingFromServer(
  choices: { decision_id: string; option_id: string }[]
): EndingResult & { vars: Record<Var, number>; flags: Record<Flag, boolean> } {
  const vars: Record<Var, number> = {
    LB: 0,
    BR: 0,
    RL: 0,
    COOP: 0,
  };

  const flags: Record<Flag, boolean> = {
    F_DADOS: false,
    F_VOZ: false,
    F_SOFIA: false,
    F_SEGREDO: false,
    F_LIA_GUARDOU: false,
    K2_A: false,
  };

  // Momentos fixos M1, M2 e M3 (§11.3)
  vars.LB += 1; // M1 (cap1)
  vars.BR += 1; // M2 (cap1)
  vars.RL += 1; // M3 (cap2)

  const choiceMap = new Map<string, string>();
  for (const c of choices) {
    choiceMap.set(c.decision_id, c.option_id);
  }

  // Percorrer os nós de decisão K e N
  const kNodes = allStoryNodes.filter(
    (n): n is KNode => n.kind === 'decision' && (n.type === 'K' || n.type === 'N')
  );

  for (const node of kNodes) {
    const chosenOptionId = choiceMap.get(node.id);
    if (!chosenOptionId) continue;

    const opt = node.options.find((o) => o.id === chosenOptionId);
    if (!opt || !opt.effects) continue;

    for (const eff of opt.effects) {
      if (eff.op === 'add') {
        vars[eff.var] = (vars[eff.var] ?? 0) + eff.value;
      } else if (eff.op === 'set') {
        flags[eff.flag] = eff.value;
      }
    }
  }

  // Clampear as relações a [-3, +3] conforme §5.4
  vars.LB = Math.max(-3, Math.min(3, vars.LB));
  vars.BR = Math.max(-3, Math.min(3, vars.BR));
  vars.RL = Math.max(-3, Math.min(3, vars.RL));

  const result = calculateEnding(vars, flags);

  return {
    ...result,
    vars,
    flags,
  };
}
