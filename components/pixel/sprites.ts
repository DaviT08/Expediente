// Gerador de sprites em pixel art (busto chibi 24x28).
// Cada personagem é desenhado com formas simples; o contorno é calculado automaticamente.
import type { CharacterId } from '@/content/characters';
import type { Expression } from '@/content/tags';

export const SPRITE_W = 24;
export const SPRITE_H = 28;
const OUTLINE = '#1a1423';
const EYE = '#1a1423';

type Grid = (string | null)[][];
export interface Rect { x: number; y: number; w: number; c: string }
export interface SpriteLayers {
  outline: Rect[];
  base: Rect[];
  eyesOpen: Rect[];
  eyesBlink: Rect[];
  mouthIdle: Rect[];
  mouthTalk: Rect[];
}

interface Palette {
  skin: string; skinShade: string;
  hair: string; hairShade: string;
  shirt: string; shirtShade: string;
  accent?: string; accent2?: string;
}

const newGrid = (): Grid => Array.from({ length: SPRITE_H }, () => Array<string | null>(SPRITE_W).fill(null));

class Canvas {
  g: Grid = newGrid();
  px(x: number, y: number, c: string) {
    if (x >= 0 && x < SPRITE_W && y >= 0 && y < SPRITE_H) this.g[y][x] = c;
  }
  rect(x: number, y: number, w: number, h: number, c: string) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.px(i, j, c);
  }
  row(y: number, x0: number, x1: number, c: string) {
    for (let i = x0; i <= x1; i++) this.px(i, y, c);
  }
  ellipse(cx: number, cy: number, rx: number, ry: number, c: string) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.px(x, y, c);
      }
  }
}

function toRects(g: Grid): Rect[] {
  const out: Rect[] = [];
  for (let y = 0; y < g.length; y++) {
    let x = 0;
    while (x < SPRITE_W) {
      const c = g[y][x];
      if (!c) { x++; continue; }
      let w = 1;
      while (x + w < SPRITE_W && g[y][x + w] === c) w++;
      out.push({ x, y, w, c });
      x += w;
    }
  }
  return out;
}

function outlineOf(g: Grid): Grid {
  const o = newGrid();
  for (let y = 0; y < SPRITE_H; y++)
    for (let x = 0; x < SPRITE_W; x++) {
      if (g[y][x]) continue;
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => g[y + dy]?.[x + dx]);
      if (n) o[y][x] = OUTLINE;
    }
  return o;
}

// ---------- corpo base ----------
function body(cv: Canvas, p: Palette) {
  // tronco
  cv.row(19, 6, 17, p.shirt);
  cv.row(20, 4, 19, p.shirt);
  cv.rect(3, 21, 18, 7, p.shirt);
  cv.rect(18, 21, 3, 7, p.shirtShade);
  cv.row(20, 17, 19, p.shirtShade);
  // pescoço
  cv.rect(10, 16, 4, 3, p.skin);
  cv.row(16, 10, 13, p.skinShade);
  // cabeça
  cv.row(3, 8, 15, p.skin);
  cv.row(4, 7, 16, p.skin);
  cv.rect(6, 5, 12, 9, p.skin);
  cv.row(14, 7, 16, p.skin);
  cv.row(15, 8, 15, p.skinShade);
  cv.rect(16, 11, 1, 3, p.skinShade);
  // orelhas
  cv.rect(5, 9, 1, 3, p.skin);
  cv.rect(18, 9, 1, 3, p.skinShade);
}

// ---------- cabelos ----------
type HairFn = (cv: Canvas, p: Palette) => void;

