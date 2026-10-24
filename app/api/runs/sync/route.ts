import { NextRequest, NextResponse } from 'next/server';
import { syncRunProgressToSupabase, recordChoiceToSupabase } from '@/lib/supabase/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === 'choice') {
      const res = await recordChoiceToSupabase({
        runId: body.runId,
        decisionId: body.decisionId,
        optionId: body.optionId,
        decisionType: body.decisionType,
        responseMs: body.responseMs,
        timedOut: body.timedOut,
      });
      return NextResponse.json(res);
    }

    if (body.type === 'run' || !body.type) {
      const res = await syncRunProgressToSupabase({
        runId: body.runId,
        playerName: body.playerName,
        classCode: body.classCode,
        currentNode: body.currentNode,
        state: body.state,
        status: body.status,
        mirror: body.mirror,
        scores: body.scores,
        ending: body.ending,
        totalMs: body.totalMs,
      });
      return NextResponse.json(res);
    }

    return NextResponse.json({ success: false, error: 'Tipo de sincronização desconhecido' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao sincronizar com Supabase' },
      { status: 500 }
    );
  }
}
