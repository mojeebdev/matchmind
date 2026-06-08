import { FunctionTool } from '@google/adk'
import { z } from 'zod'
import { mcpQueryFootballData } from '@/lib/mcp'
import { sanitizeQueryPlan } from '@/lib/query-safety'
import { getDefaultQueryForType } from '@/lib/query-defaults'
import { updateMatchResult, updatePlayerStats } from '@/lib/mongo-writes'

const COLLECTIONS = [
  'matches',
  'players',
  'teams',
  'headToHead',
  'groups',
  'tournament',
  'playerWorldCupCareers',
  'worldCupEditions',
  'worldCupRecords',
] as const

export const queryFootballDataTool = new FunctionTool({
  name: 'query_football_data',
  description:
    'Query World Cup football intelligence from MongoDB Atlas. ' +
    'Collections: matches, players, teams, headToHead, groups, tournament, ' +
    'playerWorldCupCareers (career stats 1930–2022), worldCupEditions, worldCupRecords. ' +
    'Use read-only aggregation pipelines only.',
  parameters: z.object({
    collection: z.enum(COLLECTIONS).describe('MongoDB collection to query'),
    pipeline: z
      .array(z.record(z.string(), z.unknown()))
      .describe('MongoDB aggregation pipeline stages (read-only)'),
  }),
  execute: async ({ collection, pipeline }) => {
    try {
      const plan = sanitizeQueryPlan(
        { collection, pipeline },
        getDefaultQueryForType('general', '')
      )
      const result = await mcpQueryFootballData(plan)
      return {
        status: 'success',
        collection: result.collection,
        source: result.source,
        record_count: result.records.length,
        records: result.records,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'MongoDB query failed'
      return { status: 'error', message, records: [] }
    }
  },
})

export const updateMatchResultTool = new FunctionTool({
  name: 'update_match_result',
  description:
    'Update a fixture score in MongoDB. Recalculates group standings when the match is a group-stage game. ' +
    'Use exact homeTeam and awayTeam names as stored in the database.',
  parameters: z.object({
    homeTeam: z.string().describe('Home team name, e.g. Mexico'),
    awayTeam: z.string().describe('Away team name, e.g. South Korea'),
    homeScore: z.number().int().min(0).describe('Goals scored by the home team'),
    awayScore: z.number().int().min(0).describe('Goals scored by the away team'),
    status: z
      .enum(['scheduled', 'live', 'finished'])
      .optional()
      .describe('Match status — defaults to finished'),
  }),
  execute: async (input) => updateMatchResult(input),
})

export const updatePlayerStatsTool = new FunctionTool({
  name: 'update_player_stats',
  description:
    'Update a player goals/assists in MongoDB. Use goalsDelta/assistsDelta to add to current totals, or goals/assists to set absolute values.',
  parameters: z.object({
    playerName: z.string().describe('Player name, e.g. Kylian Mbappé'),
    goals: z.number().int().min(0).optional().describe('Set absolute goal count'),
    assists: z.number().int().min(0).optional().describe('Set absolute assist count'),
    goalsDelta: z.number().int().optional().describe('Add to current goals, e.g. 1 after a scorer'),
    assistsDelta: z.number().int().optional().describe('Add to current assists'),
  }),
  execute: async (input) => updatePlayerStats(input),
})