import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import '@/styles/globals.css'
import { auth } from '@/auth'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s | MatchMind',
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.creator.name, url: siteConfig.creator.url }],
  creator: siteConfig.organization.name,
  applicationName: siteConfig.name,
  category: 'sports',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: absoluteUrl('/'),
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.shortDescription,
    images: [
      {
        url: absoluteUrl('/opengraph-image'),
        width: 1200,
        height: 630,
        alt: 'Football Intelligence AI | MatchMind — World Cup 2026',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.shortDescription,
    creator: siteConfig.creator.handle,
    images: [absoluteUrl('/opengraph-image')],
  },
  manifest: '/manifest.webmanifest',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="text/plain" href={absoluteUrl('/llms.txt')} title="LLMs" />
        <link rel="alternate" type="text/plain" href={absoluteUrl('/llms-full.txt')} title="LLMs Full" />
        <link rel="alternate" type="text/plain" href={absoluteUrl('/faq-ai.txt')} title="FAQ for AI" />
        <link rel="alternate" type="text/plain" href={absoluteUrl('/ai.txt')} title="AI Policy" />
        <link rel="alternate" type="application/json" href={absoluteUrl('/identity.json')} title="Identity" />
      </head>
      <body>
        <SessionProvider session={session}>
          {children}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  )
}