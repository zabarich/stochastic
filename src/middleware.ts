import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log the request to help debug
  console.log('Middleware - Path:', request.nextUrl.pathname);
  
  // Allow all requests to pass through
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};