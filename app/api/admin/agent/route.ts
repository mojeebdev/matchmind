import { applyDnsFix } from '@/lib/dns-fix'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminKey, isAdminConfigured } from '@/lib/admin-auth'
import { runAdminAgent, isAdminAgentAvailable } from '@/lib/admin-agent-builder'
import { validateAgentResponse } from '@/lib/validation'

applyDnsFix()

const MAX_INSTRUCTION_LENGTH = 1500

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'Admin agent is not configured. Set ADMIN_SECRET in .env' },
      { status: 503 }
    )
  }

  if (!isAdminAgentAvailable()) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is required for the admin agent' },
      { status: 503 }
    )
  }

  const adminKey =
    request.headers.get('x-admin-key') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  if (!verifyAdminKey(adminKey)) {
    return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const instruction = (body as { instruction?: unknown })?.instruction
  if (!instruction || typeof instruction !== 'string' || !instruction.trim()) {
    return NextResponse.json(
      { error: 'A valid instruction string is required' },
      { status: 400 }
    )
  }

  const trimmed = instruction.trim()
  if (trimmed.length > MAX_INSTRUCTION_LENGTH) {
    return NextResponse.json(
      { error: `Instruction must be ${MAX_INSTRUCTION_LENGTH} characters or fewer` },
      { status: 400 }
    )
  }

  try {
    const response = await runAdminAgent(trimmed)
    const validated = validateAgentResponse(response, 'general')

    if (!validated) {
      return NextResponse.json(
        { error: 'Admin agent returned an invalid response' },
        { status: 500 }
      )
    }

    const payload =
      typeof response.live_data === 'boolean'
        ? { ...validated, live_data: response.live_data, admin_mode: true }
        : { ...validated, admin_mode: true }

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Admin agent API error:', error)
    return NextResponse.json(
      { error: 'Failed to process admin instruction' },
      { status: 500 }
    )
  }
}