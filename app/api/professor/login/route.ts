import { NextRequest, NextResponse } from 'next/server';
import {
  checkPassword,
  clearSessionCookie,
  isPasswordConfigured,
  isProfessor,
  setSessionCookie,
} from '@/lib/professorAuth';

// GET: o professor está logado?
export async function GET(request: NextRequest) {
  return NextResponse.json({
    loggedIn: isProfessor(request),
    configured: isPasswordConfigured(),
  });
}

// POST: entrar com a senha
export async function POST(request: NextRequest) {
  if (!isPasswordConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Defina a variável PROFESSOR_PASSWORD na Vercel e faça um novo deploy.' },
      { status: 503 }
    );
  }
  let body: { password?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    // corpo inválido: trata como senha vazia
  }
  const attempt = typeof body.password === 'string' ? body.password : '';
  if (!checkPassword(attempt)) {
    // pequena espera para dificultar tentativas em massa
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ success: false, error: 'Senha incorreta.' }, { status: 401 });
  }
  const res = NextResponse.json({ success: true });
  setSessionCookie(res);
  return res;
}

// DELETE: sair
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  clearSessionCookie(res);
  return res;
}
