import { NextRequest, NextResponse } from 'next/server';
import { isProfessor, unauthorized } from '@/lib/professorAuth';
import { getTeacherRuns } from '@/lib/supabase/service';
import { computeOverview } from '@/lib/professorStats';

// Visão da turma + frequência das opções (aba Decisões)
export async function GET(request: NextRequest) {
  if (!isProfessor(request)) return unauthorized();
  try {
    const classId = request.nextUrl.searchParams.get('classId') || 'all';
    const { runs, isLive } = await getTeacherRuns({ classId });
    return NextResponse.json({ success: true, isLive, ...computeOverview(runs) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao calcular a visão da turma';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
