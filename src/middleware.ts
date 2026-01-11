import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { jwtDecode } from 'jwt-decode';
import { Role } from '@/types';

const handleI18n = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Route Protection
  if (pathname.startsWith('/admin')) {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/vi/login', request.url));
    }

    try {
      const decoded = jwtDecode<{ roles: Role }>(accessToken);
      if (decoded.roles !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL('/vi/login', request.url));
    }
  }

  // 2. Protected User Routes
  const isProtectedRoute = /^\/(vi|en)\/(cart|checkout|profile)/.test(pathname);

  if (isProtectedRoute) {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
       const locale = pathname.split('/')[1] || 'vi';
       const loginUrl = new URL(`/${locale}/login`, request.url);
       loginUrl.searchParams.set('redirect', pathname);
       return NextResponse.redirect(loginUrl);
    }

    try {
        jwtDecode(accessToken);
    } catch {
        const locale = pathname.split('/')[1] || 'vi';
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // 3. Fallback to i18n middleware
  return handleI18n(request);
}

export const config = {
  matcher: [
    '/',
    '/(vi|en)/:path*',
    '/admin/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
