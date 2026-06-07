import Link from 'next/link'
import { agentPath, authPath } from '@/lib/urls'

export function AppPurposeSection() {
  return (
    <section
      id="about-matchmind"
      className="bg-middle section-surface"
      style={{
        padding: 'clamp(48px, 8vw, 80px) clamp(24px, 6vw, 80px)',
        borderTop: '1px solid var(--void-border)',
      }}
    >
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <span className="tag" style={{ marginBottom: '16px' }}>
          About the application
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: 'var(--ink-primary)',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          What is MatchMind?
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: 'var(--ink-secondary)',
            lineHeight: 1.8,
            maxWidth: 'var(--text-max)',
            marginBottom: '20px',
          }}
        >
          <strong style={{ color: 'var(--ink-primary)' }}>MatchMind</strong> is a free web application
          that helps World Cup 2026 fans ask football questions in plain English and receive
          analyst-grade answers grounded in a MongoDB Atlas intelligence database. MatchMind is
          not a betting service, not a live broadcast feed, and not a generic chatbot — it is a
          purpose-built AI football analyst for stats, predictions, fantasy ideas, tactics, and
          head-to-head history.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: 'var(--ink-secondary)',
            lineHeight: 1.8,
            maxWidth: 'var(--text-max)',
            marginBottom: '24px',
          }}
        >
          When you use MatchMind, you can browse the product overview on this page, open the{' '}
          <Link href={agentPath('/')} style={{ color: 'var(--gold)' }}>
            MatchMind agent
          </Link>{' '}
          to ask questions without an account, or{' '}
          <Link href={authPath('/signup')} style={{ color: 'var(--gold)' }}>
            create a free MatchMind account
          </Link>{' '}
          to save your history, set your supported country and favorite player, and get
          personalized responses. Google Sign-In is optional and only used to authenticate your
          MatchMind account.
        </p>

        <ul
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--ink-secondary)',
            lineHeight: 1.8,
            paddingLeft: '20px',
            marginBottom: '0',
            maxWidth: 'var(--text-max)',
          }}
        >
          <li>Ask World Cup 2026 stats, standings, and player performance questions</li>
          <li>Get match analysis, fantasy lineup ideas, and tactical breakdowns</li>
          <li>Store interaction history when signed in to MatchMind</li>
          <li>Receive optional email updates about your team or favorite player</li>
        </ul>
      </div>
    </section>
  )
}