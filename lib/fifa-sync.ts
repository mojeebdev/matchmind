/**
 * FIFA World Cup 2026 scores & fixtures — unofficial read via api.fifa.com v3.
 * Source page: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures
 */

export const FIFA_SCORES_PAGE_URL =
  'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures?country=&wtw-filter=ALL'

export const FIFA_SEASON_ID = process.env.FIFA_SEASON_ID ?? '285023'

const FIFA_MATCHES_API = 'https://api.fifa.com/api/v3/calendar/matches'

/** FIFA ShortClubName → MatchMind MongoDB team name */
export const FIFA_TEAM_NAME_MAP: Record<string, string> = {
  'Korea Republic': 'South Korea',
  Czechia: 'Czech Republic',
  'Cabo Verde': 'Cape Verde',
  'Congo DR': 'DR Congo',
  "Côte d'Ivoire": 'Ivory Coast',
  "Cote d'Ivoire": 'Ivory Coast',
  Curaçao: 'Curaçao',
  Curacao: 'Curaçao',
  'IR Iran': 'Iran',
  Türkiye: 'Turkey',
  USA: 'United States',
}

export type FifaSyncMatchUpdate = {
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: 'scheduled' | 'live' | 'finished'
  fifaMatchId?: string
  date?: string
}

type FifaApiMatch = {
  IdMatch?: string
  Date?: string
  LocalDate?: string
  MatchStatus?: number
  MatchTime?: string | null
  HomeTeamScore?: number | null
  AwayTeamScore?: number | null
  Home?: { ShortClubName?: string; Score?: number | null }
  Away?: { ShortClubName?: string; Score?: number | null }
}

type FifaApiResponse = {
  Results?: FifaApiMatch[]
}

function mapFifaTeam(name: string | undefined): string | null {
  if (!name?.trim()) return null
  const trimmed = name.trim()
  return FIFA_TEAM_NAME_MAP[trimmed] ?? trimmed
}

function readScore(
  primary: number | null | undefined,
  fallback: number | null | undefined
): number | null {
  if (typeof primary === 'number' && primary >= 0) return primary
  if (typeof fallback === 'number' && fallback >= 0) return fallback
  return null
}

function inferMatchStatus(match: FifaApiMatch): 'scheduled' | 'live' | 'finished' {
  const homeScore = readScore(match.HomeTeamScore, match.Home?.Score)
  const awayScore = readScore(match.AwayTeamScore, match.Away?.Score)

  if (homeScore === null || awayScore === null) {
    const clock = match.MatchTime?.trim()
    if (clock && clock !== "0'" && !/^0\+/.test(clock)) return 'live'
    return 'scheduled'
  }

  return 'finished'
}

function buildFifaMatchesUrl(): string {
  const from = process.env.FIFA_SYNC_FROM ?? '2026-06-11T00:00:00Z'
  const to = process.env.FIFA_SYNC_TO ?? '2026-07-19T23:59:59Z'
  const count = process.env.FIFA_SYNC_COUNT ?? '500'
  const seasonId = FIFA_SEASON_ID
  const params = new URLSearchParams({
    from,
    to,
    language: 'en',
    count,
    idSeason: seasonId,
  })
  return `${FIFA_MATCHES_API}?${params.toString()}`
}

export async function fetchFifaFixtureUpdates(options?: {
  includeScheduled?: boolean
  includeLive?: boolean
}): Promise<{
  matches: FifaSyncMatchUpdate[]
  meta: {
    source: string
    seasonId: string
    scoresPageUrl: string
    fetched: number
    finished: number
    live: number
    scheduled: number
    skippedUnmapped: number
  }
}> {
  const includeScheduled = options?.includeScheduled ?? false
  const includeLive = options?.includeLive ?? true

  const url = buildFifaMatchesUrl()
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Origin: 'https://www.fifa.com',
      Referer: FIFA_SCORES_PAGE_URL,
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`FIFA API ${res.status}: ${await res.text().catch(() => res.statusText)}`)
  }

  const data = (await res.json()) as FifaApiResponse
  const results = data.Results ?? []

  const matches: FifaSyncMatchUpdate[] = []
  let skippedUnmapped = 0
  let finished = 0
  let live = 0
  let scheduled = 0

  for (const row of results) {
    const homeTeam = mapFifaTeam(row.Home?.ShortClubName)
    const awayTeam = mapFifaTeam(row.Away?.ShortClubName)
    if (!homeTeam || !awayTeam) {
      skippedUnmapped++
      continue
    }

    const status = inferMatchStatus(row)
    if (status === 'finished') finished++
    else if (status === 'live') live++
    else scheduled++

    const homeScore = readScore(row.HomeTeamScore, row.Home?.Score)
    const awayScore = readScore(row.AwayTeamScore, row.Away?.Score)

    if (status === 'scheduled' && !includeScheduled) continue
    if (status === 'live' && !includeLive) continue
    if (status !== 'scheduled' && (homeScore === null || awayScore === null)) continue

    matches.push({
      homeTeam,
      awayTeam,
      homeScore: homeScore ?? 0,
      awayScore: awayScore ?? 0,
      status,
      fifaMatchId: row.IdMatch,
      date: row.Date ?? row.LocalDate,
    })
  }

  return {
    matches,
    meta: {
      source: 'fifa.com/api/v3/calendar/matches',
      seasonId: FIFA_SEASON_ID,
      scoresPageUrl: FIFA_SCORES_PAGE_URL,
      fetched: results.length,
      finished,
      live,
      scheduled,
      skippedUnmapped,
    },
  }
}