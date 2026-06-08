import { findSquadPlayerName, getAllRosterNames } from './player-enrichment'
import { matchHistoricalQuery } from './worldcup-historical-data'
import type { MongoQueryPlan } from './types'

export function matchPlayerQuery(question: string): MongoQueryPlan | null {
  const historical = matchHistoricalQuery(question)
  if (historical?.collection === 'playerWorldCupCareers') return historical

  const names = getAllRosterNames()
  const player = findSquadPlayerName(question, names)
  if (!player) return null

  const q = question.toLowerCase()
  if (
    /club|recent|form|last match|season|perform|how is|tell me about|stats for|profile/.test(q) ||
    /player|striker|midfielder|defender|goalkeeper|fw|mf|df|gk/.test(q) ||
    player
  ) {
    return {
      collection: 'players',
      pipeline: [{ $match: { name: player } }, { $limit: 1 }],
    }
  }

  return {
    collection: 'players',
    pipeline: [{ $match: { name: player } }, { $limit: 1 }],
  }
}