const HAIR: Record<string, HairFn> = {
  curlyPuff: (cv, p) => {
    cv.ellipse(12, 4.5, 9.5, 5.5, p.hair);
    cv.rect(4, 5, 3, 8, p.hair);
    cv.rect(17, 5, 3, 8, p.hair);
    cv.row(6, 6, 17, p.hair);
    cv.row(7, 6, 8, p.hair); cv.row(7, 15, 17, p.hair);
    for (let y = 0; y < 13; y++) for (let x = 3; x < 21; x++)
      if (cv.g[y][x] === p.hair && (x * 3 + y * 5) % 7 === 0) cv.px(x, y, p.hairShade);
    // faixa no cabelo
    if (p.accent) { cv.row(4, 6, 17, p.accent); cv.px(5, 5, p.accent); cv.px(18, 5, p.accent); }
  },
  shortCrop: (cv, p) => {
    cv.row(2, 8, 15, p.hair);
    cv.rect(6, 3, 12, 3, p.hair);
    cv.row(6, 6, 17, p.hair);
    cv.rect(6, 7, 1, 4, p.hair); cv.rect(17, 7, 1, 4, p.hair);
    cv.row(3, 9, 14, p.hairShade);
  },
  sidePart: (cv, p) => {
    cv.row(2, 8, 16, p.hair);
    cv.rect(6, 3, 12, 3, p.hair);
    cv.row(6, 6, 9, p.hair); cv.row(6, 11, 17, p.hair);
    cv.row(7, 12, 17, p.hair);
    cv.rect(6, 7, 1, 3, p.hair); cv.rect(17, 7, 1, 4, p.hair);
    cv.rect(9, 2, 1, 4, p.hairShade);
    cv.row(5, 12, 16, p.hairShade);
  },
  bob: (cv, p) => {
    cv.row(2, 8, 15, p.hair);
    cv.rect(5, 3, 14, 4, p.hair);
    cv.row(7, 5, 10, p.hair); cv.row(7, 16, 18, p.hair);
    cv.rect(5, 8, 2, 6, p.hair); cv.rect(17, 8, 2, 6, p.hair);
    cv.row(14, 4, 6, p.hair); cv.row(14, 17, 19, p.hair);
    cv.rect(13, 2, 1, 5, p.hairShade); cv.rect(14, 3, 1, 3, p.hairShade);
  },
  long: (cv, p) => {
    cv.row(2, 8, 15, p.hair);
    cv.rect(5, 3, 14, 3, p.hair);
    cv.row(6, 5, 7, p.hair); cv.row(6, 12, 18, p.hair); cv.row(7, 14, 18, p.hair);
    cv.rect(4, 6, 3, 15, p.hair); cv.rect(17, 7, 3, 14, p.hair);
    cv.rect(5, 8, 1, 12, p.hairShade); cv.rect(18, 9, 1, 11, p.hairShade);
    cv.row(3, 9, 12, p.hairShade);
  },
  bald: (cv, p) => {
    cv.rect(5, 7, 2, 5, p.hair); cv.rect(17, 7, 2, 5, p.hair);
    cv.row(4, 10, 13, p.skinShade);
  },
  capBack: (cv, p) => {
    const cap = p.accent ?? '#c0392b';
    cv.row(1, 8, 15, cap);
    cv.rect(6, 2, 12, 4, cap);
    cv.row(5, 6, 17, p.accent2 ?? '#922b21');
    cv.rect(16, 4, 4, 2, p.accent2 ?? '#922b21');
    cv.rect(6, 6, 1, 4, p.hair); cv.rect(17, 6, 1, 4, p.hair);
    cv.row(6, 7, 9, p.hair);
    cv.px(11, 3, '#ffffff');
  },
  bunTop: (cv, p) => {
    cv.ellipse(12, 1.5, 3, 2, p.hair);
    cv.row(2, 8, 15, p.hair);
    cv.rect(6, 3, 12, 3, p.hair);
    cv.row(6, 6, 8, p.hair); cv.row(6, 15, 17, p.hair);
    cv.rect(6, 7, 1, 4, p.hair); cv.rect(17, 7, 1, 4, p.hair);
    cv.px(11, 1, p.hairShade); cv.px(13, 2, p.hairShade);
    if (p.accent) cv.row(3, 9, 14, p.accent);
  },
  strawHat: (cv, p) => {
    const straw = p.accent ?? '#e9c46a', band = p.accent2 ?? '#8d5524';
    cv.rect(6, 6, 1, 4, p.hair); cv.rect(17, 6, 1, 4, p.hair);
    cv.row(0, 9, 14, straw);
    cv.rect(7, 1, 10, 4, straw);
    cv.row(4, 7, 16, band);
    cv.row(5, 2, 21, straw);
    cv.row(6, 3, 20, '#c9a227');
    cv.px(9, 2, '#c9a227'); cv.px(13, 1, '#c9a227'); cv.px(15, 3, '#c9a227');
  },
  pigtails: (cv, p) => {
    cv.row(3, 8, 15, p.hair);
    cv.rect(6, 4, 12, 2, p.hair);
    cv.row(6, 6, 10, p.hair); cv.row(6, 13, 17, p.hair);
    cv.ellipse(3.5, 9.5, 2, 3, p.hair); cv.ellipse(20.5, 9.5, 2, 3, p.hair);
    const rib = p.accent ?? '#ff6fae';
    cv.rect(4, 6, 2, 1, rib); cv.rect(18, 6, 2, 1, rib);
  },
  slick: (cv, p) => {
    cv.row(2, 8, 15, p.hair);
    cv.rect(6, 3, 12, 3, p.hair);
    cv.row(6, 6, 7, p.hair); cv.row(6, 16, 17, p.hair);
    cv.rect(6, 7, 1, 3, p.hair); cv.rect(17, 7, 1, 3, p.hair);
    cv.row(3, 8, 13, p.hairShade); cv.row(4, 14, 16, p.hairShade);
  },
};

