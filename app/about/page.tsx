import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/ui/Footer'
import { Navbar } from '@/components/ui/Navbar'
import { absoluteAboutUrl } from '@/lib/site'
import { agentPath, appPath, authPath } from '@/lib/urls'

export const metadata: Metadata = {
  title: 'About MatchMind',
  description:
    'What MatchMind is, how it works, and how optional Google Sign-In helps you save history and personalize football intelligence answers.',
  alternates: {
    canonical: absoluteAboutUrl('/'),
  },
  openGraph: {
    url: absoluteAboutUrl('/'),
    title: 'About MatchMind',
    description:
      'What MatchMind is, how it works, and how optional Google Sign-In helps you save history and personalize football intelligence answers.',
  },
}

export default function AboutPage() {
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
        <article
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '720px',
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
            color: 'var(--ink-secondary)',
            lineHeight: 1.8,
            fontSize: '15px',
          }}
        >
          <Link
            href={appPath('/')}
            style={{
              fontSize: '13px',
              color: 'var(--ink-secondary)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '28px',
            }}
          >
            ← Back to Home
          </Link>

          <span className="tag" style={{ marginBottom: '16px' }}>
            Application purpose
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 48px)',
              color: 'var(--ink-primary)',
              marginBottom: '24px',
              letterSpacing: '-0.02em',
            }}
          >
            About MatchMind
          </h1>

          <p style={{ marginBottom: '20px', color: 'var(--ink-primary)' }}>
            <strong>MatchMind</strong> is a free web application that provides AI-powered football
            intelligence for FIFA World Cup 2026 fans. Users type questions in plain English;
            MatchMind retrieves data from a MongoDB Atlas tournament database and uses Google Gemini
            to return structured answers about match stats, predictions, fantasy lineups, tactics,
            and head-to-head history.
          </p>

          <p style={{ marginBottom: '20px' }}>
            MatchMind is not a gambling or betting app, not a live TV broadcast, and not a social
            network. Optional Google Sign-In creates a MatchMind account so users can save agent
            history, set a fan profile, and receive optional email alerts. The core agent is free
            to use without signing in.
          </p>

          <p style={{ marginBottom: '24px' }}>
            Visit the{' '}
            <Link href={appPath('/')} style={{ color: 'var(--gold)' }}>
              MatchMind home page
            </Link>
            , open the{' '}
            <Link href={agentPath('/')} style={{ color: 'var(--gold)' }}>
              football intelligence agent
            </Link>{' '}
            to ask questions without an account, or{' '}
            <Link href={authPath('/signup')} style={{ color: 'var(--gold)' }}>
              create a free account
            </Link>{' '}
            to save history and personalize responses around your supported country and favorite
            player.
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              color: 'var(--ink-primary)',
              marginBottom: '12px',
            }}
          >
            What you can do
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
            <li>Ask World Cup 2026 stats, standings, and player performance questions</li>
            <li>Get match analysis, fantasy lineup ideas, and tactical breakdowns</li>
            <li>Store interaction history when signed in to MatchMind</li>
            <li>Receive optional email updates about your team or favorite player</li>
          </ul>
        </article>
      </main>
      <Footer />
    </>
  )
}