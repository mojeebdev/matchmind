import type {
  AgentResponse,
  ConfidenceLevel,
  KeyStat,
  QuestionType,
} from './types'

const VALID_TYPES: QuestionType[] = [
  'stats',
  'prediction',
  'fantasy',
  'tactical',
  'historical',
  'general',
]

const VALID_CONFIDENCE: ConfidenceLevel[] = ['high', 'medium', 'low']

function normalizeQuestionType(value: unknown, fallback: QuestionType): QuestionType {
  if (typeof value !== 'string') return fallback
  const cleaned = value.trim().toLowerCase().replace(/[^a-z]/g, '')
  return VALID_TYPES.includes(cleaned as QuestionType)
    ? (cleaned as QuestionType)
    : fallback
}

function normalizeConfidence(value: unknown): ConfidenceLevel {
  if (typeof value !== 'string') return 'medium'
  const cleaned = value.trim().toLowerCase()
  return VALID_CONFIDENCE.includes(cleaned as ConfidenceLevel)
    ? (cleaned as ConfidenceLevel)
    : 'medium'
}

function normalizeKeyStats(value: unknown): KeyStat[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const stat = item as Record<string, unknown>
      return {
        label: typeof stat.label === 'string' ? stat.label : 'Stat',
        value: typeof stat.value === 'string' ? stat.value : String(stat.value ?? '—'),
        context: typeof stat.context === 'string' ? stat.context : '',
      }
    })
    .slice(0, 8)
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item) => typeof item === 'string' && item.trim())
    .map((item) => (item as string).trim())
}

/**
 * Validates and normalizes a Gemini or template response into a safe AgentResponse.
 * Returns null if the payload is too malformed to salvage.
 */
export function validateAgentResponse(
  raw: unknown,
  fallbackType: QuestionType
): AgentResponse | null {
  if (!raw || typeof raw !== 'object') return null

  const obj = raw as Record<string, unknown>

  const headline =
    typeof obj.headline === 'string' && obj.headline.trim()
      ? obj.headline.trim()
      : null
  const answer =
    typeof obj.answer === 'string' && obj.answer.trim()
      ? obj.answer.trim()
      : null

  if (!headline || !answer) return null

  const followUp =
    typeof obj.follow_up === 'string' && obj.follow_up.trim()
      ? obj.follow_up.trim()
      : 'What else would you like to know about World Cup 2026?'

  const liveData =
    typeof obj.live_data === 'boolean'
      ? obj.live_data
      : undefined
  const previewData =
    typeof obj.preview_data === 'boolean'
      ? obj.preview_data
      : undefined

  return {
    question_type: normalizeQuestionType(obj.question_type, fallbackType),
    headline,
    answer,
    key_stats: normalizeKeyStats(obj.key_stats),
    confidence: normalizeConfidence(obj.confidence),
    follow_up: followUp,
    data_sources: normalizeStringArray(obj.data_sources).length
      ? normalizeStringArray(obj.data_sources)
      : ['MongoDB football intelligence database'],
    ...(liveData !== undefined ? { live_data: liveData } : {}),
    ...(previewData !== undefined ? { preview_data: previewData } : {}),
  }
}