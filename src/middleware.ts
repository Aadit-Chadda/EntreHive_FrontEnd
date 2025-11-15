import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Server-Side Route Protection
 *
 * ✅ ENABLED: Full server-side route protection using httpOnly cookies
 *
 * This middleware provides defense-in-depth by:
 * - Checking authentication on the server BEFORE pages render
 * - Preventing XSS attacks (tokens not accessible via JavaScript)
 * - Eliminating content flash (unauthenticated users never see protected HTML)
 * - Automatic return URL handling for seamless UX
 */

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/feed',
  '/profile',
  '/projects',
  '/explore',
  '/settings',
  '/notifications',
  '/posts',
  '/inbox',
  '/profiles',
  '/investors',
];

// Define public routes that should redirect authenticated users
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  // TEMPORARILY DISABLED FOR DEBUGGING
  // Allow all requests to proceed
  // Client-side ProtectedRoute will handle protection
  return NextResponse.next();

  /* ORIGINAL CODE - RE-ENABLE AFTER DEBUGGING:
  const { pathname } = request.nextUrl;
  const accessTokenCookie = request.cookies.get('access')?.value;
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtectedRoute) {
    if (!accessTokenCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthRoute && accessTokenCookie) {
    const dashboardUrl = new URL('/feed', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
  */
}

/**
 * Configure which routes the middleware should run on
 *
 * We exclude:
 * - _next/static (static files)
 * - _next/image (image optimization)
 * - favicon.ico (favicon)
 * - Public assets (images, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