// ---------- acessórios ----------
type ExtraFn = (cv: Canvas, p: Palette) => void;
const EXTRAS: Record<string, ExtraFn> = {
  beard: (cv, p) => {
    cv.rect(6, 11, 1, 3, p.hair); cv.rect(17, 11, 1, 3, p.hair);
    cv.row(13, 7, 16, p.hair); cv.row(14, 7, 16, p.hair); cv.row(15, 8, 15, p.hair);
    cv.row(12, 9, 14, p.hair);
    cv.row(13, 10, 13, p.skin); // espaço da boca
  },
  mustache: (cv, p) => { cv.row(12, 9, 14, p.hair); cv.px(8, 13, p.hair); cv.px(15, 13, p.hair); },
  glasses: (cv) => {
    const f = '#2b2135';
    cv.row(9, 7, 10, f); cv.row(12, 7, 10, f); cv.rect(7, 9, 1, 4, f); cv.rect(10, 9, 1, 4, f);
    cv.row(9, 13, 16, f); cv.row(12, 13, 16, f); cv.rect(13, 9, 1, 4, f); cv.rect(16, 9, 1, 4, f);
    cv.row(10, 11, 12, f);
    cv.rect(8, 10, 2, 2, '#d7e7f5'); cv.rect(14, 10, 2, 2, '#d7e7f5');
  },
  earrings: (cv, p) => { cv.px(5, 12, p.accent2 ?? '#f4d03f'); cv.px(18, 12, p.accent2 ?? '#f4d03f'); },
  collar: (cv) => { cv.px(9, 19, '#ffffff'); cv.px(10, 20, '#ffffff'); cv.px(14, 19, '#ffffff'); cv.px(13, 20, '#ffffff'); },
  lanyard: (cv, p) => {
    const l = p.accent ?? '#2B7A8C';
    cv.px(9, 20, l); cv.px(10, 21, l); cv.px(11, 22, l); cv.px(14, 20, l); cv.px(13, 21, l); cv.px(12, 22, l);
    cv.rect(10, 23, 4, 3, '#f5f5f5'); cv.row(23, 10, 13, l);
  },
  vest: (cv) => {
    const v = '#d4e157', s = '#eceff1';
    cv.rect(3, 21, 6, 7, v); cv.rect(15, 21, 6, 7, v);
    cv.row(20, 5, 8, v); cv.row(20, 15, 18, v);
    cv.row(24, 3, 8, s); cv.row(24, 15, 20, s);
    cv.rect(18, 21, 3, 7, '#b5c23a'); cv.row(24, 18, 20, '#cfd8dc');
  },
  blazer: (cv, p) => {
    cv.rect(10, 19, 4, 9, p.accent ?? '#f5f5f5');
    cv.px(9, 20, p.shirtShade); cv.px(9, 21, p.shirtShade); cv.px(10, 22, p.shirtShade); cv.px(10, 23, p.shirtShade);
    cv.px(14, 20, p.shirtShade); cv.px(14, 21, p.shirtShade); cv.px(13, 22, p.shirtShade); cv.px(13, 23, p.shirtShade);
    cv.rect(10, 24, 4, 4, p.shirt);
  },
  tie: (cv) => { cv.rect(11, 20, 2, 1, '#b03a2e'); cv.rect(11, 21, 2, 5, '#c0392b'); cv.px(11, 26, '#b03a2e'); },
  logo: (cv) => { cv.px(16, 22, '#7bd389'); cv.px(17, 22, '#7bd389'); cv.px(16, 23, '#4caf50'); },
  plaid: (cv, p) => {
    for (let y = 20; y < 28; y++) for (let x = 3; x < 21; x++)
      if (cv.g[y][x] && (x % 4 === 0 || y % 4 === 0)) cv.px(x, y, p.shirtShade);
  },
  heart: (cv) => { cv.px(11, 23, '#ffffff'); cv.px(13, 23, '#ffffff'); cv.row(24, 11, 13, '#ffffff'); cv.px(12, 25, '#ffffff'); },
  sweaterCollar: (cv) => { cv.px(9, 19, '#ffffff'); cv.px(14, 19, '#ffffff'); cv.row(19, 10, 13, '#ffffff'); },
  wrinkles: (cv, p) => { cv.px(7, 12, p.skinShade); cv.px(16, 12, p.skinShade); },
};

