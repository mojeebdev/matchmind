import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { DocFileLink } from '@/components/ui/DocFileLink'
import { absoluteUrl } from '@/lib/site'
import { appPath } from '@/lib/urls'

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'MatchMind documentation — architecture, data sources, and repository markdown for World Cup 2026 intelligence.',
  alternates: {
    canonical: absoluteUrl('/docs'),
  },
  openGraph: {
    url: absoluteUrl('/docs'),
    title: 'Documentation | MatchMind',
    description:
      'MatchMind documentation — architecture, data sources, and repository markdown.',
  },
}

const cardStyle = {
  padding: '20px 24px',
  border: '1px solid rgba(201,168,76,0.2)',
  borderRadius: '8px',
} as const

const cardTitle = {
  fontFamily: 'var(--font-display)',
  fontSize: '20px',
  color: 'var(--ink-primary)',
  display: 'block',
  marginBottom: '8px',
} as const

const cardBody = {
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--ink-secondary)',
  lineHeight: 1.6,
  margin: 0,
} as const

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          paddingTop: 'calc(var(--nav-height) + 48px)',
          paddingBottom: 'var(--section-pad)',
          paddingLeft: 'clamp(24px, 6vw, 80px)',
          paddingRight: 'clamp(24px, 6vw, 80px)',
          maxWidth: 'var(--content-max)',
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

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            color: 'var(--ink-primary)',
            marginBottom: '12px',
          }}
        >
          Documentation
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--ink-secondary)',
            fontSize: '15px',
            lineHeight: 1.8,
            marginBottom: '40px',
            maxWidth: '640px',
          }}
        >
          In-app guides and repository markdown for judges, contributors, and anyone
          tracing how MatchMind separates official FIFA data from preview mockup.
        </p>

        <div
          style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          <Link
            href={appPath('/docs/architecture')}
            style={{ ...cardStyle, display: 'block', textDecoration: 'none' }}
          >
            <span style={cardTitle}>Architecture</span>
            <p style={cardBody}>
              Agent flow, MongoDB collections, admin writes, security, and implementation map.
            </p>
          </Link>

          <div style={cardStyle}>
            <span style={cardTitle}>
              <DocFileLink path="docs/ARCHITECTURE.md">docs/ARCHITECTURE.md</DocFileLink>
            </span>
            <p style={cardBody}>
              Full architecture write-up on GitHub — same content as the in-app page, in markdown.
            </p>
          </div>

          <div style={cardStyle}>
            <span style={cardTitle}>
              <DocFileLink path="docs/DATA-SOURCES.md">docs/DATA-SOURCES.md</DocFileLink>
            </span>
            <p style={cardBody}>
              Official vs mockup vs live — fixtures, squads, preview scores, and sync pipeline.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}