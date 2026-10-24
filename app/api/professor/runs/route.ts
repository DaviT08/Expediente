import { NextRequest, NextResponse } from 'next/server';
import { isProfessor, unauthorized } from '@/lib/professorAuth';
import { getTeacherRuns, calculateClassMetrics, getClasses } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  if (!isProfessor(request)) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId') || 'all';
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    const [runsResult, classes] = await Promise.all([
      getTeacherRuns({ classId, status, search }),
      getClasses(),
    ]);

    const metrics = calculateClassMetrics(runsResult.runs);

    return NextResponse.json({
      success: true,
      runs: runsResult.runs,
      metrics,
      classes,
      isLive: runsResult.isLive,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar dados do professor';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