// ---------- personagens ----------
interface CharSpec { hair: string; extras: string[]; pal: Palette; brows?: string }

const SKIN = {
  light: ['#f6d2b8', '#e2b394'], tan: ['#e0a878', '#c88a5c'], brown: ['#b97a50', '#9c623c'], dark: ['#8a5a3c', '#70462c'],
};

export const CHAR_SPECS: Partial<Record<CharacterId, CharSpec>> = {
  lia: { hair: 'curlyPuff', extras: ['lanyard', 'earrings'], pal: { skin: SKIN.brown[0], skinShade: SKIN.brown[1], hair: '#2a1a14', hairShade: '#4a2e22', shirt: '#E0A526', shirtShade: '#b9831a', accent: '#2B7A8C', accent2: '#f4d03f' } },
  bruno: { hair: 'shortCrop', extras: ['beard', 'vest'], pal: { skin: SKIN.tan[0], skinShade: SKIN.tan[1], hair: '#3b2a20', hairShade: '#5a4030', shirt: '#2B7A8C', shirtShade: '#1f5c69' } },
  rafa: { hair: 'sidePart', extras: ['glasses', 'sweaterCollar'], pal: { skin: SKIN.light[0], skinShade: SKIN.light[1], hair: '#1c1c2a', hairShade: '#36364d', shirt: '#8E6CC4', shirtShade: '#6c4fa0' } },
  marta: { hair: 'bob', extras: ['blazer', 'earrings', 'wrinkles'], pal: { skin: SKIN.light[0], skinShade: SKIN.light[1], hair: '#5c4033', hairShade: '#b8b0a8', shirt: '#9a3f12', shirtShade: '#73300d', accent: '#f8efe2', accent2: '#e5c07b' } },
  patricia: { hair: 'long', extras: ['blazer'], pal: { skin: SKIN.tan[0], skinShade: SKIN.tan[1], hair: '#7b3f1d', hairShade: '#a0582c', shirt: '#d6417e', shirtShade: '#a82e60', accent: '#1f1f2e' } },
  jorge: { hair: 'bald', extras: ['mustache', 'logo', 'collar', 'wrinkles'], pal: { skin: SKIN.dark[0], skinShade: SKIN.dark[1], hair: '#dcdcdc', hairShade: '#b0b0b0', shirt: '#2e8b57', shirtShade: '#216a42' } },
  kaio: { hair: 'capBack', extras: ['logo'], pal: { skin: SKIN.brown[0], skinShade: SKIN.brown[1], hair: '#1a1a1a', hairShade: '#333', shirt: '#f08a24', shirtShade: '#c46d17', accent: '#1d6fb8', accent2: '#15528a' } },
  dani: { hair: 'bunTop', extras: ['logo', 'collar'], pal: { skin: SKIN.dark[0], skinShade: SKIN.dark[1], hair: '#1b120e', hairShade: '#3a2a22', shirt: '#1fa5bd', shirtShade: '#178397', accent: '#ffd166' } },
  seu_antonio: { hair: 'strawHat', extras: ['mustache', 'plaid', 'wrinkles'], pal: { skin: SKIN.tan[0], skinShade: SKIN.tan[1], hair: '#e8e8e8', hairShade: '#c4c4c4', shirt: '#7cb342', shirtShade: '#558b2f' } },
  sofia: { hair: 'pigtails', extras: ['heart'], pal: { skin: SKIN.tan[0], skinShade: SKIN.tan[1], hair: '#3b2a20', hairShade: '#5a4030', shirt: '#f472b6', shirtShade: '#d14f94', accent: '#ffe066' } },
  henrique: { hair: 'slick', extras: ['blazer', 'tie'], pal: { skin: SKIN.light[0], skinShade: SKIN.light[1], hair: '#2d2d2d', hairShade: '#5e5e5e', shirt: '#5d6d7e', shirtShade: '#46535f', accent: '#f5f5f5' } },
};

