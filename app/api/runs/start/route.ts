import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ message: 'API runs/start (Fase F3)' }, { status: 501 });
}
