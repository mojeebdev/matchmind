import Link from 'next/link'
import { Footer } from '@/components/ui/Footer'
import { Navbar } from '@/components/ui/Navbar'
import { appPath } from '@/lib/urls'

type LegalLayoutProps = {
  title: string
  updated: string
  children: React.ReactNode
}

const h2 = {
  fontFamily: 'var(--font-display)',
  color: 'var(--ink-primary)',
  fontSize: '22px',
  margin: '32px 0 12px',
} as const

const p = {
  marginBottom: '16px',
} as const

const ul = {
  marginBottom: '16px',
  paddingLeft: '20px',
} as const

export const legalStyles = { h2, p, ul }

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <>
      <Navbar />
      <main
        style={{
          paddingTop: 'calc(var(--nav-height) + 48px)',
          paddingBottom: 'var(--section-pad)',
          paddingLeft: 'clamp(24px, 6vw, 80px)',
          paddingRight: 'clamp(24px, 6vw, 80px)',
          maxWidth: '720px',
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
            marginBottom: '32px',
            display: 'inline-block',
          }}
        >
          ← Back to Home
        </Link>

        <article
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--ink-secondary)',
            lineHeight: 1.8,
            fontSize: '15px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 42px)',
              color: 'var(--ink-primary)',
              marginBottom: '8px',
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '32px' }}>
            Last updated: {updated}
          </p>
          {children}

          <p style={{ marginTop: '40px', fontSize: '13px', color: 'var(--ink-muted)' }}>
            Questions? Contact{' '}
            <a href="mailto:mojeebeth@gmail.com" style={{ color: 'var(--gold)' }}>
              mojeebeth@gmail.com
            </a>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}