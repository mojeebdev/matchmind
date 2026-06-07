import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AgentInterface } from '@/components/agent/AgentInterface'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { absoluteAgentUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Football Intelligence Agent',
  description:
    'Ask MatchMind anything about World Cup 2026 — stats, predictions, fantasy lineups, tactics, and head-to-head history.',
  alternates: {
    canonical: absoluteAgentUrl('/'),
  },
  openGraph: {
    url: absoluteAgentUrl('/'),
    title: 'Football Intelligence Agent | MatchMind',
    description:
      'Ask MatchMind anything about World Cup 2026 — stats, predictions, fantasy lineups, tactics, and head-to-head history.',
  },
}

export default function AgentPage() {
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
          <Suspense fallback={<p style={{ color: 'var(--ink-secondary)' }}>Loading agent…</p>}>
            <AgentInterface />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}