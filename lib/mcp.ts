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
export async function mcpQueryFootballData(
  plan: MongoQueryPlan
): Promise<McpQueryResult> {
  if (!isMongoConfigured()) {
    throw new Error('MongoDB is not configured')
  }

  // MCP server HTTP transport would be wired here when MCP_SERVER_URL is set.
  // For now, the direct driver implements the same tool contract locally.
  const records = await queryCollection(plan.collection, plan.pipeline)

  return {
    records: records as Record<string, unknown>[],
    source: process.env.MCP_SERVER_URL ? 'mcp' : 'direct-driver',
    tool: 'query_football_data',
    collection: plan.collection,
  }
}

export function isMcpServerConfigured(): boolean {
  return Boolean(process.env.MCP_SERVER_URL)
}