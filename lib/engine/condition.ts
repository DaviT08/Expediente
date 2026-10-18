import { Condition, Var, Flag } from '@/content/tags';

export interface GameStateVariables {
  vars: Record<Var, number>;
  flags: Record<Flag, boolean>;
}

export function evalCondition(cond: Condition, state: GameStateVariables): boolean {
  if ('flag' in cond) {
    return !!state.flags[cond.flag] === cond.equals;
  }
  if ('var' in cond) {
    const val = state.vars[cond.var] ?? 0;
    if (cond.gte !== undefined && val < cond.gte) return false;
    if (cond.lt !== undefined && val >= cond.lt) return false;
    return true;
  }
  if ('all' in cond) {
    return cond.all.every((c) => evalCondition(c, state));
  }
  if ('any' in cond) {
    return cond.any.some((c) => evalCondition(c, state));
  }
  return true;
}
