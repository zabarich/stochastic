import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'SDE Solver API is running',
    timestamp: new Date().toISOString()
  });
}