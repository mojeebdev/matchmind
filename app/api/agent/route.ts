import { applyDnsFix } from '@/lib/dns-fix'
import { NextRequest, NextResponse } from 'next/server'

applyDnsFix()
import { auth } from '@/auth'
import { runAgent } from '@/lib/agent-builder'
import { saveInteraction } from '@/lib/interactions'
import { buildAgentUserContext } from '@/lib/user-context'
import { findUserById } from '@/lib/users'
import { validateAgentResponse } from '@/lib/validation'
import { applyResponseDataMode } from '@/lib/response-data-mode'

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
    const session = await auth()
    let userContext

    if (session?.user?.id) {
      const user = await findUserById(session.user.id)
      if (user) {
        userContext = await buildAgentUserContext(session.user.id, user.profile)
      }
    }

    const response = applyResponseDataMode(await runAgent(trimmed, userContext))
    const validated = validateAgentResponse(response, 'general')

    if (!validated) {
      return NextResponse.json(
        { error: 'Agent returned an invalid response' },
        { status: 500 }
      )
    }

    const payload = {
      ...validated,
      ...(typeof response.live_data === 'boolean' ? { live_data: response.live_data } : {}),
      ...(typeof response.preview_data === 'boolean'
        ? { preview_data: response.preview_data }
        : {}),
      ...(response.agent_trace ? { agent_trace: response.agent_trace } : {}),
    }

    if (session?.user?.id) {
      await saveInteraction(session.user.id, trimmed, payload).catch((error) => {
        console.error('Failed to save interaction:', error)
      })
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Agent API error:', error)
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    )
  }
}