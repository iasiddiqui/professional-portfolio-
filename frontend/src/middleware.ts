import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_ROUTE_PREFIXES, ROUTES } from '@/constants/routes';

const PROTECTED_PREFIXES = ADMIN_ROUTE_PREFIXES;

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const verifyUrl = new URL('/api/proxy/v1/auth/me', request.url);

  try {
    const response = await fetch(verifyUrl, {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
        accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as { success?: boolean };
    return payload.success === true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NEXT_PUBLIC_ALLOW_REGISTRATION !== 'true' && pathname === ROUTES.register) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  if (isProtectedRoute(pathname)) {
    const authenticated = await hasValidSession(request);

    if (!authenticated) {
      const loginUrl = new URL(ROUTES.login, request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
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
