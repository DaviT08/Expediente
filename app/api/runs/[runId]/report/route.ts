import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ message: 'API runs/[runId]/report (Fase F3)' }, { status: 501 });
}
