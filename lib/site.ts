export const siteConfig = {
  name: 'MatchMind',
  title: 'Football Intelligence AI | MatchMind',
  tagline: 'Know Your Game. Own Every Moment.',
  description:
    'Know Your Game. Own Every Moment. AI football intelligence for World Cup 2026 fans — powered by Gemini, MongoDB Atlas, and Google Cloud Agent Builder.',
  shortDescription:
    'AI football intelligence for World Cup 2026 fans — powered by Gemini, MongoDB Atlas, and Google Cloud Agent Builder.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://matchmind.xyz',
  locale: 'en_US',
  themeColor: '#08090A',
  backgroundColor: '#08090A',
  creator: {
    name: 'Mojeeb Titilayo',
    handle: '@mojeebeth',
    url: 'https://x.com/mojeebeth',
  },
  organization: {
    name: 'BlindspotLab',
    url: 'https://blindspotlab.xyz',
  },
  github: 'https://github.com/mojeebdev/matchmind',
  keywords: [
    'World Cup 2026',
    'football AI',
    'MatchMind',
    'MongoDB',
    'Gemini',
    'Agent Builder',
    'football analytics',
    'soccer AI',
    'World Cup predictions',
  ],
  publicRoutes: [
    { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/agent', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/docs/architecture', changeFrequency: 'monthly' as const, priority: 0.6 },
  ],
  noIndexRoutes: ['/agent/admin', '/api'],
} as const

export function absoluteUrl(path = ''): string {
  const base = siteConfig.url.replace(/\/$/, '')
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}