// ---------- rosto ----------
function face(expr: Expression, p: Palette, hasGlasses: boolean) {
  const eyesOpen = new Canvas(), eyesBlink = new Canvas(), mouthIdle = new Canvas(), mouthTalk = new Canvas(), extra = new Canvas();
  const L = 8, R = 14; // colunas dos olhos (2px)
  const brow = p.hair === '#e8e8e8' || p.hair === '#dcdcdc' ? '#9e9e9e' : p.hair;
  const mouth = '#7a2e2e';
  if (expr === 'sorrindo') {
    for (const x of [L, R]) { eyesOpen.px(x, 11, EYE); eyesOpen.px(x + 1, 10, EYE); eyesOpen.px(x + 2, 11, EYE); }
    for (const x of [L, R]) { eyesBlink.px(x, 11, EYE); eyesBlink.px(x + 1, 10, EYE); eyesBlink.px(x + 2, 11, EYE); }
    mouthIdle.px(10, 13, mouth); mouthIdle.px(13, 13, mouth); mouthIdle.row(14, 11, 12, mouth);
    mouthTalk.row(13, 10, 13, mouth); mouthTalk.row(14, 11, 12, '#e35d6a');
    if (!hasGlasses) { extra.px(7, 12, '#f28b9a'); extra.px(16, 12, '#f28b9a'); }
  } else {
    for (const x of [L, R]) {
      eyesOpen.rect(x, 10, 2, 2, EYE);
      if (expr === 'neutro') eyesOpen.px(x, 10, '#ffffff');
      eyesBlink.row(11, x, x + 1, EYE);
    }
    if (expr === 'tenso') {
      mouthIdle.px(10, 14, mouth); mouthIdle.px(11, 13, mouth); mouthIdle.px(12, 14, mouth); mouthIdle.px(13, 13, mouth);
      mouthTalk.row(13, 10, 13, mouth); mouthTalk.row(14, 10, 13, mouth);
      extra.px(17, 6, '#7fd3f7'); extra.px(17, 7, '#7fd3f7'); extra.px(16, 7, '#bfe9fb');
    } else {
      mouthIdle.row(13, 11, 12, mouth);
      mouthTalk.rect(11, 13, 2, 2, mouth); mouthTalk.px(11, 14, '#e35d6a');
    }
  }
  // sobrancelhas
  if (expr === 'tenso') {
    extra.px(L, 8, brow); extra.px(L + 1, 7, brow); extra.px(R + 1, 8, brow); extra.px(R, 7, brow);
  } else if (!hasGlasses) {
    extra.row(8, L, L + 1, brow); extra.row(8, R, R + 1, brow);
  }
  return { eyesOpen, eyesBlink, mouthIdle, mouthTalk, extra };
}

const cache = new Map<string, SpriteLayers>();

export function getSprite(id: CharacterId, expr: Expression): SpriteLayers | null {
  const spec = CHAR_SPECS[id];
  if (!spec) return null;
  const key = `${id}:${expr}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const cv = new Canvas();
  body(cv, spec.pal);
  HAIR[spec.hair](cv, spec.pal);
  for (const e of spec.extras) EXTRAS[e](cv, spec.pal);
  const f = face(expr, spec.pal, spec.extras.includes('glasses'));
  // detalhes do rosto (sobrancelhas, bochechas, suor) entram na base
  for (let y = 0; y < SPRITE_H; y++) for (let x = 0; x < SPRITE_W; x++) if (f.extra.g[y][x]) cv.g[y][x] = f.extra.g[y][x];
  const layers: SpriteLayers = {
    outline: toRects(outlineOf(cv.g)),
    base: toRects(cv.g),
    eyesOpen: toRects(f.eyesOpen.g),
    eyesBlink: toRects(f.eyesBlink.g),
    mouthIdle: toRects(f.mouthIdle.g),
    mouthTalk: toRects(f.mouthTalk.g),
  };
  cache.set(key, layers);
  return layers;
}
