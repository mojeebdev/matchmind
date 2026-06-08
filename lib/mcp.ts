/**
 * MongoDB Atlas MCP Tool Interface
 *
 * Wraps football data retrieval behind an MCP-compatible tool contract so the
 * agent can be wired to a real MongoDB Atlas MCP Server in production. When no
 * MCP server endpoint is configured, executes via the direct MongoDB driver
 * (lib/mongodb.ts) — same credentials, same aggregation semantics.
 *
 * Tool definition mirrors MongoDB MCP Server's query interface:
 *   tool: query_football_data
 *   input: { collection, pipeline }
 *   output: { records, source, tool }
 */

import { queryCollection, isMongoConfigured } from './mongodb'
import type { MongoQueryPlan } from './types'

export const MCP_TOOL_DEFINITIONS = {
  query_football_data: {
    name: 'query_football_data',
    description:
      'Execute a MongoDB aggregation pipeline against World Cup football intelligence collections (matches, players, teams, headToHead, playerWorldCupCareers, worldCupEditions, worldCupRecords).',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          enum: [
            'matches',
            'players',
            'teams',
            'headToHead',
            'playerWorldCupCareers',
            'worldCupEditions',
            'worldCupRecords',
          ],
        },
        pipeline: {
          type: 'array',
          description: 'MongoDB aggregation pipeline stages (read-only)',
        },
      },
      required: ['collection', 'pipeline'],
    },
  },
} as const

export type McpQueryResult = {
  records: Record<string, unknown>[]
  source: 'mcp' | 'direct-driver' | 'demo'
  tool: 'query_football_data'
  collection: string
}

/**
 * Execute a football data query through the MCP tool interface.
 * Falls back to direct MongoDB driver when MCP server is not configured.
 */
async function callMcpServerHttp(
  plan: MongoQueryPlan
): Promise<Record<string, unknown>[]> {
  const baseUrl = process.env.MCP_SERVER_URL?.trim()
  if (!baseUrl) {
    throw new Error('MCP_SERVER_URL is not configured')
  }

  const endpoint = baseUrl.endsWith('/tools/call')
    ? baseUrl
    : `${baseUrl.replace(/\/$/, '')}/tools/call`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.MCP_SERVER_TOKEN
        ? { Authorization: `Bearer ${process.env.MCP_SERVER_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({
      name: 'query_football_data',
      arguments: {
        collection: plan.collection,
        pipeline: plan.pipeline,
      },
    }),
    signal: AbortSignal.timeout(20_000),
  })

  if (!response.ok) {
    throw new Error(`MCP server HTTP ${response.status}`)
  }

  const payload = (await response.json()) as {
    records?: Record<string, unknown>[]
    result?: { records?: Record<string, unknown>[] }
    content?: Array<{ text?: string }>
  }

  if (Array.isArray(payload.records)) return payload.records
  if (Array.isArray(payload.result?.records)) return payload.result.records

  const text = payload.content?.[0]?.text
  if (text) {
    const parsed = JSON.parse(text) as { records?: Record<string, unknown>[] }
    if (Array.isArray(parsed.records)) return parsed.records
  }

  throw new Error('MCP server returned an unexpected payload shape')
}

export async function mcpQueryFootballData(
  plan: MongoQueryPlan
): Promise<McpQueryResult> {
  if (!isMongoConfigured()) {
    throw new Error('MongoDB is not configured')
  }

  if (isMcpServerConfigured()) {
    try {
      const records = await callMcpServerHttp(plan)
      return {
        records,
        source: 'mcp',
        tool: 'query_football_data',
        collection: plan.collection,
      }
    } catch (error) {
      console.warn('[MatchMind] MCP server call failed — falling back to direct driver:', error)
    }
  }

  const records = await queryCollection(plan.collection, plan.pipeline)

  return {
    records: records as Record<string, unknown>[],
    source: 'direct-driver',
    tool: 'query_football_data',
    collection: plan.collection,
  }
}

export function isMcpServerConfigured(): boolean {
  return Boolean(process.env.MCP_SERVER_URL)
}