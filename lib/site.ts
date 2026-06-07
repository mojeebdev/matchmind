import { agentPath, appPath, authPath } from '@/lib/urls'

export const siteConfig = {
  name: 'MatchMind',
  title: 'Football Intelligence AI | MatchMind',
  tagline: 'Know Your Game. Own Every Moment.',
  description:
    'MatchMind is a free AI football intelligence web application for World Cup 2026 fans. Ask stats, predictions, fantasy, tactics, and history questions — powered by Gemini, MongoDB Atlas, and Google Cloud Agent Builder.',
  shortDescription:
    'MatchMind is a free AI football intelligence web app for World Cup 2026 fans — powered by Gemini, MongoDB Atlas, and Google Cloud Agent Builder.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.matchmind.xyz',
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
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  ],
  noIndexRoutes: ['/agent/admin', '/api'],
} as const

export function absoluteUrl(path = ''): string {
  return appPath(path || '/')
}

export function absoluteAgentUrl(path = '/') {
  return agentPath(path)
}

export function absoluteAuthUrl(path = '/signin') {
  return authPath(path)
}