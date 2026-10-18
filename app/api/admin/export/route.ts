import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ message: 'API admin/export (Fase F5)' }, { status: 501 });
}
