import { AnimatedFeatureCard } from './AnimatedFeatureCard'

const features = [
  {
    step: 1,
    title: 'Classify Intent',
    description:
      'Gemini analyzes your natural language question and classifies it into one of five types — stats, prediction, fantasy, tactical, or historical.',
    tag: 'Gemini 2.5 Flash Lite',
  },
  {
    step: 2,
    title: 'Query MongoDB',
    description:
      'The agent generates an optimal aggregation pipeline and pulls live match data, player profiles, team form, and head-to-head records from Atlas.',
    tag: 'MongoDB Atlas',
  },
  {
    step: 3,
    title: 'Analyze Data',
    description:
      'Gemini reasons over the retrieved data with a senior analyst system prompt, assembling structured insights backed by real database records.',
    tag: 'Agent Reasoning',
  },
  {
    step: 4,
    title: 'Deliver Insight',
    description:
      'You receive a structured analyst card — headline, full analysis, key stats, confidence signal, and a suggested follow-up question.',
    tag: 'Structured Response',
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-middle section-surface"
      style={{
        minHeight: '100vh',
        padding: 'var(--section-pad) clamp(24px, 6vw, 80px)',
      }}
    >
      <div className="section-scrim section-scrim-middle" aria-hidden="true" />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="tag" style={{ marginBottom: '16px' }}>
            How It Works
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              marginTop: '16px',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 28px rgba(0,0,0,0.5)',
            }}
          >
            From Question to Analyst Insight
          </h2>
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
            Four steps. Real data. Analyst-grade answers — not hallucinated stats.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <AnimatedFeatureCard
              key={feature.step}
              step={feature.step}
              title={feature.title}
              description={feature.description}
              tag={feature.tag}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}