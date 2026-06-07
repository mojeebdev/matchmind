'use client'

import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { AuthField } from '@/components/auth/AuthField'
import { AuthShell } from '@/components/auth/AuthShell'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { agentPath, authPath, navigateTo, resolveCallbackUrl } from '@/lib/urls'

function SignInForm() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = resolveCallbackUrl(searchParams.get('callbackUrl'))
  const redirectUrl = searchParams.get('callbackUrl') ? callbackUrl : agentPath('/')
  const user = session?.user

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigateTo(redirectUrl)
    }
  }, [user, redirectUrl])

  if (status === 'loading' || user) {
    return <main style={{ minHeight: '60vh' }} />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password')
      return
    }

    navigateTo(callbackUrl)
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your football memory, profile, and personalized agent context."
      footer={
        <>
          No account? <Link href={authPath('/signup')} style={{ color: 'var(--gold)' }}>Create one</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          required
        />

        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <Link href={authPath('/forgot-password')} style={{ color: 'var(--gold)', fontSize: '13px' }}>
            Forgot password?
          </Link>
        </div>

        {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in…' : 'Sign in with email'}
        </button>
      </form>

      <GoogleSignInButton callbackUrl={callbackUrl} />
    </AuthShell>
  )
}

export default function SignInPageClient() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<main style={{ minHeight: '60vh' }} />}>
        <SignInForm />
      </Suspense>
      <Footer />
    </>
  )
}