'use client'

import Link from 'next/link'
import { signIn } from 'next-auth/react'

import { useState } from 'react'
import { AuthField } from '@/components/auth/AuthField'
import { AuthShell } from '@/components/auth/AuthShell'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { appPath, authPath, navigateTo } from '@/lib/urls'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setLoading(false)
      setError(data.error || 'Could not create account')
      return
    }

    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: appPath('/onboarding'),
    })

    setLoading(false)

    if (signInResult?.error) {
      setError('Account created, but sign in failed. Please sign in manually.')
      return
    }

    navigateTo(appPath('/onboarding'))
  }

  return (
    <>
      <Navbar />
      <AuthShell
        title="Create account"
        subtitle="Save your agent history and personalize MatchMind around your team and favorite player."
        footer={
          <>
            Already have an account? <Link href={authPath('/signin')} style={{ color: 'var(--gold)' }}>Sign in</Link>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <AuthField label="Name" name="name" value={name} onChange={setName} autoComplete="name" />
          <AuthField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <AuthField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
          />

          {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={{ margin: '24px 0', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '12px' }}>
          or
        </div>

        <button
          type="button"
          className="btn-ghost"
          style={{ width: '100%' }}
          onClick={() => signIn('google', { callbackUrl: appPath('/onboarding') })}
        >
          Continue with Google
        </button>
      </AuthShell>
      <Footer />
    </>
  )
}