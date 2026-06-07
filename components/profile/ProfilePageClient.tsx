'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { ProfileSummary } from '@/components/profile/ProfileSummary'

export function ProfilePageClient() {
  const { data: session } = useSession()
  const [editing, setEditing] = useState(false)

  if (!session?.user) {
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-secondary)' }}>
        Sign in to view your profile.
      </p>
    )
  }

  if (!editing) {
    return <ProfileSummary user={session.user} onEdit={() => setEditing(true)} />
  }

  return (
    <div className="profile-edit">
      <div className="profile-edit__toolbar">
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            color: 'var(--ink-primary)',
            margin: 0,
          }}
        >
          Edit profile
        </h2>
        <button type="button" className="btn-ghost profile-edit__cancel" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
      <ProfileForm onComplete={() => setEditing(false)} />
    </div>
  )
}