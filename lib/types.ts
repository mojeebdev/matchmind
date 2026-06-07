export type QuestionType =
  | 'stats'
  | 'prediction'
  | 'fantasy'
  | 'tactical'
  | 'historical'
  | 'general'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface KeyStat {
  label: string
  value: string
  context: string
}

export interface AgentResponse {
  question_type: QuestionType
  headline: string
  answer: string
  key_stats: KeyStat[]
  confidence: ConfidenceLevel
  follow_up: string
  data_sources: string[]
  /** true = queried live MongoDB Atlas with real tournament results */
  live_data?: boolean
  /** true = illustrative preview mockup before World Cup kickoff */
  preview_data?: boolean
}

export interface MongoQueryPlan {
  collection: string
  pipeline: Record<string, unknown>[]
}