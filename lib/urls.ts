const trim = (value: string) => value.replace(/\/$/, '')

export const urls = {
  app: trim(process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.matchmind.xyz'),
  agent: trim(process.env.NEXT_PUBLIC_AGENT_URL ?? 'https://agent.matchmind.xyz'),
  auth: trim(process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.matchmind.xyz'),
} as const

export function appPath(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${urls.app}${normalized}`
}

export function agentPath(path = '/') {
  const stripped = path.replace(/^\/agent/, '') || '/'
  const normalized = stripped.startsWith('/') ? stripped : `/${stripped}`
  return `${urls.agent}${normalized}`
}

export function authPath(path = '/signin') {
  const stripped = path.replace(/^\/auth/, '') || '/signin'
  const normalized = stripped.startsWith('/') ? stripped : `/${stripped}`
  return `${urls.auth}${normalized}`
}

export function navigateTo(url: string) {
  if (typeof window !== 'undefined') {
    window.location.assign(url)
  }
}

export function resolveCallbackUrl(path: string | null | undefined) {
  const raw = path ?? '/agent'
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  if (raw.startsWith('/agent')) return agentPath(raw.replace(/^\/agent/, '') || '/')
  if (raw.startsWith('/auth')) return authPath(raw.replace(/^\/auth/, '') || '/signin')
  if (raw.startsWith('/onboarding')) return appPath('/onboarding')
  if (raw.startsWith('/profile')) return appPath(raw)
  if (raw.startsWith('/history')) return appPath(raw)
  return appPath(raw.startsWith('/') ? raw : `/${raw}`)
}