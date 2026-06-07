import Link from 'next/link'
import { appPath } from '@/lib/urls'

type AuthShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
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
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        <Link
          href={appPath('/')}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--ink-secondary)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '24px',
          }}
        >
          ← Back to MatchMind
        </Link>

        <div className="card" style={{ padding: '32px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              color: 'var(--ink-primary)',
              marginBottom: '8px',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            {subtitle}
          </p>
          {children}
        </div>

        {footer && (
          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--ink-secondary)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </main>
  )
}