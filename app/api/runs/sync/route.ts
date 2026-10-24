import { NextRequest, NextResponse } from 'next/server';
import { syncRun, type SyncPayload } from '@/lib/supabase/service';

// Recebe o progresso do aluno: 1 envio no início, 1 por decisão e 1 ao concluir.
export async function POST(request: NextRequest) {
  let body: SyncPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Corpo inválido' }, { status: 400 });
  }
  if (!body || typeof body.runId !== 'string' || typeof body.playerName !== 'string' || !body.state) {
    return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
  }
  const res = await syncRun(body);
  return NextResponse.json(
    { success: res.success, error: res.error },
    { status: res.success ? 200 : res.status ?? 200 }
  );
}
