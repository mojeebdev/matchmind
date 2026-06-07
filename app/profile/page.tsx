import type { Metadata } from 'next'
import { auth } from '@/auth'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { Footer } from '@/components/ui/Footer'
import { Navbar } from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'Profile',
  robots: { index: false, follow: false },
}

export default async function ProfilePage() {
  const session = await auth()

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
            Signed in as {session?.user?.email}. These preferences shape your agent memory and tone.
          </p>
          <div className="card" style={{ padding: '28px' }}>
            <ProfileForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}