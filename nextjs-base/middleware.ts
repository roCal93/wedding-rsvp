import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEFAULT_LOCALE = 'fr'

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl

    // Ignore static assets, API and other non-page requests
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/static') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Keep middleware minimal to avoid Edge runtime crashes.
    if (pathname === '/') {
      const url = req.nextUrl.clone()
      url.pathname = `/${DEFAULT_LOCALE}`
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

// Match all non-api, non-_next, non-static, non-admin routes
// we also avoid running the middleware for favicon requests which otherwise
// trigger mysterious `MIDDLEWARE_INVOCATION_FAILED` errors in production.
export const config = {
  matcher: ['/:path*'],
}
