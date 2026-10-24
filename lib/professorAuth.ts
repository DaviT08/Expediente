import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// Senha do painel do professor. Defina PROFESSOR_PASSWORD nas variáveis da Vercel.
export const COOKIE_NAME = 'exp_prof';
const MAX_AGE_S = 12 * 60 * 60; // 12 horas

function password(): string {
  return process.env.PROFESSOR_PASSWORD || '';
}

export function isPasswordConfigured(): boolean {
  return password().length > 0;
}

// Chave derivada da senha: trocar a senha encerra todas as sessões abertas.
function key(): Buffer {
  return createHash('sha256').update(`expediente-professor:${password()}`).digest();
}

function sign(payload: string): string {
  return createHmac('sha256', key()).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(attempt: string): boolean {
  if (!isPasswordConfigured()) return false;
  return safeEqual(attempt, password());
}

export function makeSessionCookie(): string {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE_S);
  return `${exp}.${sign(exp)}`;
}

export function isProfessor(request: NextRequest): boolean {
  if (!isPasswordConfigured()) return false;
  const value = request.cookies.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [exp, sig] = value.split('.');
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, sign(exp));
}

export function setSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, makeSessionCookie(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_S,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}

// Resposta padrão para rotas do professor sem login.
export function unauthorized() {
  return NextResponse.json(
    { success: false, error: 'Faça login com a senha do professor.' },
    { status: 401 }
  );
}
