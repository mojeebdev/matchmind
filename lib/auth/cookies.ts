import type { NextAuthConfig } from 'next-auth'

/**
 * Cross-subdomain session cookies. Uses __Secure- names (not __Host-) because
 * __Host- cookies cannot include a Domain attribute — browsers reject them,
 * which breaks CSRF and OAuth sign-in across *.matchmind.xyz.
 */
export function subdomainAuthCookies(domain: string): NonNullable<NextAuthConfig['cookies']> {
  const secure = process.env.NODE_ENV === 'production'
  const prefix = secure ? '__Secure-' : ''

  const shared = {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure,
    domain,
  }

  return {
    sessionToken: {
      name: `${prefix}authjs.session-token`,
      options: shared,
    },
    callbackUrl: {
      name: `${prefix}authjs.callback-url`,
      options: shared,
    },
    csrfToken: {
      name: `${prefix}authjs.csrf-token`,
      options: shared,
    },
    pkceCodeVerifier: {
      name: `${prefix}authjs.pkce.code_verifier`,
      options: { ...shared, maxAge: 60 * 15 },
    },
    state: {
      name: `${prefix}authjs.state`,
      options: { ...shared, maxAge: 60 * 15 },
    },
  }
}

export function isGoogleAuthEnabled() {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)
}