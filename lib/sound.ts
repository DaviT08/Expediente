// Sons curtos gerados no navegador (Web Audio), sem arquivos de áudio.
// O volume vem das Opções (0 = mudo).

export type Sfx = 'click' | 'up' | 'down' | 'tick' | 'timeout';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  ac: AudioContext,
  volume: number,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'square',
  peak = 0.12
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  const t0 = ac.currentTime + start;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak * volume), t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function playSfx(name: Sfx, volume = 0.8) {
  if (!volume || volume <= 0) return;
  const ac = getCtx();
  if (!ac) return;
  try {
    switch (name) {
      case 'click': // escolha confirmada
        tone(ac, volume, 660, 0, 0.05, 'square', 0.08);
        tone(ac, volume, 990, 0.04, 0.06, 'square', 0.06);
        break;
      case 'up': // confiança ▲
        tone(ac, volume, 523, 0, 0.09, 'triangle', 0.18);
        tone(ac, volume, 659, 0.08, 0.09, 'triangle', 0.18);
        tone(ac, volume, 784, 0.16, 0.14, 'triangle', 0.18);
        break;
      case 'down': // confiança ▼
        tone(ac, volume, 392, 0, 0.1, 'triangle', 0.18);
        tone(ac, volume, 311, 0.09, 0.18, 'triangle', 0.18);
        break;
      case 'tick': // últimos segundos do cronômetro
        tone(ac, volume, 1200, 0, 0.03, 'square', 0.05);
        break;
      case 'timeout': // tempo esgotado
        tone(ac, volume, 220, 0, 0.25, 'sawtooth', 0.08);
        break;
    }
  } catch {
    // sem som não impede o jogo
  }
}
