import {
  isPreviewMode,
  PREVIEW_DATA_SOURCE,
  PREVIEW_DISCLOSURE,
} from './tournament-phase'
import type { AgentResponse } from './types'

function withPreviewDisclaimer(answer: string): string {
  if (answer.includes('illustrative preview mockup')) return answer
  return `${PREVIEW_DISCLOSURE}\n\n${answer}`
}

/** Apply preview vs live flags so the UI can badge responses honestly. */
export function applyResponseDataMode(response: AgentResponse): AgentResponse {
  if (!isPreviewMode()) {
    return {
      ...response,
      preview_data: false,
    }
  }

  const sources = [
    PREVIEW_DATA_SOURCE,
    ...response.data_sources.filter((s) => s !== PREVIEW_DATA_SOURCE),
  ]

  return {
    ...response,
    preview_data: true,
    live_data: false,
    answer: withPreviewDisclaimer(response.answer),
    data_sources: [...new Set(sources)].slice(0, 8),
    confidence: response.confidence === 'high' ? 'medium' : response.confidence,
  }
}