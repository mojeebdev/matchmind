import { siteFaqs } from '@/lib/aeo'

export function FaqSection() {
  return (
    <section
      id="faq"
      className="bg-middle section-surface"
      aria-labelledby="faq-heading"
      style={{
        padding: 'var(--section-pad) clamp(24px, 6vw, 80px)',
        borderTop: '1px solid rgba(201, 168, 76, 0.12)',
      }}
    >
      <div className="section-scrim section-scrim-middle" aria-hidden="true" />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
        }}
      >
        <span className="tag" style={{ marginBottom: '20px' }}>
          FAQ
        </span>
        <h2
          id="faq-heading"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 600,
            color: 'var(--ink-primary)',
            marginBottom: '12px',
            letterSpacing: '-0.02em',
          }}
        >
          Frequently Asked Questions
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--ink-secondary)',
            maxWidth: '640px',
            lineHeight: 1.7,
            marginBottom: '40px',
          }}
        >
          Clear answers about MatchMind for fans, builders, and answer engines.
        </p>

        <dl
          style={{
            display: 'grid',
            gap: '20px',
            margin: 0,
          }}
        >
          {siteFaqs.map((faq) => (
            <div
              key={faq.question}
              style={{
                padding: '24px 28px',
                borderRadius: '16px',
                border: '1px solid var(--void-border)',
                background: 'rgba(8, 9, 10, 0.55)',
              }}
            >
              <dt
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--ink-primary)',
                  marginBottom: '10px',
                }}
              >
                {faq.question}
              </dt>
              <dd
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 300,
                  color: 'var(--ink-secondary)',
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}