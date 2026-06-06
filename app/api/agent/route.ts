import { applyDnsFix } from '@/lib/dns-fix'
import { NextRequest, NextResponse } from 'next/server'

applyDnsFix()
import { runAgent } from '@/lib/agent-builder'
import { validateAgentResponse } from '@/lib/validation'

const MAX_QUESTION_LENGTH = 1000

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const question = (body as { question?: unknown })?.question

  if (!question || typeof question !== 'string' || !question.trim()) {
    return NextResponse.json(
      { error: 'A valid question string is required' },
      { status: 400 }
    )
  }

  const trimmed = question.trim()

  if (trimmed.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `Question must be ${MAX_QUESTION_LENGTH} characters or fewer` },
      { status: 400 }
    )
  }

  try {
    const response = await runAgent(trimmed)
    const validated = validateAgentResponse(response, 'general')

    if (!validated) {
      return NextResponse.json(
        { error: 'Agent returned an invalid response' },
        { status: 500 }
      )
    }

    const payload =
      typeof response.live_data === 'boolean'
        ? { ...validated, live_data: response.live_data }
        : validated

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Agent API error:', error)
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    )
  }
}