import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ message: 'API runs/[runId]/choice (Fase F3)' }, { status: 501 });
}
