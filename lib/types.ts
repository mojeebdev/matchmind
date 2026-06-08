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

export interface AgentTraceStep {
  step: string
  detail: string
  status: 'complete' | 'error' | 'skipped'
}

export interface AgentTrace {
  pipeline: 'adk' | 'local'
  steps: AgentTraceStep[]
  mongo?: {
    configured: boolean
    queried: boolean
    collection?: string
    record_count?: number
    source?: 'mcp' | 'direct-driver' | 'demo'
  }
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
  /** Visible reasoning trace for demos and judges */
  agent_trace?: AgentTrace
}

export interface MongoQueryPlan {
  collection: string
  pipeline: Record<string, unknown>[]
}