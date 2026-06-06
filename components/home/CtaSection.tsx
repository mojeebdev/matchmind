import Link from 'next/link'

const ctaTextShadow = '0 2px 20px rgba(8,9,10,0.8)'

export function CtaSection() {
  return (
    <section
      className="cta-section"
      style={{
        minHeight: 'clamp(420px, 55vh, 580px)',
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--section-pad) clamp(24px, 6vw, 80px)',
        borderTop: '1px solid rgba(201, 168, 76, 0.12)',
        borderBottom: '1px solid rgba(201, 168, 76, 0.12)',
      }}
    >
      <div className="cta-section__bg" aria-hidden="true" />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(
            ellipse 60% 50% at 50% 50%,
            rgba(8,9,10,0.72) 0%,
            rgba(8,9,10,0.38) 60%,
            rgba(8,9,10,0.14) 100%
          )`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div className="cta-section__content" style={{ zIndex: 1 }}>
        <span
          className="tag"
          style={{
            marginBottom: '16px',
            position: 'relative',
            zIndex: 1,
            color: 'var(--ink-primary)',
            textShadow: ctaTextShadow,
            background: 'rgba(8, 9, 10, 0.72)',
            borderColor: 'rgba(201, 168, 76, 0.45)',
          }}
        >
          Ready to Ask?
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 600,
            color: 'var(--ink-primary)',
            marginTop: '16px',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
            textShadow: ctaTextShadow,
          }}
        >
          Your Personal World Cup Analyst
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'rgba(240, 237, 230, 0.85)',
            maxWidth: '520px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
            textShadow: ctaTextShadow,
          }}
        >
          Ask about stats, predictions, fantasy picks, tactics, or history.
          MatchMind queries real MongoDB data and responds like a broadcast analyst.
        </p>
        <Link
          href="/agent"
          className="btn-primary"
          style={{ boxShadow: '0 0 0 1px rgba(8,9,10,0.4)' }}
        >
          Open the Agent →
        </Link>
      </div>
    </section>
  )
}