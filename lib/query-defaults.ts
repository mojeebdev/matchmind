import type { MongoQueryPlan, QuestionType } from './types'
import { matchPlayerQuery } from './player-queries'
import { matchHistoricalQuery } from './worldcup-historical-data'

export function getDefaultQueryForType(
  questionType: QuestionType,
  question: string
): MongoQueryPlan {
  const q = question.toLowerCase()
  const playerQuery = matchPlayerQuery(question)
  if (playerQuery) return playerQuery

  switch (questionType) {
    case 'stats': {
      const historical = matchHistoricalQuery(question)
      if (historical) return historical
      if (q.includes('scorer') || q.includes('goal')) {
        return {
          collection: 'players',
          pipeline: [{ $sort: { goals: -1 } }, { $limit: 10 }],
        }
      }
      if (q.includes('group')) {
        const groupMatch = q.match(/group\s+([a-l])/i)
        const group = groupMatch ? groupMatch[1].toUpperCase() : 'A'
        return {
          collection: 'teams',
          pipeline: [{ $match: { group } }, { $sort: { wins: -1 } }],
        }
      }
      return {
        collection: 'players',
        pipeline: [{ $sort: { goals: -1 } }, { $limit: 8 }],
      }
    }
    case 'prediction':
      return {
        collection: 'matches',
        pipeline: [{ $sort: { date: -1 } }, { $limit: 6 }],
      }
    case 'fantasy':
      return {
        collection: 'players',
        pipeline: [
          { $addFields: { total: { $add: ['$goals', '$assists'] } } },
          { $sort: { total: -1 } },
          { $limit: 15 },
        ],
      }
    case 'tactical':
      return {
        collection: 'teams',
        pipeline: [{ $sort: { possession: -1 } }],
      }
    case 'historical': {
      const historical = matchHistoricalQuery(question)
      if (historical) return historical
      return {
        collection: 'headToHead',
        pipeline: [{ $limit: 5 }],
      }
    }
    default:
      return {
        collection: 'teams',
        pipeline: [{ $limit: 8 }],
      }
  }
}