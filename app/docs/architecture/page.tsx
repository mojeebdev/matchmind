import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'
import { appPath } from '@/lib/urls'

export const metadata: Metadata = {
  title: 'Architecture',
  description:
    'How MatchMind works — Gemini classification, MongoDB Atlas queries, MCP tools, Google ADK, and the Next.js App Router stack.',
  alternates: {
    canonical: absoluteUrl('/docs/architecture'),
  },
  openGraph: {
    url: absoluteUrl('/docs/architecture'),
    title: 'Architecture | MatchMind',
    description:
      'How MatchMind works — Gemini classification, MongoDB Atlas queries, MCP tools, Google ADK, and the Next.js App Router stack.',
  },
}

const h2 = {
  fontFamily: 'var(--font-display)',
  color: 'var(--ink-primary)',
  fontSize: '24px',
  margin: '32px 0 16px',
} as const

const h3 = {
  fontFamily: 'var(--font-display)',
  color: 'var(--ink-primary)',
  fontSize: '18px',
  margin: '24px 0 12px',
} as const

const gold = { color: 'var(--gold)' } as const

export default function ArchitecturePage() {
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
              fontSize: 'clamp(32px, 5vw, 48px)',
              color: 'var(--ink-primary)',
              marginBottom: '32px',
            }}
          >
            MatchMind — Technical Architecture
          </h1>

          <h2 style={h2}>Overview</h2>
          <p>MatchMind combines:</p>
          <ol style={{ paddingLeft: '24px', margin: '16px 0' }}>
            <li><strong style={gold}>Gemini</strong> (<code style={gold}>gemini-2.5-flash-lite</code>) for classification and analysis</li>
            <li><strong style={gold}>MongoDB Atlas</strong> as the football intelligence database</li>
            <li><strong style={gold}>MCP tool interface</strong> (<code style={gold}>lib/mcp.ts</code>) for agent data retrieval</li>
            <li><strong style={gold}>Google ADK</strong> (<code style={gold}>@google/adk</code>) when <code style={gold}>USE_ADK_AGENT=true</code></li>
            <li><strong style={gold}>Next.js 16+</strong> App Router for UI and API routes</li>
          </ol>

          <h2 style={h2}>Fan Agent Flow</h2>
          <h3 style={h3}>1 — Classification</h3>
          <p>Questions map to <code style={gold}>stats</code>, <code style={gold}>prediction</code>, <code style={gold}>fantasy</code>, <code style={gold}>tactical</code>, or <code style={gold}>historical</code>.</p>
          <h3 style={h3}>2 — MongoDB Query</h3>
          <p>The <code style={gold}>query_football_data</code> tool runs read-only aggregation pipelines against matches, players, teams, headToHead, groups, and tournament collections.</p>
          <h3 style={h3}>3 — Analysis</h3>
          <p>ADK <code style={gold}>LlmAgent</code> or the local Gemini pipeline reasons over records and returns structured JSON.</p>
          <h3 style={h3}>4 — Rendering</h3>
          <p>
            Analyst card with headline, analysis, key stats, confidence, data badge (
            <strong style={gold}>◇ Preview mockup</strong> before kickoff ·{' '}
            <strong style={gold}>● Live MongoDB</strong> after sync ·{' '}
            <strong style={gold}>○ Demo data</strong> without MongoDB), and follow-up.
          </p>

          <h2 style={h2}>Tournament Data Phases</h2>
          <p>
            <strong style={gold}>Official (FIFA):</strong> groups, 72 fixtures, venues, and kickoff times from the
            Dec 5 2025 draw and published schedule (<code style={gold}>lib/worldcup2026-official-fixtures.ts</code>).
          </p>
          <p>
            Before <strong style={gold}>11 June 2026</strong>, MatchMind also serves{' '}
            <strong style={gold}>preview mockup</strong> scores, standings, and player stats — illustrative demo
            data with an amber banner on <code style={gold}>/agent</code>. See{' '}
            <code style={gold}>docs/DATA-SOURCES.md</code> for the full real vs mockup matrix.
            After kickoff, <code style={gold}>npm run sync</code> or the admin agent updates MongoDB;
            badges switch to live mode automatically (<code style={gold}>lib/tournament-phase.ts</code>).
          </p>

          <h2 style={h2}>Admin Agent</h2>
          <p><code style={gold}>/agent/admin</code> — protected by <code style={gold}>ADMIN_SECRET</code>. Tools: <code style={gold}>update_match_result</code>, <code style={gold}>update_player_stats</code>, <code style={gold}>query_football_data</code>.</p>

          <h2 style={h2}>Data Updates</h2>
          <ul style={{ paddingLeft: '24px', margin: '12px 0' }}>
            <li><code style={gold}>npm run seed</code> — full dataset reload</li>
            <li>Admin agent — natural-language writes</li>
            <li><code style={gold}>npm run sync</code> — local private pipeline (gitignored)</li>
          </ul>
          <p>
            Official fixture structure always; mockup scores before kickoff; live synced results after.
            Independent of any official broadcast data feed.
          </p>

          <h2 style={h2}>Security</h2>
          <ul style={{ paddingLeft: '24px', margin: '12px 0' }}>
            <li>Secrets in <code style={gold}>.env</code> only — server-side API routes</li>
            <li>MongoDB Atlas IP whitelist + auth</li>
            <li>Admin writes require <code style={gold}>X-Admin-Key</code></li>
            <li>Read-only pipeline safety in <code style={gold}>lib/query-safety.ts</code></li>
          </ul>

          <h2 style={h2}>UI / Backgrounds</h2>
          <p>Stadium Night × Gold Intelligence. Section images in <code style={gold}>public/images/</code>:</p>
          <ul style={{ paddingLeft: '24px', margin: '12px 0' }}>
            <li><code style={gold}>.bg-hero</code> — landing hero</li>
            <li><code style={gold}>.bg-middle</code> — How It Works + agent pages</li>
            <li><code style={gold}>.cta-section</code> — agent CTA tunnel imagery</li>
            <li><code style={gold}>.bg-footer</code> — footer</li>
          </ul>
          <p>Gradient scrims in <code style={gold}>styles/globals.css</code> keep art visible with readable text.</p>

          <h2 style={h2}>Implementation Map</h2>
          <ul style={{ paddingLeft: '24px', margin: '12px 0' }}>
            <li><code style={gold}>lib/agent-builder.ts</code> — fan orchestration</li>
            <li><code style={gold}>lib/admin-agent-builder.ts</code> — admin orchestration</li>
            <li><code style={gold}>lib/mcp.ts</code> — MCP tool contract</li>
            <li><code style={gold}>lib/mongo-writes.ts</code> — match/player updates</li>
            <li><code style={gold}>lib/validation.ts</code> — response normalization</li>
          </ul>

          <h2 style={h2}>Builder Notes</h2>
          <p><strong style={{ color: 'var(--ink-primary)' }}>The database is the intelligence; the agent is the reasoning layer on top.</strong></p>
          <p style={{ marginTop: '16px', color: 'var(--gold)' }}>That's what makes MatchMind a real agent, not a chatbot wrapper.</p>

          <p style={{ marginTop: '32px', fontSize: '13px' }}>
            Full markdown: <code style={gold}>docs/ARCHITECTURE.md</code> in the repository.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}