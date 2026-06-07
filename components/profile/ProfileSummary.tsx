'use client'

import type { Session } from 'next-auth'

type ProfileSummaryProps = {
  user: Session['user']
  onEdit: () => void
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export function ProfileSummary({ user, onEdit }: ProfileSummaryProps) {
  const profile = user.profile
  const label = profile?.displayName || user.name || user.email || 'Fan'
  const initials = getInitials(label)

  return (
    <div className="profile-summary">
      <div className="profile-summary__header">
        {user.image ? (
          <img src={user.image} alt="" className="profile-summary__avatar" referrerPolicy="no-referrer" />
        ) : (
          <div className="profile-summary__avatar profile-summary__avatar--fallback" aria-hidden="true">
            {initials}
          </div>
        )}

        <div className="profile-summary__identity">
          <h2 className="profile-summary__name">{label}</h2>
          {profile?.username ? (
            <p className="profile-summary__username">@{profile.username}</p>
          ) : (
            <p className="profile-summary__username profile-summary__username--muted">No username set</p>
          )}
          {user.email && <p className="profile-summary__email">{user.email}</p>}
        </div>
      </div>

      <dl className="profile-summary__details">
        <div className="profile-summary__row">
          <dt>Country</dt>
          <dd>{profile?.supportedCountry || '—'}</dd>
        </div>
        <div className="profile-summary__row">
          <dt>Best player</dt>
          <dd>{profile?.favoritePlayer || '—'}</dd>
        </div>
        <div className="profile-summary__row">
          <dt>Email alerts</dt>
          <dd>{profile?.emailAlerts ? 'On' : 'Off'}</dd>
        </div>
      </dl>

      <button type="button" className="btn-primary profile-summary__edit" onClick={onEdit}>
        Edit profile
      </button>
    </div>
  )
}