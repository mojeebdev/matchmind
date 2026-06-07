'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PassingBallLoader } from './PassingBallLoader'
import { ResponseCard } from './ResponseCard'
import type { AgentResponse } from '@/lib/types'

const ADMIN_KEY_STORAGE = 'matchmind_admin_key'

const ADMIN_LOADER_PHASES = [
  'Parsing your instruction…',
  'Writing to MongoDB Atlas…',
  'Confirming database update…',
] as const

const EXAMPLE_INSTRUCTIONS = [
  'Mexico beat South Korea 2-1 in Group A. Update the score and standings.',
  'Add 1 goal to Kylian Mbappé — he just scored.',
  'Set Brazil vs Morocco final score to 3-2 for Brazil.',
  'Show me current Group I standings before I update anything.',
]

type AdminResponse = AgentResponse & { admin_mode?: boolean }

export function AdminInterface() {
  const [adminKey, setAdminKey] = useState('')
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<AdminResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_KEY_STORAGE)
    if (saved) setAdminKey(saved)
  }, [])

  function persistKey(value: string) {
    setAdminKey(value)
    if (value.trim()) {
      sessionStorage.setItem(ADMIN_KEY_STORAGE, value.trim())
    } else {
      sessionStorage.removeItem(ADMIN_KEY_STORAGE)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!instruction.trim() || !adminKey.trim() || loading) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/admin/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey.trim(),
        },
        body: JSON.stringify({ instruction: instruction.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to run admin agent')
      }

      const data: AdminResponse = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span
          className="tag"
          style={{
            marginBottom: '16px',
            color: '#fbbf24',
            borderColor: 'rgba(251,191,36,0.35)',
            background: 'rgba(251,191,36,0.08)',
          }}
        >
          Admin Agent
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 600,
            color: 'var(--ink-primary)',
            marginTop: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          Update Match<span style={{ color: 'var(--gold)' }}>Mind</span> Data
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--ink-secondary)',
            maxWidth: '620px',
            margin: '16px auto 0',
            lineHeight: 1.7,
          }}
        >
          Tell the admin agent scores and player stats in plain English. It writes to
          MongoDB — fans see updates instantly on the public agent.
        </p>
        <Link
          href="/agent"
          style={{
            display: 'inline-block',
            marginTop: '16px',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--gold)',
            textDecoration: 'none',
          }}
        >
          ← Back to fan agent
        </Link>
      </div>

      <div
        className="card"
        style={{ padding: '20px 24px', marginBottom: '20px', borderColor: 'rgba(251,191,36,0.2)' }}
      >
        <label
          htmlFor="admin-key"
          style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            marginBottom: '10px',
          }}
        >
          Admin key (from ADMIN_SECRET in .env)
        </label>
        <input
          id="admin-key"
          type="password"
          value={adminKey}
          onChange={(e) => persistKey(e.target.value)}
          placeholder="Enter admin secret"
          style={{
            width: '100%',
            background: 'var(--void-03)',
            border: '1px solid var(--void-border)',
            borderRadius: '8px',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--ink-primary)',
            padding: '12px 16px',
          }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className="card"
          style={{
            padding: '8px',
            display: 'flex',
            gap: '8px',
            alignItems: 'stretch',
          }}
        >
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder='e.g. "Mexico beat South Korea 2-1 — update Group A"'
            disabled={loading || !adminKey.trim()}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--ink-primary)',
              padding: '16px 20px',
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !instruction.trim() || !adminKey.trim()}
            style={{
              opacity: loading || !instruction.trim() || !adminKey.trim() ? 0.6 : 1,
              cursor:
                loading || !instruction.trim() || !adminKey.trim()
                  ? 'not-allowed'
                  : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Updating…' : 'Update DB →'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          Example instructions
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {EXAMPLE_INSTRUCTIONS.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setInstruction(example)
                setResponse(null)
                setError(null)
              }}
              disabled={loading}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--ink-secondary)',
                background: 'var(--void-03)',
                border: '1px solid var(--void-border)',
                borderRadius: '999px',
                padding: '8px 16px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <PassingBallLoader
          label="Admin agent in play"
          phases={ADMIN_LOADER_PHASES}
        />
      )}

      {error && (
        <div
          className="card"
          style={{
            marginTop: '32px',
            padding: '24px',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          }}
        >
          <p style={{ color: '#f87171', fontSize: '14px' }}>{error}</p>
        </div>
      )}

      {response && <ResponseCard response={response} />}
    </div>
  )
}