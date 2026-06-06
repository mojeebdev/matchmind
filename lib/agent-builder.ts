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
import { validateAgentResponse } from './validation'
import type { AgentResponse } from './types'

export function isAgentBuilderConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLOUD_PROJECT &&
      process.env.GOOGLE_CLOUD_PROJECT !== 'your_project_id' &&
      process.env.AGENT_BUILDER_LOCATION
  )
}

export function isAdkEnabled(): boolean {
  return (
    process.env.USE_ADK_AGENT === 'true' &&
    isGeminiConfigured()
  )
}

function extractTextFromAdkEvents(
  events: AsyncIterable<{ content?: { parts?: Array<{ text?: string }> } }>
): Promise<string> {
  return (async () => {
    let lastText = ''
    for await (const event of events) {
      const parts = event.content?.parts ?? []
      for (const part of parts) {
        if (part.text) lastText = part.text
      }
    }
    return lastText
  })()
}

function extractJsonPayload(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced?.[1]) return fenced[1].trim()

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start >= 0 && end > start) return text.slice(start, end + 1)

  return text.replace(/```json|```/g, '').trim()
}

function inferLiveData(sources: string[]): boolean {
  const blob = sources.join(' ').toLowerCase()
  if (blob.includes('demo')) return false
  return blob.includes('mongodb') || blob.includes('atlas') || blob.includes('mcp')
}

async function runAdkAgent(question: string): Promise<AgentResponse> {
  const runner = new InMemoryRunner({
    agent: matchMindAgent,
    appName: 'matchmind',
  })

  const eventStream = runner.runEphemeral({
    userId: 'matchmind-api',
    newMessage: {
      role: 'user',
      parts: [{ text: question }],
    },
  })

  const rawText = await extractTextFromAdkEvents(eventStream)
  const clean = extractJsonPayload(rawText)

  try {
    const parsed = JSON.parse(clean)
    const validated = validateAgentResponse(parsed, 'general')
    if (validated) {
      return { ...validated, live_data: inferLiveData(validated.data_sources) }
    }
  } catch {
    // fall through to local pipeline
  }

  console.warn('[AgentBuilder] ADK response was not valid JSON — falling back to local pipeline')
  const fallback = await processAgentQuestion(question)
  return fallback
}

/**
 * Main agent orchestration entry point.
 * Called by /api/agent.
 */
export async function runAgent(question: string): Promise<AgentResponse> {
  if (isAdkEnabled()) {
    console.info(
      `[AgentBuilder] ADK agent active` +
        (isAgentBuilderConfigured()
          ? ` (project: ${process.env.GOOGLE_CLOUD_PROJECT})`
          : ' (local InMemoryRunner)')
    )
    return runAdkAgent(question)
  }

  if (isAgentBuilderConfigured()) {
    console.info(
      `[AgentBuilder] Project ${process.env.GOOGLE_CLOUD_PROJECT} configured — ` +
        `set USE_ADK_AGENT=true to enable ADK orchestration`
    )
  }

  return processAgentQuestion(question)
}