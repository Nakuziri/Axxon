// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // If no token, continue as guest
  if (!token) return NextResponse.next();

  try {
    // If token is valid, redirect to dashboard from landing
    const { payload } = await jwtVerify(token, secret);

    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log('JWT verification failed in middleware:', err);
    return NextResponse.next(); // Treat as guest
  }
}

// Apply only to root route
export const config = {
  matcher: ['/'],
};
