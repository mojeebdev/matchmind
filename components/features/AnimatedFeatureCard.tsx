'use client'

import { useEffect, useRef, useState } from 'react'

type AnimatedFeatureCardProps = {
  step: number
  title: string
  description: string
  tag: string
  index: number
}

function useInView(threshold = 0.35) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

function useCountUp(target: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(0)
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!active) return

    if (reducedMotion) {
      setValue(target)
      return
    }

    const startTime = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration, reducedMotion])

  return value
}

export function AnimatedFeatureCard({
  step,
  title,
  description,
  tag,
  index,
}: AnimatedFeatureCardProps) {
  const { ref, inView } = useInView()
  const count = useCountUp(step, inView, 850 + index * 80)
  const display = inView ? String(count).padStart(2, '0') : '00'

  return (
    <div
      ref={ref}
      className={`card feature-card-animate${inView ? ' is-visible' : ''}`}
      style={{
        padding: '32px 28px',
        animationDelay: `${index * 120}ms`,
      }}
    >
      <span
        className={`feature-step-number${inView ? ' is-active' : ''}`}
        aria-label={`Step ${step}`}
      >
        {display}
      </span>
      <span className="tag" style={{ marginBottom: '12px' }}>
        {tag}
      </span>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--ink-primary)',
          marginBottom: '12px',
          marginTop: '12px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 300,
          color: 'var(--ink-secondary)',
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>
    </div>
  )
}