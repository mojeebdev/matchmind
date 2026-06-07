'use client'

import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { AuthField } from '@/components/auth/AuthField'
import { AuthShell } from '@/components/auth/AuthShell'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { agentPath, appPath, authPath, navigateTo } from '@/lib/urls'

export default function SignUpPage() {
  const { status, data: session } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') return
    const destination = session?.user?.profile?.onboardingComplete
      ? agentPath('/')
      : appPath('/onboarding')
    navigateTo(destination)
  }, [status, session?.user?.profile?.onboardingComplete])

  if (status === 'loading' || status === 'authenticated') {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '60vh' }} />
        <Footer />
      </>
    )
  }

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

        <GoogleSignInButton callbackUrl={appPath('/onboarding')} />
      </AuthShell>
      <Footer />
    </>
  )
}