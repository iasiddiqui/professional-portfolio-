import { NextResponse, type NextRequest } from 'next/server';

import { AUTH_COOKIE_NAMES } from '@/constants/auth-cookies';
import { ADMIN_ROUTE_PREFIXES, ROUTES } from '@/constants/routes';

const PROTECTED_PREFIXES = ADMIN_ROUTE_PREFIXES;

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/** Fast gate: cookie presence only. Session validity is checked client-side via AuthProvider. */
function hasAuthCookies(request: NextRequest): boolean {
  return (
    request.cookies.has(AUTH_COOKIE_NAMES.accessToken) ||
    request.cookies.has(AUTH_COOKIE_NAMES.refreshToken)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NEXT_PUBLIC_ALLOW_REGISTRATION !== 'true' && pathname === ROUTES.register) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  if (isProtectedRoute(pathname) && !hasAuthCookies(request)) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/leads/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/register',
  ],
};
