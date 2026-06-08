import { NextResponse } from 'next/server'
import { isAdkEnabled, isAgentBuilderConfigured } from '@/lib/agent-builder'
import { isGeminiConfigured } from '@/lib/gemini'
import { isMcpServerConfigured } from '@/lib/mcp'
import { isMongoConfigured } from '@/lib/mongodb'
import { getTournamentDataMode } from '@/lib/tournament-phase'

export async function GET() {
  let mongoPing = false
  let mongoError: string | undefined

  if (isMongoConfigured()) {
    try {
      const { getSharedMongoClient } = await import('@/lib/mongo-connection')
      const client = await getSharedMongoClient()
      await client.db('matchmind').command({ ping: 1 })
      mongoPing = true
    } catch (error) {
      mongoError = error instanceof Error ? error.message : 'MongoDB ping failed'
    }
  }

  const status = {
    service: 'matchmind',
    timestamp: new Date().toISOString(),
    tournament_mode: getTournamentDataMode(),
    integrations: {
      mongodb: {
        configured: isMongoConfigured(),
        reachable: mongoPing,
        error: mongoError,
      },
      gemini: { configured: isGeminiConfigured() },
      adk: {
        enabled: isAdkEnabled(),
        project_configured: isAgentBuilderConfigured(),
      },
      mcp_server: { configured: isMcpServerConfigured() },
    },
    agent_ready: isGeminiConfigured() && (mongoPing || !isMongoConfigured()),
  }

  return NextResponse.json(status, {
    status: mongoPing || !isMongoConfigured() ? 200 : 503,
  })
}