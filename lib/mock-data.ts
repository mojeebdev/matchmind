import type { AgentResponse, QuestionType } from './types'
import {
  MOCK_TEAMS,
  MOCK_PLAYERS,
  MOCK_MATCHES,
  MOCK_HEAD_TO_HEAD,
} from './worldcup2026-data'

export { MOCK_TEAMS, MOCK_PLAYERS, MOCK_MATCHES, MOCK_HEAD_TO_HEAD }

export function getMockDataForType(questionType: QuestionType, question: string): Record<string, unknown> {
  const q = question.toLowerCase()

  switch (questionType) {
    case 'stats':
      if (q.includes('scorer') || q.includes('goal')) {
        return { players: [...MOCK_PLAYERS].sort((a, b) => b.goals - a.goals).slice(0, 10) }
      }
      if (q.includes('group')) {
        const groupMatch = q.match(/group\s+([a-l])/i)
        const group = groupMatch ? groupMatch[1].toUpperCase() : 'I'
        return { teams: MOCK_TEAMS.filter((t) => t.group === group) }
      }
      return { players: MOCK_PLAYERS.slice(0, 12), teams: MOCK_TEAMS.slice(0, 12) }
    case 'prediction':
      return {
        matches: MOCK_MATCHES.filter((m) => m.stage === 'quarter' || m.stage === 'round-of-16').slice(0, 6),
        teams: MOCK_TEAMS.filter((t) => t.points >= 6),
      }
    case 'fantasy':
      return { players: [...MOCK_PLAYERS].sort((a, b) => b.goals + b.assists - (a.goals + a.assists)).slice(0, 15) }
    case 'tactical':
      return { teams: MOCK_TEAMS, matches: MOCK_MATCHES.filter((m) => m.stage === 'group').slice(0, 8) }
    case 'historical':
      if (q.includes('brazil') && q.includes('france')) {
        return { headToHead: MOCK_HEAD_TO_HEAD.filter((h) => h.team1 === 'Brazil' && h.team2 === 'France') }
      }
      return { headToHead: MOCK_HEAD_TO_HEAD, matches: MOCK_MATCHES.slice(0, 8) }
    default:
      return { teams: MOCK_TEAMS.slice(0, 12), players: MOCK_PLAYERS.slice(0, 8), matches: MOCK_MATCHES.slice(0, 5) }
  }
}

export function getMockResponse(questionType: QuestionType, question: string): AgentResponse {
  const topScorer = [...MOCK_PLAYERS].sort((a, b) => b.goals - a.goals)[0]
  const groupLeader = MOCK_TEAMS.find((t) => t.group === 'I')

  return {
    question_type: questionType,
    headline: `World Cup 2026: ${topScorer.name} Leads Golden Boot Race`,
    answer: `The FIFA World Cup 2026 intelligence database tracks 48 nations across 12 groups (A through L). ${topScorer.name} leads all scorers with ${topScorer.goals} goals for ${topScorer.team}.\n\nGroup I is led by ${groupLeader?.name ?? 'France'} on ${groupLeader?.points ?? 7} points after three matchdays. The tournament has progressed to the quarter-final stage, with blockbuster ties including Brazil vs France and Argentina vs England.\n\nAll statistics in this response trace to the MatchMind MongoDB intelligence database — teams, players, matches, and head-to-head collections.`,
    key_stats: [
      { label: 'Top Scorer', value: `${topScorer.name} (${topScorer.goals})`, context: `${topScorer.team} · Golden Boot leader` },
      { label: 'Teams', value: '48', context: '12 groups of 4 nations' },
      { label: 'Group I Leader', value: groupLeader?.name ?? 'France', context: `${groupLeader?.points ?? 7} pts · ${groupLeader?.goalsFor ?? 7} GF` },
      { label: 'Stage', value: 'Quarter-finals', context: 'Knockout bracket active' },
    ],
    confidence: 'high',
    follow_up: 'Show me the full Group L standings',
    data_sources: ['Demo dataset', 'World Cup 2026 seed data'],
    live_data: false,
  }
}