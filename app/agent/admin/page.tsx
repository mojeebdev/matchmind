import { AdminInterface } from '@/components/agent/AdminInterface'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'

export const metadata = {
  title: 'Admin Agent — MatchMind',
  description: 'Update World Cup 2026 scores and player stats in MongoDB via the MatchMind admin agent.',
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