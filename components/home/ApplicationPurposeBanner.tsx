/**
 * Server-rendered, above-the-fold copy for OAuth / app verification reviewers.
 * Plain language about what MatchMind does — visible without scrolling.
 */
export function ApplicationPurposeBanner() {
  return (
    <section
      id="application-purpose"
      aria-labelledby="application-purpose-heading"
      style={{
        background: '#0F1012',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        padding: '20px clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <h2
          id="application-purpose-heading"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '12px',
          }}
        >
          Application Purpose
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--ink-primary)',
            lineHeight: 1.7,
            marginBottom: '12px',
            maxWidth: '900px',
          }}
        >
          <strong>MatchMind</strong> is a free web application that provides AI-powered football
          intelligence for FIFA World Cup 2026 fans. Users type questions in plain English; MatchMind
          retrieves data from a MongoDB Atlas tournament database and uses Google Gemini to return
          structured answers about match stats, predictions, fantasy lineups, tactics, and
          head-to-head history.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--ink-secondary)',
            lineHeight: 1.7,
            marginBottom: '0',
            maxWidth: '900px',
          }}
        >
          MatchMind is not a gambling or betting app, not a live TV broadcast, and not a social
          network. Optional Google Sign-In creates a MatchMind account so users can save agent
          history, set a fan profile, and receive optional email alerts. The core agent is free to
          use without signing in.
        </p>
      </div>
    </section>
  )
}