import Link from 'next/link'
import { agentPath } from '@/lib/urls'

export function HeroSection() {
  return (
    <section
      className="bg-hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'var(--nav-height)',
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(8,9,10,0.82) 0%, rgba(8,9,10,0.55) 50%, rgba(13,59,46,0.25) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'var(--section-pad) clamp(24px, 6vw, 80px)',
          width: '100%',
        }}
      >
        <span className="tag" style={{ marginBottom: '24px' }}>
          World Cup 2026 · AI Football Intelligence
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 10vw, 96px)',
            fontWeight: 700,
            color: 'var(--ink-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: '8px',
          }}
        >
          Match<span style={{ color: 'var(--gold)' }}>Mind</span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 3vw, 24px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--gold-light)',
            marginBottom: '32px',
            letterSpacing: '0.01em',
          }}
        >
          Know Your Game. Own Every Moment.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            fontWeight: 300,
            color: 'var(--ink-secondary)',
            lineHeight: 1.7,
            maxWidth: 'var(--text-max)',
            marginBottom: '40px',
          }}
        >
          A Gemini-powered AI agent that searches live World Cup 2026 match data,
          player stats, and tactical intelligence stored in MongoDB — and answers
          any football question like a senior analyst, not a search engine.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href={agentPath('/')} className="btn-primary">
            Ask the Agent →
          </Link>
          <a href="#features" className="btn-ghost">
            How It Works
          </a>
        </div>
      </div>
    </section>
  )
}