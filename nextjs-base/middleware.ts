import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './src/lib/locales'

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

    const segments = pathname.split('/').filter(Boolean)
    const first = segments[0]
    const locale =
      first && (locales as readonly string[]).includes(first)
        ? first
        : defaultLocale

    // Only redirect when there is NO locale segment at all ("/").
    // If the first segment exists but is not a supported locale (e.g. "/f"),
    // we let the request through so the app can render a proper 404.
    if (!first) {
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}${url.pathname}`

      const redirectRes = NextResponse.redirect(url)
      // In Vercel Edge, prefer NextResponse cookies API; avoid manual `set-cookie`
      // header manipulation as it can trigger runtime failures.
      try {
        redirectRes.cookies.set('locale', locale, {
          path: '/',
          sameSite: 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
        })
      } catch {
        // If cookies API is unavailable for some reason, just skip setting it.
      }

      return redirectRes
    }

    // If the first segment exists but is not a supported locale, do not rewrite/redirect.
    if (!(locales as readonly string[]).includes(first)) {
      return NextResponse.next()
    }

    const res = NextResponse.next()

    // Same rationale as above: avoid manual `set-cookie` header in Edge.
    try {
      res.cookies.set('locale', locale, {
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      })
    } catch {
      // noop
    }

    return res
  } catch {
    return NextResponse.next()
  }
}

// Match all non-api, non-_next, non-static, non-admin routes
// we also avoid running the middleware for favicon requests which otherwise
// trigger mysterious `MIDDLEWARE_INVOCATION_FAILED` errors in production.
export const config = {
  matcher: ['/((?!_next|api|static|admin|favicon\\.ico).*)'],
}
