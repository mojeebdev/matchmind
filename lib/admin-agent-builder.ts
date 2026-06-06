import { InMemoryRunner } from '@google/adk'
import { matchMindAdminAgent } from '@/agent/matchmind-admin-agent'
import { isGeminiConfigured } from './gemini'
import { validateAgentResponse } from './validation'
import type { AgentResponse } from './types'

function extractJsonPayload(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced?.[1]) return fenced[1].trim()

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start >= 0 && end > start) return text.slice(start, end + 1)

  return text.replace(/```json|```/g, '').trim()
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

export function isAdminAgentAvailable(): boolean {
  return isGeminiConfigured()
}

export async function runAdminAgent(question: string): Promise<AgentResponse> {
  if (!isAdminAgentAvailable()) {
    throw new Error('GEMINI_API_KEY is required for the admin agent')
  }

  const runner = new InMemoryRunner({
    agent: matchMindAdminAgent,
    appName: 'matchmind-admin',
  })

  const eventStream = runner.runEphemeral({
    userId: 'matchmind-admin',
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
      return {
        ...validated,
        live_data: true,
        data_sources: [...validated.data_sources, 'MatchMind admin write'],
      }
    }
  } catch {
    // fall through
  }

  return {
    question_type: 'general',
    headline: 'Admin update completed — review server logs',
    answer:
      `The admin agent processed your request but did not return valid JSON.\n\nRaw response:\n${rawText.slice(0, 1200)}`,
    key_stats: [
      {
        label: 'Status',
        value: 'Partial',
        context: 'Write tools may still have executed — verify in MongoDB',
      },
    ],
    confidence: 'low',
    follow_up: 'Query the match or player to confirm the update landed',
    data_sources: ['MatchMind admin agent', 'MongoDB Atlas'],
    live_data: true,
  }
}