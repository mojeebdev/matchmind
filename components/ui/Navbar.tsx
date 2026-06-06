'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(24px, 5vw, 48px)',
        background: 'rgba(8, 9, 10, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--void-border)',
      }}
    >
      <Logo href="/" size="sm" />

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: pathname === '/' ? 500 : 300,
            color: pathname === '/' ? 'var(--gold)' : 'var(--ink-secondary)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'color 0.2s',
          }}
        >
          Home
        </Link>
        <Link
          href="/agent"
          className={pathname === '/agent' ? 'btn-primary' : 'btn-ghost'}
          style={{
            padding: pathname === '/agent' ? undefined : '10px 24px',
            fontSize: '13px',
          }}
        >
          Ask Agent
        </Link>
      </div>
    </nav>
  )
}