import { NextRequest, NextResponse } from 'next/server';
import { isProfessor, unauthorized } from '@/lib/professorAuth';
import { getAllChoices, getTeacherRuns } from '@/lib/supabase/service';
import { choicesCsv, runsCsv } from '@/lib/professorStats';

// Exporta CSV: ?tipo=partidas (uma linha por aluno) ou ?tipo=escolhas (uma linha por decisão)
export async function GET(request: NextRequest) {
  if (!isProfessor(request)) return unauthorized();
  try {
    const tipo = request.nextUrl.searchParams.get('tipo') === 'escolhas' ? 'escolhas' : 'partidas';
    const classId = request.nextUrl.searchParams.get('classId') || 'all';
    const { runs } = await getTeacherRuns({ classId });

    const csv =
      tipo === 'partidas' ? runsCsv(runs) : choicesCsv(runs, await getAllChoices(new Set(runs.map((r) => r.id))));

    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="expediente_${tipo}_${date}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao exportar';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
