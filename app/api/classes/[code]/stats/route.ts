import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ message: 'API classes/[code]/stats (Fase F3)' }, { status: 501 });
}
