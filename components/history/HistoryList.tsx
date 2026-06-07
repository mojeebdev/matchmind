'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ResponseCard } from '@/components/agent/ResponseCard'
import type { AgentResponse } from '@/lib/types'
import { agentPath } from '@/lib/urls'

type HistoryItem = {
  id: string
  question: string
  response: AgentResponse
  createdAt: string
}

export function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/history')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load history')
        return res.json()
      })
      .then((data) => setItems(data.items ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p style={{ color: 'var(--ink-secondary)' }}>Loading your agent history…</p>
  }

  if (error) {
    return <p style={{ color: '#f87171' }}>{error}</p>
  }

  if (items.length === 0) {
    return (
      <div className="card" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--ink-secondary)', marginBottom: '16px' }}>
          No saved interactions yet. Ask the agent a question while signed in and it will appear here.
        </p>
        <Link href={agentPath('/')} className="btn-primary">
          Ask Agent
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {items.map((item) => (
        <div key={item.id} className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  marginBottom: '8px',
                }}
              >
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <p style={{ color: 'var(--ink-primary)', fontSize: '15px', lineHeight: 1.6 }}>
                {item.question}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: '12px', padding: '8px 14px' }}
                onClick={() => setExpandedId((id) => (id === item.id ? null : item.id))}
              >
                {expandedId === item.id ? 'Hide answer' : 'View answer'}
              </button>
              <Link
                href={`${agentPath('/')}?q=${encodeURIComponent(item.question)}`}
                className="btn-primary"
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                Ask again
              </Link>
            </div>
          </div>
          {expandedId === item.id && (
            <div style={{ marginTop: '20px' }}>
              <ResponseCard response={item.response} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}