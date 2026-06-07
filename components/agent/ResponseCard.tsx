import type { AgentResponse } from '@/lib/types'

interface ResponseCardProps {
  response: AgentResponse
}

export function ResponseCard({ response }: ResponseCardProps) {
  const confidenceClass = `confidence-${response.confidence ?? 'medium'}`
  const keyStats = response.key_stats ?? []
  const dataSources = response.data_sources ?? []
  const isPreview = response.preview_data === true
  const isLive = response.live_data === true && !isPreview

  const dataBadge = isPreview
    ? { label: '◇ Preview mockup', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.45)', bg: 'rgba(251, 191, 36, 0.12)' }
    : isLive
      ? { label: '● Live MongoDB', color: '#4ade80', border: 'rgba(74,222,128,0.35)', bg: 'rgba(74,222,128,0.1)' }
      : { label: '○ Demo data', color: 'var(--ink-secondary)', border: 'var(--gold-border)', bg: 'var(--gold-dim)' }

  return (
    <div
      className="card"
      style={{
        padding: 'clamp(28px, 4vw, 40px)',
        marginTop: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <span className="tag">{response.question_type}</span>
        <span
          className="tag"
          style={{
            color: dataBadge.color,
            borderColor: dataBadge.border,
            background: dataBadge.bg,
          }}
        >
          {dataBadge.label}
        </span>
        <span
          className={`tag ${confidenceClass}`}
          style={{ textTransform: 'capitalize' }}
        >
          {response.confidence} confidence
        </span>
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 600,
          color: 'var(--ink-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '20px',
          lineHeight: 1.2,
        }}
      >
        {response.headline}
      </h2>

      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 300,
          color: 'var(--ink-secondary)',
          lineHeight: 1.8,
          marginBottom: '32px',
        }}
      >
        {response.answer.split('\n\n').map((paragraph, i) => (
          <p key={i} style={{ marginBottom: '16px' }}>
            {paragraph}
          </p>
        ))}
      </div>

      {keyStats.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Key Stats
          </span>
          <div
            className="stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {keyStats.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--void-03)',
                  border: '1px solid var(--void-border)',
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-muted)',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  {stat.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: 'var(--gold)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: 'var(--ink-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {stat.context}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          borderTop: '1px solid var(--void-border)',
          paddingTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Suggested Follow-up
          </span>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--gold-light)',
              fontStyle: 'italic',
            }}
          >
            &ldquo;{response.follow_up}&rdquo;
          </p>
        </div>

        {dataSources.length > 0 && (
          <div>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Data Sources
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {dataSources.map((source, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: 'var(--ink-secondary)',
                    background: 'var(--emerald-dim)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--void-border)',
                  }}
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}