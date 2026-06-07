import type { Metadata } from 'next'
import { ProfilePageClient } from '@/components/profile/ProfilePageClient'
import { Footer } from '@/components/ui/Footer'
import { Navbar } from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'Profile',
  robots: { index: false, follow: false },
}

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="bg-middle section-surface page-shell">
        <div className="section-scrim section-scrim-agent" aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px', margin: '0 auto' }}>
          <span className="tag" style={{ marginBottom: '16px' }}>
            Your Profile
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 42px)',
              color: 'var(--ink-primary)',
              marginBottom: '12px',
            }}
          >
            Fan preferences
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.7,
              marginBottom: '28px',
            }}
          >
            Your fan preferences shape agent memory, tone, and email alerts.
          </p>
          <div className="card" style={{ padding: 'clamp(20px, 4vw, 28px)' }}>
            <ProfilePageClient />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}