import type { Metadata } from 'next'
import { AdminInterface } from '@/components/agent/AdminInterface'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Admin Data Agent',
  description: 'Update World Cup 2026 scores and player stats in MongoDB via the MatchMind admin agent.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: absoluteUrl('/agent/admin'),
  },
}

export default function AdminAgentPage() {
  return (
    <>
      <Navbar />
      <main
        className="bg-middle section-surface"
        style={{
          minHeight: '100vh',
          paddingTop: 'calc(var(--nav-height) + 48px)',
          paddingBottom: 'var(--section-pad)',
          paddingLeft: 'clamp(24px, 6vw, 80px)',
          paddingRight: 'clamp(24px, 6vw, 80px)',
        }}
      >
        <div className="section-scrim section-scrim-agent" aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AdminInterface />
        </div>
      </main>
      <Footer />
    </>
  )
}