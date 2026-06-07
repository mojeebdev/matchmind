import type { Metadata } from 'next'
import { HistoryList } from '@/components/history/HistoryList'
import { Footer } from '@/components/ui/Footer'
import { Navbar } from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'History',
  robots: { index: false, follow: false },
}

export default function HistoryPage() {
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
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <span className="tag" style={{ marginBottom: '16px' }}>
            Memory
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 42px)',
              color: 'var(--ink-primary)',
              marginBottom: '12px',
            }}
          >
            Your agent history
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.7,
              marginBottom: '32px',
              maxWidth: '640px',
            }}
          >
            Every question you ask while signed in is saved here and fed back into your personalized agent context.
          </p>
          <HistoryList />
        </div>
      </main>
      <Footer />
    </>
  )
}