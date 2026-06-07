import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { sessionTokenCookieName } from '@/lib/auth/cookies'
import {
  appHostUrl,
  authHostUrl,
  agentHostUrl,
  getCanonicalRedirect,
  getSubdomainFromHost,
  rewriteForSubdomain,
} from '@/lib/domains'

const STATIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|json|webmanifest|xml)$/

const SEO_PATHS = new Set(['/robots.txt', '/sitemap.xml', '/manifest.webmanifest'])

const AUTH_PUBLIC_PATHS = new Set([
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
])

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const { pathname } = req.nextUrl
  const subdomain = getSubdomainFromHost(host)

  if (pathname.startsWith('/_next') || SEO_PATHS.has(pathname) || STATIC_FILE.test(pathname)) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: sessionTokenCookieName(),
  })
  const isLoggedIn = Boolean(token?.id)
  const onboardingComplete = Boolean(
    (token?.profile as { onboardingComplete?: boolean } | undefined)?.onboardingComplete
  )

  const isSignInPath = pathname === '/signin' || pathname === '/auth/signin'
  const isSignUpPath = pathname === '/signup' || pathname === '/auth/signup'

  // Run before subdomain rewrites so auth.matchmind.xyz/signin redirects when logged in.
  if (isLoggedIn && isSignInPath) {
    return NextResponse.redirect(new URL(agentHostUrl(host, '/')))
  }

  if (isLoggedIn && isSignUpPath) {
    const destination = onboardingComplete
      ? agentHostUrl(host, '/')
      : appHostUrl(host, '/onboarding')
    return NextResponse.redirect(new URL(destination))
  }

  const rewrite = rewriteForSubdomain(req, subdomain)
  if (rewrite) return rewrite

  const canonical = getCanonicalRedirect(req, subdomain)
  if (canonical) return canonical

  const protectedPaths = ['/profile', '/history']
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL(authHostUrl(host, '/signin'))
    signInUrl.searchParams.set('callbackUrl', appHostUrl(host, pathname))
    return NextResponse.redirect(signInUrl)
  }

  if (
    isLoggedIn &&
    !onboardingComplete &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/agent/admin') &&
    pathname !== '/onboarding' &&
    !AUTH_PUBLIC_PATHS.has(pathname)
  ) {
    return NextResponse.redirect(new URL(appHostUrl(host, '/onboarding')))
  }

  if (isLoggedIn && onboardingComplete && pathname === '/onboarding') {
    return NextResponse.redirect(new URL(agentHostUrl(host, '/')))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
  ],
}