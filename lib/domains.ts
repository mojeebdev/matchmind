import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export type Subdomain = 'apex' | 'app' | 'agent' | 'auth'

const PROD_ROOT = 'matchmind.xyz'

export function isSubdomainRoutingEnabled() {
  return process.env.SUBDOMAIN_ROUTING !== 'false'
}

export function isLocalDevHost(host: string) {
  const hostname = host.split(':')[0].toLowerCase()
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')
}

export function getSubdomainFromHost(host: string): Subdomain {
  const hostname = host.split(':')[0].toLowerCase()

  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === PROD_ROOT ||
    hostname === `www.${PROD_ROOT}`
  ) {
    return 'apex'
  }
  if (hostname.startsWith('app.')) return 'app'
  if (hostname.startsWith('agent.')) return 'agent'
  if (hostname.startsWith('auth.')) return 'auth'
  return 'apex'
}

export function hostsForRequest(host: string) {
  const local = isLocalDevHost(host)
  const port = host.includes(':') ? host.split(':')[1] : '3000'

  if (local) {
    return {
      protocol: 'http' as const,
      app: `app.localhost:${port}`,
      agent: `agent.localhost:${port}`,
      auth: `auth.localhost:${port}`,
      apex: host.includes('localhost') || host.includes('127.0.0.1') ? host : `localhost:${port}`,
    }
  }

  return {
    protocol: 'https' as const,
    app: `app.${PROD_ROOT}`,
    agent: `agent.${PROD_ROOT}`,
    auth: `auth.${PROD_ROOT}`,
    apex: PROD_ROOT,
  }
}

export function absoluteHostUrl(host: string, path = '/') {
  const { protocol } = hostsForRequest(host)
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${protocol}://${host}${normalized}`
}

export function appHostUrl(reqHost: string, path = '/') {
  const hosts = hostsForRequest(reqHost)
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${hosts.protocol}://${hosts.app}${normalized}`
}

export function agentHostUrl(reqHost: string, path = '/') {
  const hosts = hostsForRequest(reqHost)
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${hosts.protocol}://${hosts.agent}${normalized}`
}

export function authHostUrl(reqHost: string, path = '/') {
  const hosts = hostsForRequest(reqHost)
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${hosts.protocol}://${hosts.auth}${normalized}`
}

const AUTH_PUBLIC_PATHS = new Set([
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
])

function shouldCanonicalizeApex(host: string, subdomain: Subdomain) {
  if (!isSubdomainRoutingEnabled()) return false
  if (subdomain !== 'apex') return false
  if (isLocalDevHost(host)) {
    const hostname = host.split(':')[0].toLowerCase()
    return hostname !== 'localhost' && hostname !== '127.0.0.1'
  }
  return true
}

export function rewriteForSubdomain(req: NextRequest, subdomain: Subdomain) {
  const { pathname } = req.nextUrl
  const host = req.headers.get('host') ?? ''

  if (!isSubdomainRoutingEnabled()) return null

  if (subdomain === 'auth') {
    if (pathname === '/' || pathname === '') {
      return NextResponse.redirect(new URL('/signin', req.url))
    }

    if (
      pathname.startsWith('/profile') ||
      pathname.startsWith('/history') ||
      pathname === '/onboarding' ||
      pathname.startsWith('/docs') ||
      pathname === '/privacy' ||
      pathname === '/terms'
    ) {
      return NextResponse.redirect(appHostUrl(host, pathname))
    }

    if (AUTH_PUBLIC_PATHS.has(pathname)) {
      return NextResponse.rewrite(new URL(`/auth${pathname}`, req.url))
    }

    if (pathname.startsWith('/auth/')) {
      const publicPath = pathname.replace(/^\/auth/, '') || '/signin'
      return NextResponse.redirect(new URL(publicPath, req.url))
    }
  }

  if (subdomain === 'agent') {
    if (pathname === '/' || pathname === '') {
      return NextResponse.rewrite(new URL('/agent', req.url))
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      return NextResponse.rewrite(new URL(`/agent${pathname}`, req.url))
    }

    if (pathname === '/agent' || pathname.startsWith('/agent/')) {
      const publicPath = pathname.replace(/^\/agent/, '') || '/'
      return NextResponse.redirect(new URL(publicPath || '/', req.url))
    }

    if (
      pathname.startsWith('/profile') ||
      pathname.startsWith('/history') ||
      pathname === '/onboarding' ||
      pathname.startsWith('/docs') ||
      pathname === '/privacy' ||
      pathname === '/terms' ||
      pathname.startsWith('/auth/') ||
      AUTH_PUBLIC_PATHS.has(pathname)
    ) {
      if (pathname.startsWith('/auth/') || AUTH_PUBLIC_PATHS.has(pathname)) {
        const authPath = pathname.replace(/^\/auth/, '') || '/signin'
        return NextResponse.redirect(authHostUrl(host, authPath))
      }
      return NextResponse.redirect(appHostUrl(host, pathname))
    }
  }

  if (subdomain === 'app') {
    if (pathname === '/agent' || pathname.startsWith('/agent/')) {
      const agentPath = pathname.replace(/^\/agent/, '') || '/'
      return NextResponse.redirect(agentHostUrl(host, agentPath))
    }

    if (pathname.startsWith('/auth/')) {
      const authPath = pathname.replace(/^\/auth/, '') || '/signin'
      return NextResponse.redirect(authHostUrl(host, authPath))
    }
  }

  return null
}

export function getCanonicalRedirect(req: NextRequest, subdomain: Subdomain) {
  const { pathname } = req.nextUrl
  const host = req.headers.get('host') ?? ''

  if (!shouldCanonicalizeApex(host, subdomain)) return null

  if (pathname === '/agent' || pathname.startsWith('/agent/')) {
    const agentPath = pathname.replace(/^\/agent/, '') || '/'
    return NextResponse.redirect(agentHostUrl(host, agentPath))
  }

  if (pathname.startsWith('/auth/')) {
    const authPath = pathname.replace(/^\/auth/, '') || '/signin'
    return NextResponse.redirect(authHostUrl(host, authPath))
  }

  if (
    pathname === '/' ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/docs') ||
    pathname === '/privacy' ||
    pathname === '/terms' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.redirect(appHostUrl(host, pathname))
  }

  return null
}

export const googleOAuthOrigins = {
  production: [
    'https://app.matchmind.xyz',
    'https://agent.matchmind.xyz',
    'https://auth.matchmind.xyz',
    'https://matchmind.xyz',
  ],
  local: [
    'http://app.localhost:3000',
    'http://agent.localhost:3000',
    'http://auth.localhost:3000',
    'http://localhost:3000',
  ],
} as const

export const googleOAuthRedirects = {
  production: [
    'https://auth.matchmind.xyz/api/auth/callback/google',
    'https://app.matchmind.xyz/api/auth/callback/google',
    'https://agent.matchmind.xyz/api/auth/callback/google',
    'https://matchmind.xyz/api/auth/callback/google',
  ],
  local: [
    'http://auth.localhost:3000/api/auth/callback/google',
    'http://app.localhost:3000/api/auth/callback/google',
    'http://agent.localhost:3000/api/auth/callback/google',
    'http://localhost:3000/api/auth/callback/google',
  ],
} as const