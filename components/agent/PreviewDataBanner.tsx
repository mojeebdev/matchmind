import { PREVIEW_DISCLOSURE, WC2026_KICKOFF_LABEL } from '@/lib/tournament-phase'

export function PreviewDataBanner() {
  return (
    <div
      role="note"
      style={{
        marginBottom: '24px',
        padding: '16px 20px',
        borderRadius: '10px',
        border: '1px solid rgba(251, 191, 36, 0.45)',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.14), rgba(251, 191, 36, 0.06))',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fbbf24',
            fontWeight: 600,
          }}
        >
          ◇ Preview mockup data
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--ink-secondary)',
          }}
        >
          Updates automatically after kickoff · {WC2026_KICKOFF_LABEL}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          lineHeight: 1.6,
          color: 'var(--ink-secondary)',
        }}
      >
        {PREVIEW_DISCLOSURE}
      </p>
    </div>
  )
}