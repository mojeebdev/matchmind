'use client'

import { useSession } from 'next-auth/react'

import { useEffect, useState } from 'react'
import { AuthField } from '@/components/auth/AuthField'
import { WORLD_CUP_TEAMS } from '@/lib/countries'
import { agentPath, navigateTo } from '@/lib/urls'

type ProfileFormProps = {
  onboarding?: boolean
  onComplete?: () => void
}

export function ProfileForm({ onboarding = false, onComplete }: ProfileFormProps) {
  const { data: session, update } = useSession()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [supportedCountry, setSupportedCountry] = useState('')
  const [favoritePlayer, setFavoritePlayer] = useState('')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [alertFavoritePlayer, setAlertFavoritePlayer] = useState(true)
  const [alertSupportedCountry, setAlertSupportedCountry] = useState(true)
  const [usernameStatus, setUsernameStatus] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.user?.profile) return
    const profile = session.user.profile
    setUsername(profile.username || '')
    setDisplayName(profile.displayName || session.user.name || '')
    setSupportedCountry(profile.supportedCountry || '')
    setFavoritePlayer(profile.favoritePlayer || '')
    setEmailAlerts(profile.emailAlerts ?? true)
    setAlertFavoritePlayer(profile.alertFavoritePlayer ?? true)
    setAlertSupportedCountry(profile.alertSupportedCountry ?? true)
  }, [session])

  useEffect(() => {
    if (!username.trim() || username.length < 3) {
      setUsernameStatus(null)
      return
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/profile/username?username=${encodeURIComponent(username)}`)
      const data = await res.json().catch(() => ({}))
      if (data.available) {
        setUsernameStatus('Username is available')
      } else {
        setUsernameStatus(data.error || 'Username is taken')
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [username])

  const usernameTaken =
    usernameStatus !== null &&
    !usernameStatus.includes('available') &&
    username.trim().length >= 3

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (onboarding && usernameTaken) {
      setError(usernameStatus || 'Choose a different username')
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    const profile = {
      username,
      displayName,
      supportedCountry,
      favoritePlayer,
      onboardingComplete: onboarding ? true : session?.user?.profile?.onboardingComplete ?? true,
      emailAlerts,
      alertFavoritePlayer,
      alertSupportedCountry,
    }

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Could not save profile')
      return
    }

    await update({ profile: data.profile })
    setMessage(
      onboarding
        ? 'Profile saved. Check your inbox for a welcome note from Mojeeb.'
        : 'Profile updated.'
    )

    if (onboarding) {
      navigateTo(agentPath('/'))
    }

    onComplete?.()
  }

  const checkboxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--ink-secondary)',
  } as const

  return (
    <form onSubmit={handleSubmit}>
      <AuthField
        label="Username"
        name="username"
        value={username}
        onChange={setUsername}
        placeholder="e.g. mojeeb_eth"
        required={onboarding}
      />
      {usernameStatus && (
        <p
          style={{
            marginTop: '-8px',
            marginBottom: '16px',
            fontSize: '13px',
            color: usernameStatus.includes('available') ? 'var(--gold)' : '#f87171',
          }}
        >
          {usernameStatus}
        </p>
      )}

      <AuthField
        label="Display name"
        name="displayName"
        value={displayName}
        onChange={setDisplayName}
        placeholder="Optional friendly name"
      />

      <label style={{ display: 'block', marginBottom: '16px' }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            marginBottom: '8px',
          }}
        >
          Country you support
        </span>
        <select
          value={supportedCountry}
          onChange={(e) => setSupportedCountry(e.target.value)}
          className="auth-input"
          required={onboarding}
        >
          <option value="">Select a team</option>
          {WORLD_CUP_TEAMS.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </label>

      <AuthField
        label="Best player"
        name="favoritePlayer"
        value={favoritePlayer}
        onChange={setFavoritePlayer}
        placeholder="e.g. Vinícius Jr, Messi, Bellingham"
        required={onboarding}
      />

      <div style={{ margin: '24px 0 16px' }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            marginBottom: '12px',
          }}
        >
          Email alerts
        </span>
        {onboarding && (
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
            You&apos;ll also get a personal welcome from Mojeeb after you finish setup.
          </p>
        )}
        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
          />
          Receive MatchMind email updates
        </label>
        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={alertSupportedCountry}
            onChange={(e) => setAlertSupportedCountry(e.target.checked)}
            disabled={!emailAlerts}
          />
          Alert when my supported country finishes a match
        </label>
        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={alertFavoritePlayer}
            onChange={(e) => setAlertFavoritePlayer(e.target.checked)}
            disabled={!emailAlerts}
          />
          Alert when my favorite player scores
        </label>
      </div>

      {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}
      {message && <p style={{ color: 'var(--gold)', fontSize: '14px', marginBottom: '16px' }}>{message}</p>}

      <button type="submit" className="btn-primary" disabled={loading || (onboarding && usernameTaken)}>
        {loading ? 'Saving…' : onboarding ? 'Finish setup' : 'Save profile'}
      </button>
    </form>
  )
}