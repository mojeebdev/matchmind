import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import '@/styles/globals.css'

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://matchmind.xyz'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'MatchMind — Football Intelligence AI',
    template: '%s · MatchMind',
  },
  description:
    'Know Your Game. Own Every Moment. AI football intelligence for World Cup 2026 fans — powered by Gemini, MongoDB Atlas, and Google Cloud Agent Builder.',
  keywords: [
    'World Cup 2026',
    'football AI',
    'MatchMind',
    'MongoDB',
    'Gemini',
    'Agent Builder',
    'football analytics',
  ],
  authors: [{ name: 'Mojeeb Titilayo', url: 'https://x.com/mojeebeth' }],
  creator: 'BlindspotLab',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    siteName: 'MatchMind',
    title: 'MatchMind — Football Intelligence AI',
    description: 'Know Your Game. Own Every Moment. AI football intelligence for World Cup 2026 fans.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'MatchMind — Football Intelligence AI for World Cup 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MatchMind — Football Intelligence AI',
    description: 'Know Your Game. Own Every Moment. AI football intelligence for World Cup 2026 fans.',
    creator: '@mojeebeth',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}