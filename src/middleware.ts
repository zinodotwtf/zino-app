import { type NextRequest, NextResponse } from 'next/server';

// Public pages that don't require authentication
const PUBLIC_PAGES = [
  '/', // Home page (Login)
  '/refresh', // Token refresh page
];

// Public static asset extensions that don't require authentication
const PUBLIC_ASSETS = [
  '.svg', // SVG images
  '.png', // PNG images
  '.jpg', // JPG images
  '.jpeg', // JPEG images
  '.ico', // Icon files
  '.webp', // WebP images
  '.gif', // GIF images
];

export const config = {
  matcher: [
    /*
     * Match all request paths except those starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (website icon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(req: NextRequest) {
  const cookieAuthToken = req.cookies.get('privy-token');
  const cookieSession = req.cookies.get('privy-session');
  const { pathname } = req.nextUrl;

  // Skip middleware for public pages
  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  // Skip middleware for static assets
  if (PUBLIC_ASSETS.some((ext) => pathname.toLowerCase().endsWith(ext))) {
    return NextResponse.next();
  }

  // Skip middleware for Privy OAuth authentication flow
  if (
    req.nextUrl.searchParams.has('privy_oauth_code') ||
    req.nextUrl.searchParams.has('privy_oauth_state') ||
    req.nextUrl.searchParams.has('privy_oauth_provider')
  ) {
    return NextResponse.next();
  }

  // User authentication status check
  const definitelyAuthenticated = Boolean(cookieAuthToken); // User is definitely authenticated (has access token)
  const maybeAuthenticated = Boolean(cookieSession); // User might be authenticated (has session)

  // Handle token refresh cases
  if (!definitelyAuthenticated && maybeAuthenticated) {
    const redirectUrl = new URL('/refresh', req.url);
    // Ensure redirect_uri is the current page path
    redirectUrl.searchParams.set('redirect_uri', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle unauthenticated cases
  if (!definitelyAuthenticated && !maybeAuthenticated) {
    const loginUrl = new URL('/', req.url);
    // Ensure redirect_uri is the current page path
    loginUrl.searchParams.set('redirect_uri', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
