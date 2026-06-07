'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/ui/Logo'
import { agentPath, appPath, authPath } from '@/lib/urls'

const linkStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  fontWeight: 300,
  color: 'var(--ink-secondary)',
  textDecoration: 'none',
  letterSpacing: '0.04em',
} as const

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navLinks = [
    { href: appPath('/docs/architecture'), label: 'Architecture' },
    ...(session?.user
      ? [
          { href: appPath('/history'), label: 'History' },
          { href: appPath('/profile'), label: 'Profile' },
        ]
      : []),
  ]

  return (
    <nav className="site-nav">
      <Logo href={appPath('/')} size="sm" />

      <div className="site-nav__actions">
        <Link
          href={agentPath('/')}
          className={pathname === '/agent' ? 'btn-primary site-nav__agent' : 'btn-ghost site-nav__agent'}
        >
          Ask Agent
        </Link>

        <div className="site-nav__desktop">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                ...linkStyle,
                color: pathname === link.href ? 'var(--gold)' : 'var(--ink-secondary)',
                fontWeight: pathname === link.href ? 500 : 300,
              }}
            >
              {link.label}
            </Link>
          ))}

          {session?.user ? (
            <button
              type="button"
              className="btn-ghost"
              style={{ fontSize: '13px', padding: '10px 18px' }}
              onClick={() => signOut({ callbackUrl: appPath('/') })}
            >
              Sign out
            </button>
          ) : (
            <Link href={authPath('/signin')} className="btn-ghost" style={{ fontSize: '13px', padding: '10px 18px' }}>
              Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          className="site-nav__menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={menuOpen ? 'site-nav__bar open' : 'site-nav__bar'} />
          <span className={menuOpen ? 'site-nav__bar open' : 'site-nav__bar'} />
          <span className={menuOpen ? 'site-nav__bar open' : 'site-nav__bar'} />
        </button>
      </div>

      {menuOpen && (
        <div className="site-nav__mobile-panel">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav__mobile-link">
              {link.label}
            </Link>
          ))}

          {session?.user ? (
            <>
              <span className="site-nav__mobile-meta">
                {session.user.profile?.displayName || session.user.name || session.user.email}
              </span>
              <button
                type="button"
                className="site-nav__mobile-link site-nav__mobile-button"
                onClick={() => signOut({ callbackUrl: appPath('/') })}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href={authPath('/signin')} className="site-nav__mobile-link">
                Sign in
              </Link>
              <Link href={authPath('/signup')} className="site-nav__mobile-link">
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}