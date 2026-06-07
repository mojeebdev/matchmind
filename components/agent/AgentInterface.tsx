'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PassingBallLoader } from './PassingBallLoader'
import { ResponseCard } from './ResponseCard'
import type { AgentResponse } from '@/lib/types'
import { agentPath, appPath, authPath } from '@/lib/urls'

const EXAMPLE_QUESTIONS = [
  'Who are the top scorers in Group B?',
  'Predict the Brazil vs France quarterfinal',
  'Build me a fantasy XI from Group C players',
  "What's Argentina's defensive weakness this tournament?",
  'What is the head-to-head record between Brazil and France?',
]

type RecentItem = {
  id: string
  question: string
  createdAt: string
}

export function AgentInterface() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<AgentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recent, setRecent] = useState<RecentItem[]>([])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setQuestion(q)
  }, [searchParams])

  useEffect(() => {
    if (!session?.user) {
      setRecent([])
      return
    }

    fetch('/api/history')
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setRecent((data.items ?? []).slice(0, 5)))
      .catch(() => setRecent([]))
  }, [session?.user, response])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || loading) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to get response')
      }

      const data: AgentResponse = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleExampleClick(example: string) {
    setQuestion(example)
    setResponse(null)
    setError(null)
  }

  const profile = session?.user?.profile

  return (
    <div className="agent-interface" style={{ maxWidth: 'var(--content-max)', margin: '0 auto', width: '100%' }}>
      <div className="agent-interface__header">
        <span className="tag" style={{ marginBottom: '16px' }}>
          Live Agent
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
          Ask Match<span style={{ color: 'var(--gold)' }}>Mind</span>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--ink-secondary)',
            maxWidth: '560px',
            margin: '16px auto 0',
            lineHeight: 1.7,
          }}
        >
          Type any World Cup 2026 question. The agent classifies your intent,
          queries MongoDB, and returns analyst-grade insight.
        </p>

        {session?.user ? (
          <p className="agent-interface__personalized">
            Personalized for{' '}
            {profile?.username
              ? `@${profile.username}`
              : profile?.supportedCountry
                ? `${profile.supportedCountry}${profile?.favoritePlayer ? ` · ${profile.favoritePlayer}` : ''}`
                : profile?.displayName || session.user.name || 'your profile'}
            {' · '}
            <Link href={appPath('/history')} style={{ color: 'var(--ink-secondary)', textDecoration: 'none' }}>
              View history
            </Link>
          </p>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-muted)', marginTop: '12px' }}>
            <Link href={authPath('/signin')} style={{ color: 'var(--gold)', textDecoration: 'none' }}>
              Sign in
            </Link>{' '}
            to save history and personalize answers.
          </p>
        )}

        <Link
          href={agentPath('/admin')}
          style={{
            display: 'inline-block',
            marginTop: '12px',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--ink-muted)',
            textDecoration: 'none',
          }}
        >
          Admin: update scores & stats →
        </Link>
      </div>

      {recent.length > 0 && (
        <div className="card" style={{ padding: '18px 20px', marginBottom: '20px' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            Your recent questions
          </span>
          <div className="agent-chip-list">
            {recent.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleExampleClick(item.question)}
                disabled={loading}
                className="agent-chip"
              >
                {item.question}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card agent-search">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Who are the top scorers in Group B?"
            disabled={loading}
            className="agent-search__input"
          />
          <button
            type="submit"
            className="btn-primary agent-search__submit"
            disabled={loading || !question.trim()}
          >
            <span className="agent-search__submit-label agent-search__submit-label--full">
              {loading ? 'Analyzing…' : 'Analyze →'}
            </span>
            <span className="agent-search__submit-label agent-search__submit-label--short">
              {loading ? '…' : 'Analyze'}
            </span>
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
          Try an example
        </span>
        <div className="agent-chip-list">
          {EXAMPLE_QUESTIONS.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleExampleClick(example)}
              disabled={loading}
              className="agent-chip"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {loading && <PassingBallLoader />}

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