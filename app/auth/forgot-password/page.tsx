'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AuthField } from '@/components/auth/AuthField'
import { AuthShell } from '@/components/auth/AuthShell'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { authPath } from '@/lib/urls'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Unable to send reset email')
      return
    }

    setMessage(data.message || 'If that email exists, a reset link has been sent.')
  }

  return (
    <>
      <Navbar />
      <AuthShell
        title="Forgot password"
        subtitle="We will email you a secure reset link if the account exists."
        footer={<Link href={authPath('/signin')} style={{ color: 'var(--gold)' }}>Back to sign in</Link>}
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

          {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}
          {message && <p style={{ color: 'var(--gold)', fontSize: '14px', marginBottom: '16px' }}>{message}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </AuthShell>
      <Footer />
    </>
  )
}