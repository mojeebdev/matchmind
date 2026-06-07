'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { AuthField } from '@/components/auth/AuthField'
import { AuthShell } from '@/components/auth/AuthShell'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { authPath, navigateTo } from '@/lib/urls'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError('Reset token is missing')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Unable to reset password')
      return
    }

    navigateTo(authPath('/signin'))
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your MatchMind account."
      footer={<Link href={authPath('/signin')} style={{ color: 'var(--gold)' }}>Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit}>
        <AuthField
          label="New password"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
        />
        <AuthField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
        />

        {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<main style={{ minHeight: '60vh' }} />}>
        <ResetPasswordForm />
      </Suspense>
      <Footer />
    </>
  )
}