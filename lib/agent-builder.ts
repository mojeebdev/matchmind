/**
 * Google Cloud Agent Builder Integration — @google/adk
 *
 * When USE_ADK_AGENT=true and GEMINI_API_KEY is set, routes questions through
 * the ADK LlmAgent (agent/matchmind-agent.ts) with query_football_data tool.
 * Otherwise falls back to the local multi-step pipeline in lib/agent.ts.
 *
 * Deploy to Agent Runtime:
 *   npx adk deploy agent_engine --project=$GOOGLE_CLOUD_PROJECT --region=$AGENT_BUILDER_LOCATION
 */

import { InMemoryRunner } from '@google/adk'
import { matchMindAgent } from '@/agent/matchmind-agent'
import { processAgentQuestion } from './agent'
import { isGeminiConfigured } from './gemini'
import { isMongoConfigured } from './mongodb'
import { validateAgentResponse } from './validation'
import type { AgentUserContext } from './user-context'
import { formatUserContextBlock } from './user-context'
import type { AgentResponse } from './types'
import { isPreviewMode } from './tournament-phase'

type AdkEvent = {
  content?: {
    parts?: Array<{
      text?: string
      functionResponse?: {
        name?: string
        id?: string
        response?: Record<string, unknown>
      }
    }>
  }
}

type AdkRunResult = {
  text: string
  queriedMongo: boolean
  mongoRecordCount: number
}

export function isAgentBuilderConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLOUD_PROJECT &&
      process.env.GOOGLE_CLOUD_PROJECT !== 'your_project_id' &&
      process.env.AGENT_BUILDER_LOCATION
  )
}

export function isAdkEnabled(): boolean {
  return process.env.USE_ADK_AGENT === 'true' && isGeminiConfigured()
}

async function collectAdkRunResult(
  events: AsyncIterable<AdkEvent>
): Promise<AdkRunResult> {
  let lastText = ''
  let queriedMongo = false
  let mongoRecordCount = 0

  for await (const event of events) {
    const parts = event.content?.parts ?? []
    for (const part of parts) {
      if (part.text) lastText = part.text

      const toolResponse = part.functionResponse?.response
      if (!toolResponse || typeof toolResponse !== 'object') continue

      const status = toolResponse.status
      const hasCount = toolResponse.record_count !== undefined

      if (status === 'success' || status === 'error' || hasCount) {
        queriedMongo = true
        const count = Number(toolResponse.record_count ?? 0)
        if (!Number.isNaN(count)) {
          mongoRecordCount += count
        } else if (Array.isArray(toolResponse.records)) {
          mongoRecordCount += toolResponse.records.length
        }
      }
    }
  }

  return { text: lastText, queriedMongo, mongoRecordCount }
}

function extractJsonPayload(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced?.[1]) return fenced[1].trim()

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start >= 0 && end > start) return text.slice(start, end + 1)

  return text.replace(/```json|```/g, '').trim()
}

function resolveLiveData(meta: AdkRunResult): boolean {
  if (!isMongoConfigured() || isPreviewMode()) return false
  return meta.queriedMongo
}

async function runAdkAgent(question: string, userContext?: AgentUserContext): Promise<AgentResponse> {
  const contextualQuestion = `${formatUserContextBlock(userContext)}${question}`
  const runner = new InMemoryRunner({
    agent: matchMindAgent,
    appName: 'matchmind',
  })

  const eventStream = runner.runEphemeral({
    userId: 'matchmind-api',
    newMessage: {
      role: 'user',
      parts: [{ text: contextualQuestion }],
    },
  })

  const meta = await collectAdkRunResult(eventStream)
  const clean = extractJsonPayload(meta.text)
  const liveData = resolveLiveData(meta)

  try {
    const parsed = JSON.parse(clean)
    const validated = validateAgentResponse(parsed, 'general')
    if (validated) {
      if (isMongoConfigured() && !meta.queriedMongo) {
        console.warn('[AgentBuilder] ADK skipped MongoDB tool — falling back to local pipeline')
        return processAgentQuestion(question, userContext)
      }

      const dataSources = [...validated.data_sources]
      if (liveData && !dataSources.some((s) => /mongodb|atlas|mcp/i.test(s))) {
        dataSources.unshift('MongoDB Atlas')
      }

      return {
        ...validated,
        data_sources: dataSources,
        live_data: liveData,
      }
    }
  } catch {
    // fall through to local pipeline
  }

  console.warn('[AgentBuilder] ADK response was not valid JSON — falling back to local pipeline')
  return processAgentQuestion(question, userContext)
}

/**
 * Main agent orchestration entry point.
 * Called by /api/agent.
 */
export async function runAgent(
  question: string,
  userContext?: AgentUserContext
): Promise<AgentResponse> {
  if (isAdkEnabled()) {
    return runAdkAgent(question, userContext)
  }

  return processAgentQuestion(question, userContext)
}