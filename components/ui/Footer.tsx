'use client'

import { githubBlobUrl } from '@/lib/site'
import { aboutPath, appPath } from '@/lib/urls'

export function Footer() {
  return (
    <footer className="bg-footer section-surface" style={{
      borderTop: '1px solid rgba(201,168,76,0.15)',
      padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) 40px',
      minHeight: 'clamp(420px, 52vh, 560px)',
    }}>
      <div className="section-scrim section-scrim-footer" aria-hidden="true" />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
      }}>
        {/* Top — Brand + Links */}
        <div className="footer-grid">

          {/* Brand column */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '42px',
              fontWeight: 700,
              color: 'var(--ink-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              marginBottom: '12px',
              textShadow: '0 2px 24px rgba(0,0,0,0.45)',
            }}>
              Match<span style={{ color: 'var(--gold)' }}>Mind</span>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 300,
              color: 'var(--ink-secondary)',
              lineHeight: 1.7,
              maxWidth: '260px',
              marginBottom: '20px',
            }}>
              Know Your Game. Own Every Moment.
              <br />AI football intelligence for World Cup 2026 fans.
            </p>
            {/* Builder credit */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.06em',
              color: 'var(--ink-muted)',
            }}>
              Built by{' '}
              <a
                href="https://x.com/mojeebeth"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--gold)', textDecoration: 'none' }}
              >
                @mojeebeth
              </a>
              {' '}· BlindspotLab
            </p>
          </div>

          {/* Project column */}
          <div>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '16px',
            }}>Project</span>
            {[
              { label: 'GitHub', href: 'https://github.com/mojeebdev/matchmind', external: true },
              { label: 'About', href: aboutPath('/'), external: false },
              { label: 'Docs', href: appPath('/docs'), external: false },
              { label: 'Architecture', href: appPath('/docs/architecture'), external: false },
              { label: 'Data sources', href: githubBlobUrl('docs/DATA-SOURCES.md'), external: true },
              { label: 'Privacy', href: appPath('/privacy'), external: false },
              { label: 'Terms', href: appPath('/terms'), external: false },
              { label: 'README', href: 'https://github.com/mojeebdev/matchmind#readme', external: true },
            ].map(link => (
              <a key={link.label} href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'block', marginBottom: '10px',
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  fontWeight: 300, color: 'var(--ink-secondary)',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--ink-secondary)')}
              >{link.label}</a>
            ))}
          </div>

          {/* Hackathon column */}
          <div>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '16px',
            }}>Hackathon</span>
            {[
              { label: 'Google Cloud', href: 'https://cloud.google.com' },
              { label: 'MongoDB Atlas', href: 'https://www.mongodb.com/atlas' },
              { label: 'Agent Builder', href: 'https://cloud.google.com/products/agent-builder' },
              { label: 'Devpost', href: 'https://devpost.com' },
            ].map(link => (
              <a key={link.label} href={link.href}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'block', marginBottom: '10px',
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  fontWeight: 300, color: 'var(--ink-secondary)',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--ink-secondary)')}
              >{link.label}</a>
            ))}
          </div>

          {/* Connect column */}
          <div>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '16px',
            }}>Connect</span>
            {[
              { label: '@mojeebeth on X', href: 'https://x.com/mojeebeth' },
              { label: 'BlindspotLab', href: 'https://blindspotlab.xyz' },
              { label: 'mojeeb.xyz', href: 'https://mojeeb.xyz' },
              { label: '@GoogleCloud', href: 'https://x.com/googlecloud' },
              { label: '@MongoDB', href: 'https://x.com/mongodb' },
            ].map(link => (
              <a key={link.label} href={link.href}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'block', marginBottom: '10px',
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  fontWeight: 300, color: 'var(--ink-secondary)',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--ink-secondary)')}
              >{link.label}</a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--void-border)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--ink-muted)',
            letterSpacing: '0.04em',
          }}>
            © 2026 BlindspotLab. All rights reserved.{' '}
            <a href={appPath('/privacy')} style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
              Privacy
            </a>
            {' · '}
            <a href={appPath('/terms')} style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
              Terms
            </a>
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--ink-muted)',
            letterSpacing: '0.04em',
          }}>
            Built for{' '}
            <a href="https://cloud.google.com"
              target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--gold)', textDecoration: 'none' }}>
              Google Cloud Rapid Agent Hackathon 2026
            </a>
            {' '}· MongoDB Partner Track
          </span>
        </div>
      </div>
    </footer>
  )
}