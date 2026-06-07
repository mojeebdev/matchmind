import type { AgentResponse, QuestionType } from './types'

type PlayerRecord = {
  name?: string
  team?: string
  goals?: number
  assists?: number
  xG?: number
  position?: string
  minutes?: number
}

type TeamRecord = {
  name?: string
  group?: string
  wins?: number
  draws?: number
  losses?: number
  goalsFor?: number
  goalsAgainst?: number
  possession?: number
  form?: string[]
}

type MatchRecord = {
  homeTeam?: string
  awayTeam?: string
  score?: { home?: number; away?: number }
  stage?: string
  group?: string | null
}

type H2HRecord = {
  team1?: string
  team2?: string
  totalMatches?: number
  team1Wins?: number
  team2Wins?: number
  draws?: number
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function firstCollectionData(mongoData: Record<string, unknown>): {
  key: string
  records: Record<string, unknown>[]
} {
  for (const [key, value] of Object.entries(mongoData)) {
    if (Array.isArray(value) && value.length > 0) {
      return { key, records: value as Record<string, unknown>[] }
    }
  }
  return { key: 'unknown', records: [] }
}

function hasLiveRecords(mongoData: Record<string, unknown>): boolean {
  return Object.values(mongoData).some(
    (v) => Array.isArray(v) && v.length > 0
  )
}

function buildPlayerStats(players: PlayerRecord[]): AgentResponse['key_stats'] {
  return players.slice(0, 4).map((p) => ({
    label: p.name ?? 'Player',
    value: `${p.goals ?? 0}G / ${p.assists ?? 0}A`,
    context: `${p.team ?? 'Unknown'} · ${p.position ?? '—'} · xG ${p.xG ?? 0}`,
  }))
}

function buildTeamStats(teams: TeamRecord[]): AgentResponse['key_stats'] {
  return teams.slice(0, 4).map((t) => ({
    label: t.name ?? 'Team',
    value: `Group ${t.group ?? '—'}`,
    context: `W${t.wins ?? 0} D${t.draws ?? 0} L${t.losses ?? 0} · ${t.goalsFor ?? 0}GF/${t.goalsAgainst ?? 0}GA`,
  }))
}

function buildMatchStats(matches: MatchRecord[]): AgentResponse['key_stats'] {
  return matches.slice(0, 4).map((m) => ({
    label: `${m.homeTeam ?? '?'} vs ${m.awayTeam ?? '?'}`,
    value: `${m.score?.home ?? 0}-${m.score?.away ?? 0}`,
    context: `${m.stage ?? 'match'}${m.group ? ` · Group ${m.group}` : ''}`,
  }))
}

function buildH2HStats(records: H2HRecord[]): AgentResponse['key_stats'] {
  return records.slice(0, 4).map((h) => ({
    label: `${h.team1 ?? '?'} vs ${h.team2 ?? '?'}`,
    value: `${h.totalMatches ?? 0} meetings`,
    context: `${h.team1Wins ?? 0}-${h.draws ?? 0}-${h.team2Wins ?? 0} (W-D-L)`,
  }))
}

/**
 * Build a deterministic analyst response from real MongoDB records when Gemini
 * is unavailable. Ensures partial-env setups (MongoDB only) still surface DB data.
 */
export function generateResponseFromMongoData(
  question: string,
  questionType: QuestionType,
  mongoData: Record<string, unknown>,
  options: { isLiveData?: boolean; dataSource?: string } = {}
): AgentResponse {
  const { isLiveData = true, dataSource = 'MongoDB Atlas' } = options

  if (!hasLiveRecords(mongoData)) {
    return {
      question_type: questionType,
      headline: 'No Matching Records Found in Database',
      answer:
        `MatchMind queried ${dataSource} for your question — "${question}" — but found no matching records. The database was queried live; nothing matched this specific filter.\n\nTry rephrasing your question or asking about teams in Groups A–D, top scorers, or recent match results.`,
      key_stats: [
        {
          label: 'Records Found',
          value: '0',
          context: 'Live MongoDB query returned no matches',
        },
        {
          label: 'Suggestion',
          value: 'Rephrase question',
          context: 'Try broader stats or group-based queries',
        },
      ],
      confidence: 'low',
      follow_up: 'Who are the top scorers in the tournament?',
      data_sources: [dataSource],
      live_data: isLiveData,
    }
  }

  const { key, records } = firstCollectionData(mongoData)
  const sourceLabel = isLiveData
    ? `${dataSource} (${key} collection via MCP tool)`
    : 'Demo dataset'

  if (key === 'players' || records[0]?.goals !== undefined) {
    const players = records as PlayerRecord[]
    const top = players[0]
    const sorted = [...players].sort(
      (a, b) => (b.goals ?? 0) - (a.goals ?? 0)
    )

    return {
      question_type: questionType,
      headline: `${top.name ?? 'Top Player'} Leads Retrieved Player Dataset`,
      answer:
        `Based on live data from ${sourceLabel}, ${sorted[0]?.name ?? 'the top scorer'} leads with ${sorted[0]?.goals ?? 0} goals and ${sorted[0]?.assists ?? 0} assists for ${sorted[0]?.team ?? 'their nation'}. MatchMind retrieved ${players.length} player record(s) directly from MongoDB.\n\n${sorted.slice(1, 3).map((p) => `${p.name} (${p.team}): ${p.goals ?? 0} goals, xG ${p.xG ?? 0}`).join('. ')}${sorted.length > 3 ? '.' : ''}\n\nThis response was generated deterministically from database records because the Gemini API is not configured. Configure GEMINI_API_KEY for full analyst narrative generation.`,
      key_stats: buildPlayerStats(sorted),
      confidence: isLiveData ? 'high' : 'medium',
      follow_up: 'Which players are outperforming their xG?',
      data_sources: [sourceLabel, 'MongoDB player stats'],
    }
  }

  if (key === 'teams' || records[0]?.wins !== undefined) {
    const teams = records as TeamRecord[]
    const leader = [...teams].sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0))[0]

    return {
      question_type: questionType,
      headline: `${leader.name ?? 'Leading Team'} Tops Retrieved Team Standings`,
      answer:
        `MatchMind pulled ${teams.length} team record(s) from ${sourceLabel}. ${leader.name ?? 'The group leader'} currently leads with ${leader.wins ?? 0} wins, ${leader.draws ?? 0} draws, and ${leader.losses ?? 0} losses in Group ${leader.group ?? '—'}, scoring ${leader.goalsFor ?? 0} goals while conceding ${leader.goalsAgainst ?? 0}.\n\nAverage possession across retrieved teams: ${Math.round(teams.reduce((s, t) => s + (t.possession ?? 0), 0) / teams.length)}%. Form strings indicate recent momentum heading into the next fixture.\n\nEnable GEMINI_API_KEY for richer tactical narrative; this summary is built directly from live MongoDB documents.`,
      key_stats: buildTeamStats(teams),
      confidence: isLiveData ? 'high' : 'medium',
      follow_up: `How is ${leader.name ?? 'the leader'} performing tactically?`,
      data_sources: [sourceLabel, 'MongoDB team standings'],
    }
  }

  if (key === 'matches' || records[0]?.homeTeam !== undefined) {
    const matches = records as MatchRecord[]

    return {
      question_type: questionType,
      headline: `${matches.length} Match Records Retrieved From Database`,
      answer:
        `MatchMind queried ${sourceLabel} and found ${matches.length} relevant match(es). The most recent result: ${matches[0]?.homeTeam} ${matches[0]?.score?.home ?? 0}-${matches[0]?.score?.away ?? 0} ${matches[0]?.awayTeam} (${matches[0]?.stage ?? 'fixture'}).\n\nThese results are sourced directly from MongoDB match documents — not generated or hallucinated. Each scoreline, stage, and group assignment traces to a stored record.\n\nConfigure GEMINI_API_KEY for prediction-style narrative; this template summary reflects actual database values.`,
      key_stats: buildMatchStats(matches),
      confidence: isLiveData ? 'high' : 'medium',
      follow_up: 'What were the xG numbers for the most recent match?',
      data_sources: [sourceLabel, 'MongoDB match records'],
    }
  }

  if (key === 'headToHead' || records[0]?.team1 !== undefined) {
    const h2h = records as H2HRecord[]
    const record = h2h[0]

    return {
      question_type: questionType,
      headline: `${record.team1} vs ${record.team2}: ${record.totalMatches ?? 0} Historical Meetings`,
      answer:
        `Head-to-head data from ${sourceLabel} shows ${record.team1} and ${record.team2} have met ${record.totalMatches ?? 0} times. Record: ${record.team1} ${record.team1Wins ?? 0} wins, ${record.draws ?? 0} draws, ${record.team2Wins ?? 0} wins for ${record.team2}.\n\nThis historical context is pulled directly from the headToHead collection in MongoDB. MatchMind surfaces real stored records rather than estimated figures.\n\nEnable GEMINI_API_KEY for deeper historical analysis and narrative context.`,
      key_stats: buildH2HStats(h2h),
      confidence: isLiveData ? 'high' : 'medium',
      follow_up: `What was the result of their most recent meeting?`,
      data_sources: [sourceLabel, 'MongoDB head-to-head records'],
    }
  }

  return {
    question_type: questionType,
    headline: 'Database Query Returned Results',
    answer:
      `MatchMind retrieved ${records.length} record(s) from ${sourceLabel} for your question: "${question}". The data is shown in key stats below. Configure GEMINI_API_KEY for full analyst-grade narrative generation.`,
    key_stats: records.slice(0, 4).map((r, i) => ({
      label: `Record ${i + 1}`,
      value: JSON.stringify(r).slice(0, 40) + '…',
      context: `From ${key} collection`,
    })),
    confidence: isLiveData ? 'medium' : 'low',
    follow_up: 'Can you break down the top performers from this data?',
    data_sources: [sourceLabel],
  }
}

export function isMongoDataEmpty(mongoData: Record<string, unknown>): boolean {
  return !hasLiveRecords(mongoData)
}

export function getRecordCount(mongoData: Record<string, unknown>): number {
  return Object.values(mongoData).reduce<number>((sum, v) => {
    return sum + (Array.isArray(v) ? v.length : 0)
  }, 0)
}