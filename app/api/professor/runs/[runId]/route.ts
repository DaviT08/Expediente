import { NextRequest, NextResponse } from 'next/server';
import { getPlayerRunDetails, deletePlayerRun } from '@/lib/supabase/service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;
    if (!runId) {
      return NextResponse.json({ success: false, error: 'runId é obrigatório' }, { status: 400 });
    }

    const result = await getPlayerRunDetails(runId);
    if (!result.run) {
      return NextResponse.json({ success: false, error: 'Partida não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      run: result.run,
      timeline: result.timeline,
      isLive: result.isLive,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar detalhes da partida';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;
    if (!runId) {
      return NextResponse.json({ success: false, error: 'runId é obrigatório' }, { status: 400 });
    }

    const deleted = await deletePlayerRun(runId);
    return NextResponse.json({ success: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao excluir partida';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
