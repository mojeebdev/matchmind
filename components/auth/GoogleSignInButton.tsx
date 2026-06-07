'use client'

import { getProviders, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

type GoogleSignInButtonProps = {
  callbackUrl: string
}

export function GoogleSignInButton({ callbackUrl }: GoogleSignInButtonProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getProviders()
      .then((providers) => setEnabled(Boolean(providers?.google)))
      .catch(() => setEnabled(false))
  }, [])

  if (!enabled) return null

  return (
    <>
      <div style={{ margin: '24px 0', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '12px' }}>
        or
      </div>

      <button
        type="button"
        className="btn-ghost"
        style={{ width: '100%' }}
        disabled={loading}
        onClick={() => {
          setLoading(true)
          void signIn('google', { callbackUrl })
        }}
      >
        {loading ? 'Redirecting to Google…' : 'Continue with Google'}
      </button>
    </>
  )
}