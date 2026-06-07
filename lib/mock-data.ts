import type { AgentResponse, QuestionType } from './types'
import { isPreviewMode } from './tournament-phase'
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
        matches: MOCK_MATCHES.filter((m) =>
          isPreviewMode()
            ? m.stage === 'quarter' || m.stage === 'round-of-16'
            : m.stage === 'group' && m.status === 'scheduled'
        ).slice(0, 6),
        teams: isPreviewMode()
          ? MOCK_TEAMS.filter((t) => t.points >= 6)
          : MOCK_TEAMS.slice(0, 8),
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
  if (!isPreviewMode()) {
    const opener = MOCK_MATCHES.find((m) => m.status === 'scheduled')
    return {
      question_type: questionType,
      headline: 'World Cup 2026 Has Not Started Yet',
      answer: `The FIFA World Cup 2026 opens 11 June 2026. MongoDB is not configured in this environment, so MatchMind cannot query live data. When connected, the database holds scheduled fixtures with no results until matches are synced.\n\nQuestion received: "${question}".`,
      key_stats: [
        { label: 'Tournament status', value: 'Pre-kickoff', context: 'Awaiting first match' },
        { label: 'Teams', value: '48', context: '12 groups of 4 nations' },
        {
          label: 'Sample fixture',
          value: opener ? `${opener.homeTeam} vs ${opener.awayTeam}` : 'TBD',
          context: opener?.group ? `Group ${opener.group} · scheduled` : 'Scheduled',
        },
      ],
      confidence: 'medium',
      follow_up: 'Which teams are in Group A?',
      data_sources: ['Demo dataset', 'World Cup 2026 live seed'],
      live_data: false,
    }
  }

  const topScorer = [...MOCK_PLAYERS].sort((a, b) => b.goals - a.goals)[0]
  const groupLeader = MOCK_TEAMS.find((t) => t.group === 'I')

  return {
    question_type: questionType,
    headline: `Preview: ${topScorer.name} Leads Illustrative Golden Boot Race`,
    answer: `MatchMind is showing illustrative preview mockup data before the World Cup kicks off on 11 June 2026. ${topScorer.name} leads the sample dataset with ${topScorer.goals} goals for ${topScorer.team} — these figures are for demo UX only, not real match results.\n\nGroup I sample leader: ${groupLeader?.name ?? 'France'} on ${groupLeader?.points ?? 0} points. Real stats will replace this dataset after kickoff via sync.\n\nQuestion received: "${question}".`,
    key_stats: [
      { label: 'Top scorer (mockup)', value: `${topScorer.name} (${topScorer.goals})`, context: `${topScorer.team} · preview only` },
      { label: 'Teams', value: '48', context: '12 groups · illustrative dataset' },
      { label: 'Group I leader (mockup)', value: groupLeader?.name ?? 'France', context: `${groupLeader?.points ?? 0} pts · preview only` },
      { label: 'Updates', value: '11 Jun 2026', context: 'Live results after kickoff' },
    ],
    confidence: 'medium',
    follow_up: 'Show me the full Group L standings',
    data_sources: ['Preview mockup dataset'],
    live_data: false,
    preview_data: true,
  }
}