'use client'

import { useEffect, useMemo, useState } from 'react'

const DEFAULT_PHASES = [
  'Classifying your question…',
  'Querying MongoDB Atlas…',
  'Building analyst insight…',
] as const

type PassingBallLoaderProps = {
  label?: string
  phases?: readonly string[]
}

function SoccerBall() {
  return (
    <svg
      className="agent-pass-ball__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="11" fill="#F0EDE6" />
      <path
        d="M12 3.5 14.8 8.2 12 10.5 9.2 8.2Z"
        fill="#08090A"
      />
      <path
        d="M12 10.5 14.8 8.2 19.2 9.5 17.2 13.5 14.5 15.2Z"
        fill="#08090A"
      />
      <path
        d="M14.5 15.2 17.2 13.5 16.5 18.5 12 20.5 9.5 17.8Z"
        fill="#08090A"
      />
      <path
        d="M9.5 17.8 12 20.5 7.5 18.5 6.8 13.5 9.5 15.2Z"
        fill="#08090A"
      />
      <path
        d="M9.5 15.2 6.8 13.5 4.8 9.5 9.2 8.2 12 10.5Z"
        fill="#08090A"
      />
      <circle cx="12" cy="12" r="11" fill="none" stroke="rgba(8,9,10,0.15)" strokeWidth="0.5" />
    </svg>
  )
}

export function PassingBallLoader({
  label = 'MatchMind is on the ball',
  phases = DEFAULT_PHASES,
}: PassingBallLoaderProps) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const safePhases = useMemo(
    () => (phases.length > 0 ? [...phases] : [...DEFAULT_PHASES]),
    [phases]
  )
  const phaseKey = safePhases.join('|')

  useEffect(() => {
    setPhaseIndex(0)
    const interval = window.setInterval(() => {
      setPhaseIndex((current) => (current + 1) % safePhases.length)
    }, 2200)

    return () => window.clearInterval(interval)
  }, [phaseKey, safePhases.length])

  return (
    <div
      className="card agent-pass-loader"
      role="status"
      aria-live="polite"
      aria-label={safePhases[phaseIndex]}
    >
      <p className="agent-pass-loader__eyebrow">{label}</p>

      <div className="agent-pass-track" aria-hidden="true">
        <div className="agent-pass-arc" />
        <div className="agent-pass-player agent-pass-player--left">
          <span className="agent-pass-player__dot" />
        </div>
        <div className="agent-pass-player agent-pass-player--right">
          <span className="agent-pass-player__dot" />
        </div>
        <div className="agent-pass-ball">
          <SoccerBall />
        </div>
      </div>

      <p className="agent-pass-loader__phase" key={phaseIndex}>
        {safePhases[phaseIndex]}
      </p>
    </div>
  )
}