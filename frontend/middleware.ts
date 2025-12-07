// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('user_token')?.value;
  const { pathname } = request.nextUrl;

  console.log("Middleware:", pathname, "Token:", token ? "exists" : "missing");

  const protectedPaths = ['/dashboard', '/books', '/authors', '/users', '/borrows', '/profile'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isProtected && !token) {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    console.log("Redirecting to dashboard");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/books/:path*',
    '/authors/:path*',
    '/users/:path*',
    '/borrows/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};
