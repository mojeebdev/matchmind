import type { AgentResponse, QuestionType } from './types'
import type { PlayerRecord } from './player-types'

type LegacyPlayerRecord = Partial<PlayerRecord>

type TeamRecord = {
  name?: string
  group?: string
  played?: number
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
  status?: string
  stage?: string
  group?: string | null
  matchday?: number
  date?: string | Date
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

function buildPlayerStats(players: LegacyPlayerRecord[]): AgentResponse['key_stats'] {
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
  return matches.slice(0, 4).map((m) => {
    const scheduled = m.status === 'scheduled'
    return {
      label: `${m.homeTeam ?? '?'} vs ${m.awayTeam ?? '?'}`,
      value: scheduled ? 'Scheduled' : `${m.score?.home ?? 0}-${m.score?.away ?? 0}`,
      context: `${m.stage ?? 'match'}${m.group ? ` · Group ${m.group}` : ''}${m.matchday ? ` · MD${m.matchday}` : ''}`,
    }
  })
}

function isPreTournamentPlayers(players: LegacyPlayerRecord[]): boolean {
  return players.length > 0 && players.every((p) => (p.goals ?? 0) === 0 && (p.assists ?? 0) === 0)
}

function isPreTournamentTeams(teams: TeamRecord[]): boolean {
  return teams.length > 0 && teams.every((t) => (t.played ?? 0) === 0)
}

function isPreTournamentMatches(matches: MatchRecord[]): boolean {
  return (
    matches.length > 0 &&
    matches.every((m) => (m.status ?? 'scheduled') !== 'finished')
  )
}

const PRE_TOURNAMENT_NOTE =
  'The FIFA World Cup 2026 has not kicked off yet (opening fixtures: 11 June 2026). No competitive match results or player goal totals exist in MongoDB until matches are played and synced.'

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
    const players = records as LegacyPlayerRecord[]
    const sorted = [...players].sort(
      (a, b) => (b.goals ?? 0) - (a.goals ?? 0)
    )

    if (players.length === 1 && players[0]?.clubForm) {
      const p = players[0]
      const clubMatches = (p.recentClubMatches ?? [])
        .slice(0, 3)
        .map((m) => `${m.opponent} (${m.result}, ${m.goals}G/${m.assists}A)`)
        .join(' · ')
      const wc = p.worldCupHistory
      const wcLine = wc
        ? `World Cup history: ${wc.totalGoals} goals in ${wc.tournamentsPlayed} tournaments — ${wc.summary}`
        : 'No previous World Cup appearances on record — 2026 would be or is their debut.'

      return {
        question_type: questionType,
        headline: `${p.name}: ${p.team} (#${p.squadNumber ?? '—'}) — Club & International Profile`,
        answer:
          `MatchMind pulled a full player profile from ${sourceLabel}.\n\n${p.name} (${p.age ?? '—'} y/o, ${p.position ?? '—'}) plays for ${p.club ?? '—'} and represents ${p.team ?? '—'} in Group ${p.group ?? '—'}.\n\n2026 tournament (this dataset): ${p.goals ?? 0} goals, ${p.assists ?? 0} assists, ${p.minutes ?? 0} minutes.\n\nClub form (${p.clubForm!.lastFive.join('-')}): ${p.clubForm!.seasonGoals} goals and ${p.clubForm!.seasonAssists} assists this season, ${p.clubForm!.avgRating.toFixed(1)} avg rating.\n\nRecent club matches: ${clubMatches || '—'}\n\n${wcLine}`,
        key_stats: [
          { label: 'Club season', value: `${p.clubForm!.seasonGoals}G / ${p.clubForm!.seasonAssists}A`, context: `${p.club ?? 'Club'} · form ${p.clubForm!.lastFive.join('')}` },
          { label: '2026 tournament', value: `${p.goals ?? 0}G / ${p.assists ?? 0}A`, context: `${p.team ?? 'Nation'} · xG ${p.xG ?? 0}` },
          {
            label: 'World Cup career',
            value: wc ? `${wc.totalGoals} goals` : 'WC debut',
            context: wc ? `${wc.tournamentsPlayed} tournaments` : 'No prior WC apps',
          },
        ],
        confidence: 'high',
        follow_up: wc
          ? `How does ${p.name}'s World Cup record compare to all-time greats?`
          : `How has ${p.name} performed for ${p.team} in the group stage?`,
        data_sources: [sourceLabel, 'players collection', 'club form + worldCupHistory'],
        live_data: isLiveData,
      }
    }

    if (isPreTournamentPlayers(players)) {
      const sample = sorted.slice(0, 3)
      return {
        question_type: questionType,
        headline: 'No Tournament Goals Recorded Yet',
        answer:
          `${PRE_TOURNAMENT_NOTE}\n\nMatchMind queried ${sourceLabel} and found ${players.length} squad player(s). Every player currently has 0 goals and 0 assists — there is no Golden Boot leader yet.\n\nNotable squad names on file include ${sample.map((p) => `${p.name} (${p.team})`).join(', ')}. Tournament stats will populate after matches finish and results are synced via \`npm run sync\` or the admin agent.`,
        key_stats: sample.map((p) => ({
          label: p.name ?? 'Player',
          value: '0G / 0A',
          context: `${p.team ?? 'Unknown'} · ${p.position ?? '—'} · awaiting kickoff`,
        })),
        confidence: isLiveData ? 'high' : 'medium',
        follow_up: 'When does the tournament open and which teams are in Group A?',
        data_sources: [sourceLabel, 'MongoDB squad registry'],
        live_data: isLiveData,
      }
    }

    const top = sorted[0]
    return {
      question_type: questionType,
      headline: `${top.name ?? 'Top Player'} Leads Retrieved Player Dataset`,
      answer:
        `Based on live data from ${sourceLabel}, ${top.name ?? 'the top scorer'} leads with ${top.goals ?? 0} goals and ${top.assists ?? 0} assists for ${top.team ?? 'their nation'}. MatchMind retrieved ${players.length} player record(s) directly from MongoDB.\n\n${sorted.slice(1, 3).map((p) => `${p.name} (${p.team}): ${p.goals ?? 0} goals, xG ${p.xG ?? 0}`).join('. ')}${sorted.length > 3 ? '.' : ''}\n\nThis response was generated deterministically from database records because the Gemini API is not configured. Configure GEMINI_API_KEY for full analyst narrative generation.`,
      key_stats: buildPlayerStats(sorted),
      confidence: isLiveData ? 'high' : 'medium',
      follow_up: 'Which players are outperforming their xG?',
      data_sources: [sourceLabel, 'MongoDB player stats'],
    }
  }

  if (key === 'teams' || records[0]?.wins !== undefined) {
    const teams = records as TeamRecord[]

    if (isPreTournamentTeams(teams)) {
      const sample = teams.slice(0, 4)
      return {
        question_type: questionType,
        headline: 'Group Standings Not Started Yet',
        answer:
          `${PRE_TOURNAMENT_NOTE}\n\nMatchMind pulled ${teams.length} team record(s) from ${sourceLabel}. All teams show 0 played, 0 points, and 0 goals — standings will update only after group-stage matches are completed and synced.\n\nTeams on file: ${sample.map((t) => `${t.name} (Group ${t.group})`).join(', ')}${teams.length > 4 ? ', and others' : ''}.`,
        key_stats: sample.map((t) => ({
          label: t.name ?? 'Team',
          value: `Group ${t.group ?? '—'}`,
          context: '0 played · 0 pts · awaiting kickoff',
        })),
        confidence: isLiveData ? 'high' : 'medium',
        follow_up: 'Show me the Group A opening fixtures',
        data_sources: [sourceLabel, 'MongoDB team registry'],
        live_data: isLiveData,
      }
    }

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

    if (isPreTournamentMatches(matches)) {
      const next = matches[0]
      return {
        question_type: questionType,
        headline: `${matches.length} Upcoming Fixtures On File`,
        answer:
          `${PRE_TOURNAMENT_NOTE}\n\nMatchMind queried ${sourceLabel} and found ${matches.length} scheduled fixture(s) — no finished results yet. Next listed fixture: ${next?.homeTeam} vs ${next?.awayTeam}${next?.group ? ` (Group ${next.group}` : ''}${next?.matchday ? `, Matchday ${next.matchday})` : next?.group ? ')' : ''}.\n\nScores will appear in MongoDB only after real matches are played and synced.`,
        key_stats: buildMatchStats(matches),
        confidence: isLiveData ? 'high' : 'medium',
        follow_up: 'Which teams are in Group I?',
        data_sources: [sourceLabel, 'MongoDB match fixtures'],
        live_data: isLiveData,
      }
    }

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

  if (key === 'playerWorldCupCareers' || records[0]?.totalGoals !== undefined && records[0]?.careerSummary !== undefined) {
    const careers = records as Array<{
      name?: string
      nationality?: string
      totalGoals?: number
      totalAppearances?: number
      tournamentsPlayed?: number
      worldCupTitles?: number
      careerSummary?: string
      appearances?: Array<{ year: number; goals: number; stageReached: string }>
    }>
    const player = careers[0]
    const breakdown = (player.appearances ?? [])
      .map((a) => `${a.year}: ${a.goals} goals (${a.stageReached})`)
      .join(' · ')

    return {
      question_type: questionType,
      headline: `${player.name ?? 'Player'}: ${player.totalGoals ?? 0} World Cup Goals Across ${player.tournamentsPlayed ?? 0} Tournaments`,
      answer:
        `MatchMind pulled verified career data from the playerWorldCupCareers collection in ${sourceLabel}.\n\n${player.careerSummary ?? ''}\n\nCareer totals: ${player.totalGoals ?? 0} goals in ${player.totalAppearances ?? 0} appearances for ${player.nationality ?? 'their nation'}. World Cup titles: ${player.worldCupTitles ?? 0}.\n\nTournament breakdown: ${breakdown || 'No appearances on record.'}\n\nThis is factual historical data (1930–2022) — separate from 2026 preview mockup stats in the players collection.`,
      key_stats: careers.slice(0, 4).map((c) => ({
        label: c.name ?? 'Player',
        value: `${c.totalGoals ?? 0} WC goals`,
        context: `${c.tournamentsPlayed ?? 0} tournaments · ${c.totalAppearances ?? 0} apps`,
      })),
      confidence: 'high',
      follow_up: `How does ${player.name ?? 'this player'} compare to the all-time World Cup scoring records?`,
      data_sources: [sourceLabel, 'playerWorldCupCareers collection', 'FIFA historical archives'],
      live_data: true,
    }
  }

  if (key === 'worldCupEditions' || records[0]?.winner !== undefined && records[0]?.year !== undefined) {
    const editions = records as Array<{
      year?: number
      host?: string
      winner?: string
      runnerUp?: string
      scoreline?: string
      goldenBoot?: { player: string; goals: number }
      highlight?: string
    }>
    const edition = editions[0]
    return {
      question_type: questionType,
      headline: `${edition.year ?? ''} World Cup: ${edition.winner ?? '?'} Beat ${edition.runnerUp ?? '?'}`,
      answer:
        `Historical edition data from ${sourceLabel}: ${edition.year} in ${edition.host}. Final: ${edition.winner} ${edition.scoreline ?? ''} ${edition.runnerUp}. Golden Boot: ${edition.goldenBoot?.player ?? '—'} (${edition.goldenBoot?.goals ?? 0} goals).\n\n${edition.highlight ?? ''}`,
      key_stats: editions.slice(0, 4).map((e) => ({
        label: `${e.year ?? ''} ${e.host ?? ''}`,
        value: e.winner ?? '—',
        context: e.highlight?.slice(0, 60) ?? '',
      })),
      confidence: 'high',
      follow_up: 'Who holds the all-time World Cup scoring record?',
      data_sources: [sourceLabel, 'worldCupEditions collection'],
      live_data: true,
    }
  }

  if (key === 'worldCupRecords' || records[0]?.category !== undefined && records[0]?.holder !== undefined) {
    const recs = records as Array<{
      category?: string
      rank?: number
      holder?: string
      value?: string
      context?: string
    }>
    const top = recs[0]
    return {
      question_type: questionType,
      headline: `World Cup Record: ${top.category ?? 'All-time'}`,
      answer:
        `All-time records from ${sourceLabel}: #${top.rank ?? 1} — ${top.holder} (${top.value ?? ''}). ${top.context ?? ''}\n\n${recs.slice(1, 4).map((r) => `#${r.rank} ${r.holder}: ${r.value}`).join('. ')}`,
      key_stats: recs.slice(0, 4).map((r) => ({
        label: `#${r.rank ?? '?'} ${r.holder ?? ''}`,
        value: r.value ?? '—',
        context: r.category ?? '',
      })),
      confidence: 'high',
      follow_up: 'How many World Cup goals has Cristiano Ronaldo scored in his career?',
      data_sources: [sourceLabel, 'worldCupRecords collection'],
      live_data: true,
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