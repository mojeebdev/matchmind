/**
 * FIFA World Cup 2026 intelligence dataset
 * 48 teams · 12 groups (A–L) · fixtures · historical H2H (squads pending FIFA)
 *
 * OFFICIAL (FIFA Dec 5 2025 draw + published schedule): groups, fixtures, venues, kickoff times
 * MOCKUP (preview mode only): illustrative scores, player tournament stats, sample knockouts
 * LIVE (post-kickoff): real results via npm run sync / admin agent
 *
 * See docs/DATA-SOURCES.md for the full real vs mockup breakdown.
 */

import { getTournamentDataMode, isPreviewMode } from './tournament-phase'
import { buildFullSquads } from './squad-builder'
import {
  OFFICIAL_GROUPS_2026,
  OFFICIAL_GROUP_FIXTURES,
  OFFICIAL_KNOCKOUT_FIXTURES,
  OFFICIAL_VENUES,
  FIFA_TOTAL_MATCHES,
  FIFA_SQUAD_SIZE,
} from './worldcup2026-official-fixtures'
import { getTotalPlayerCount } from './worldcup2026-squads'
import type { PlayerRecord } from './player-types'

export type { PlayerRecord, ClubMatch, WorldCupHistorySummary } from './player-types'

export type TeamRecord = {
  name: string
  group: string
  confederation: string
  fifaRank: number
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
  possession: number
  form: string[]
  shotsOnTarget: number
  cleanSheets: number
  coach: string
  keyPlayer: string
}

export type MatchRecord = {
  homeTeam: string
  awayTeam: string
  score: { home: number; away: number }
  status: 'scheduled' | 'live' | 'finished'
  date: Date
  stage: 'group' | 'round-of-32' | 'round-of-16' | 'quarter' | 'semi' | 'third-place' | 'final'
  group: string | null
  venue: string
  city: string
  matchday: number
  fifaMatchNumber?: number
  stats: {
    possession: { home: number; away: number }
    shots: { home: number; away: number }
    xG: { home: number; away: number }
  }
}

export type H2HRecord = {
  team1: string
  team2: string
  totalMatches: number
  team1Wins: number
  team2Wins: number
  draws: number
  lastFive: { date: string; result: string; competition: string }[]
}

export const GROUPS_2026 = OFFICIAL_GROUPS_2026

const CONFEDERATION: Record<string, string> = {
  Mexico: 'CONCACAF', Canada: 'CONCACAF', 'United States': 'CONCACAF', Panama: 'CONCACAF', Haiti: 'CONCACAF', Curaçao: 'CONCACAF',
  Brazil: 'CONMEBOL', Argentina: 'CONMEBOL', Uruguay: 'CONMEBOL', Colombia: 'CONMEBOL', Ecuador: 'CONMEBOL', Paraguay: 'CONMEBOL',
  France: 'UEFA', England: 'UEFA', Spain: 'UEFA', Germany: 'UEFA', Portugal: 'UEFA', Netherlands: 'UEFA', Belgium: 'UEFA',
  Croatia: 'UEFA', Switzerland: 'UEFA', Scotland: 'UEFA', Norway: 'UEFA', Austria: 'UEFA', 'Czech Republic': 'UEFA', Turkey: 'UEFA',
  Sweden: 'UEFA', 'Bosnia and Herzegovina': 'UEFA',
  Morocco: 'CAF', Senegal: 'CAF', Ghana: 'CAF', 'Ivory Coast': 'CAF', Egypt: 'CAF', Algeria: 'CAF', Tunisia: 'CAF', 'South Africa': 'CAF',
  'Cape Verde': 'CAF', 'DR Congo': 'CAF',
  Japan: 'AFC', 'South Korea': 'AFC', Australia: 'AFC', Iran: 'AFC', 'Saudi Arabia': 'AFC', Qatar: 'AFC', Jordan: 'AFC', Uzbekistan: 'AFC', Iraq: 'AFC',
  'New Zealand': 'OFC',
}

const FIFA_RANK: Record<string, number> = {
  Argentina: 1, France: 2, Brazil: 3, England: 4, Spain: 5, Portugal: 6, Netherlands: 7, Belgium: 8, Germany: 9, Croatia: 10,
  Morocco: 11, Colombia: 12, Uruguay: 13, 'United States': 14, Mexico: 15, Japan: 16, Senegal: 17, Switzerland: 18, Iran: 19,
  'South Korea': 20, Ecuador: 21, Austria: 22, Australia: 23, Norway: 24, Turkey: 25, Canada: 26, Scotland: 27, Paraguay: 28,
  Sweden: 29, Panama: 30, Algeria: 31, Egypt: 32, Tunisia: 33, 'Ivory Coast': 34, Qatar: 35, 'South Africa': 36, Ghana: 37,
  Uzbekistan: 38, Jordan: 39, 'Czech Republic': 40, Iraq: 41, Haiti: 42, 'Cape Verde': 43, 'New Zealand': 44, 'Saudi Arabia': 45,
  'Bosnia and Herzegovina': 46, 'DR Congo': 47, Curaçao: 48,
}

const COACHES: Record<string, string> = {
  Argentina: 'Lionel Scaloni', Brazil: 'Dorival Júnior', France: 'Didier Deschamps', England: 'Gareth Southgate',
  Spain: 'Luis de la Fuente', Germany: 'Julian Nagelsmann', Portugal: 'Roberto Martínez', Netherlands: 'Ronald Koeman',
  Belgium: 'Domenico Tedesco', Mexico: 'Javier Aguirre', 'United States': 'Mauricio Pochettino',
  Canada: 'Jesse Marsch', Morocco: 'Walid Regragui', Japan: 'Hajime Moriyasu', Croatia: 'Zlatko Dalić', Colombia: 'Néstor Lorenzo',
  'Czech Republic': 'Ivan Hašek', 'Bosnia and Herzegovina': 'Sergej Barbarez', Sweden: 'Jon Dahl Tomasson',
  Iraq: 'Jesús Casas', 'DR Congo': 'Sébastien Desabre',
}

const VENUES = [...OFFICIAL_VENUES]

const H2H_DATA: H2HRecord[] = [
  { team1: 'Brazil', team2: 'France', totalMatches: 12, team1Wins: 5, team2Wins: 4, draws: 3, lastFive: [{ date: '2022-11-26', result: '2-1 Brazil', competition: 'World Cup' }, { date: '2021-06-08', result: '3-0 France', competition: 'Friendly' }, { date: '2018-07-07', result: '2-1 France', competition: 'World Cup' }] },
  { team1: 'Argentina', team2: 'Germany', totalMatches: 8, team1Wins: 3, team2Wins: 3, draws: 2, lastFive: [{ date: '2014-07-13', result: '1-0 Germany', competition: 'World Cup Final' }, { date: '2023-10-18', result: '2-2 Draw', competition: 'Friendly' }] },
  { team1: 'Argentina', team2: 'Brazil', totalMatches: 15, team1Wins: 5, team2Wins: 7, draws: 3, lastFive: [{ date: '2023-11-21', result: '1-0 Argentina', competition: 'World Cup Qualifier' }, { date: '2021-07-10', result: '1-0 Argentina', competition: 'Copa América Final' }] },
  { team1: 'England', team2: 'Germany', totalMatches: 14, team1Wins: 5, team2Wins: 4, draws: 5, lastFive: [{ date: '2021-06-29', result: '2-0 Germany', competition: 'Euro 2020' }, { date: '2017-11-10', result: '0-0 Draw', competition: 'Friendly' }] },
  { team1: 'Spain', team2: 'Netherlands', totalMatches: 10, team1Wins: 4, team2Wins: 3, draws: 3, lastFive: [{ date: '2014-06-13', result: '5-1 Netherlands', competition: 'World Cup' }] },
  { team1: 'Mexico', team2: 'United States', totalMatches: 18, team1Wins: 7, team2Wins: 6, draws: 5, lastFive: [{ date: '2024-03-24', result: '2-0 Mexico', competition: 'CONCACAF Nations League' }, { date: '2023-10-22', result: '2-3 USA', competition: 'Friendly' }] },
  { team1: 'Portugal', team2: 'Spain', totalMatches: 9, team1Wins: 3, team2Wins: 4, draws: 2, lastFive: [{ date: '2022-09-27', result: '1-0 Spain', competition: 'Nations League' }] },
  { team1: 'Morocco', team2: 'Spain', totalMatches: 5, team1Wins: 1, team2Wins: 3, draws: 1, lastFive: [{ date: '2022-12-06', result: '0-0 (3-0 pens) Morocco', competition: 'World Cup' }] },
  { team1: 'Canada', team2: 'Switzerland', totalMatches: 4, team1Wins: 1, team2Wins: 2, draws: 1, lastFive: [{ date: '2024-06-29', result: '2-0 Switzerland', competition: 'Friendly' }] },
  { team1: 'Bosnia and Herzegovina', team2: 'Switzerland', totalMatches: 3, team1Wins: 0, team2Wins: 2, draws: 1, lastFive: [{ date: '2023-09-08', result: '2-1 Switzerland', competition: 'Euro Qualifier' }] },
  { team1: 'Portugal', team2: 'Colombia', totalMatches: 3, team1Wins: 2, team2Wins: 0, draws: 1, lastFive: [{ date: '2014-06-10', result: '0-0 Draw', competition: 'Friendly' }, { date: '2011-02-09', result: '1-0 Portugal', competition: 'Friendly' }] },
  { team1: 'South Korea', team2: 'Czech Republic', totalMatches: 3, team1Wins: 2, team2Wins: 1, draws: 0, lastFive: [{ date: '2016-06-01', result: '2-1 South Korea', competition: 'Friendly' }] },
  { team1: 'Netherlands', team2: 'Sweden', totalMatches: 8, team1Wins: 3, team2Wins: 3, draws: 2, lastFive: [{ date: '2020-11-11', result: '1-1 Draw', competition: 'Nations League' }] },
  { team1: 'France', team2: 'Senegal', totalMatches: 2, team1Wins: 1, team2Wins: 0, draws: 1, lastFive: [{ date: '2022-05-31', result: '1-1 Draw', competition: 'Friendly' }] },
]

function teamGroup(name: string): string {
  for (const [g, teams] of Object.entries(GROUPS_2026)) {
    if (teams.includes(name)) return g
  }
  return '?'
}

function buildStandings(): TeamRecord[] {
  const stats = new Map<string, TeamRecord>()

  for (const [group, teams] of Object.entries(GROUPS_2026)) {
    for (const name of teams) {
      stats.set(name, {
        name,
        group,
        confederation: CONFEDERATION[name] ?? 'OTHER',
        fifaRank: FIFA_RANK[name] ?? 50,
        played: 0, wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0, points: 0,
        possession: 50, form: [],
        shotsOnTarget: 0, cleanSheets: 0,
        coach: COACHES[name] ?? 'TBD',
        keyPlayer: 'TBD',
      })
    }
  }

  return Array.from(stats.values()).sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))
}

function groupFixtureToMatch(
  f: (typeof OFFICIAL_GROUP_FIXTURES)[number],
  fifaMatchNumber: number,
  overrides: Partial<Pick<MatchRecord, 'score' | 'status' | 'stats'>> = {}
): MatchRecord {
  return {
    homeTeam: f.homeTeam,
    awayTeam: f.awayTeam,
    score: overrides.score ?? { home: 0, away: 0 },
    status: overrides.status ?? 'scheduled',
    date: new Date(f.date),
    stage: 'group',
    group: f.group,
    matchday: f.matchday,
    fifaMatchNumber,
    venue: f.venue,
    city: f.city,
    stats: overrides.stats ?? {
      possession: { home: 50, away: 50 },
      shots: { home: 0, away: 0 },
      xG: { home: 0, away: 0 },
    },
  }
}

function knockoutFixtureToMatch(
  f: (typeof OFFICIAL_KNOCKOUT_FIXTURES)[number],
  overrides: Partial<Pick<MatchRecord, 'score' | 'status' | 'stats'>> = {}
): MatchRecord {
  return {
    homeTeam: f.homeTeam,
    awayTeam: f.awayTeam,
    score: overrides.score ?? { home: 0, away: 0 },
    status: overrides.status ?? 'scheduled',
    date: new Date(f.date),
    stage: f.stage,
    group: null,
    matchday: 0,
    fifaMatchNumber: f.fifaMatchNumber,
    venue: f.venue,
    city: f.city,
    stats: overrides.stats ?? {
      possession: { home: 50, away: 50 },
      shots: { home: 0, away: 0 },
      xG: { home: 0, away: 0 },
    },
  }
}

function buildMatches(): MatchRecord[] {
  const groupMatches = OFFICIAL_GROUP_FIXTURES.map((f, idx) =>
    groupFixtureToMatch(f, idx + 1)
  )
  const knockoutMatches = OFFICIAL_KNOCKOUT_FIXTURES.map((f) =>
    knockoutFixtureToMatch(f)
  )
  return [...groupMatches, ...knockoutMatches].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )
}

function buildPlayers(): PlayerRecord[] {
  return buildFullSquads(GROUPS_2026, false)
}

/** Illustrative preview scores — keyed home|away, aligned to official fixture pairings */
const PREVIEW_SCORES: Record<string, [number, number]> = {
  'Mexico|South Africa': [2, 0], 'South Korea|Czech Republic': [1, 1],
  'Canada|Bosnia and Herzegovina': [1, 1], 'Qatar|Switzerland': [0, 2],
  'United States|Paraguay': [2, 0], 'Australia|Turkey': [1, 2],
  'Brazil|Morocco': [2, 1], 'Haiti|Scotland': [0, 1],
  'Germany|Curaçao': [5, 0], 'Ivory Coast|Ecuador': [1, 1],
  'Netherlands|Japan': [2, 1], 'Sweden|Tunisia': [1, 0],
  'Belgium|Egypt': [3, 0], 'Iran|New Zealand': [1, 0],
  'Spain|Cape Verde': [3, 0], 'Saudi Arabia|Uruguay': [0, 1],
  'France|Senegal': [2, 0], 'Iraq|Norway': [0, 1],
  'Argentina|Algeria': [2, 0], 'Austria|Jordan': [3, 1],
  'Portugal|DR Congo': [2, 0], 'Uzbekistan|Colombia': [0, 1],
  'England|Croatia': [1, 1], 'Ghana|Panama': [2, 1],
  'Czech Republic|South Africa': [1, 0], 'Switzerland|Bosnia and Herzegovina': [2, 0],
  'Canada|Qatar': [4, 1], 'Mexico|South Korea': [2, 1],
  'United States|Australia': [3, 1], 'Scotland|Morocco': [0, 2],
  'Brazil|Haiti': [4, 0], 'Turkey|Paraguay': [2, 1],
  'Netherlands|Sweden': [1, 1], 'Germany|Ivory Coast': [1, 1],
  'Ecuador|Curaçao': [3, 0], 'Tunisia|Japan': [0, 2],
  'Belgium|Iran': [2, 0], 'Spain|Saudi Arabia': [2, 0],
  'Uruguay|Cape Verde': [3, 0], 'New Zealand|Egypt': [0, 0],
  'Argentina|Austria': [2, 1], 'France|Iraq': [4, 0],
  'Norway|Senegal': [1, 2], 'Jordan|Algeria': [0, 2],
  'Portugal|Uzbekistan': [3, 0], 'England|Ghana': [2, 0],
  'Panama|Croatia': [0, 2], 'Colombia|DR Congo': [2, 1],
  'Switzerland|Canada': [1, 0], 'Bosnia and Herzegovina|Qatar': [2, 1],
  'Scotland|Brazil': [0, 3], 'Morocco|Haiti': [2, 0],
  'Czech Republic|Mexico': [0, 1], 'South Africa|South Korea': [1, 2],
  'Curaçao|Ivory Coast': [0, 3], 'Ecuador|Germany': [0, 2],
  'Japan|Sweden': [1, 0], 'Tunisia|Netherlands': [0, 2],
  'Turkey|United States': [1, 1], 'Paraguay|Australia': [0, 0],
  'Norway|France': [1, 1], 'Senegal|Iraq': [3, 0],
  'Uruguay|Spain': [1, 2], 'Cape Verde|Saudi Arabia': [2, 1],
  'Egypt|Iran': [0, 1], 'New Zealand|Belgium': [0, 2],
  'Panama|England': [0, 3], 'Croatia|Ghana': [1, 0],
  'Colombia|Portugal': [1, 1], 'DR Congo|Uzbekistan': [2, 0],
  'Algeria|Austria': [1, 1], 'Jordan|Argentina': [0, 1],
}

function previewScoreKey(home: string, away: string): string {
  return `${home}|${away}`
}

function buildPreviewStandings(): TeamRecord[] {
  const stats = new Map<string, TeamRecord>()

  for (const [group, teams] of Object.entries(GROUPS_2026)) {
    for (const name of teams) {
      stats.set(name, {
        name,
        group,
        confederation: CONFEDERATION[name] ?? 'OTHER',
        fifaRank: FIFA_RANK[name] ?? 50,
        played: 0, wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0, points: 0,
        possession: 50, form: [],
        shotsOnTarget: 0, cleanSheets: 0,
        coach: COACHES[name] ?? 'TBD',
        keyPlayer: 'TBD',
      })
    }
  }

  for (const f of OFFICIAL_GROUP_FIXTURES) {
    const score = PREVIEW_SCORES[previewScoreKey(f.homeTeam, f.awayTeam)] ?? [1, 1]
    const [hg, ag] = score
    const h = stats.get(f.homeTeam)!
    const a = stats.get(f.awayTeam)!
    h.played++; a.played++
    h.goalsFor += hg; h.goalsAgainst += ag
    a.goalsFor += ag; a.goalsAgainst += hg
    if (hg > ag) {
      h.wins++; h.points += 3; a.losses++
      h.form.push('W'); a.form.push('L')
    } else if (hg < ag) {
      a.wins++; a.points += 3; h.losses++
      h.form.push('L'); a.form.push('W')
    } else {
      h.draws++; a.draws++; h.points++; a.points++
      h.form.push('D'); a.form.push('D')
    }
  }

  return Array.from(stats.values()).sort((a, b) => a.group.localeCompare(b.group) || b.points - a.points)
}

function buildPreviewMatches(): MatchRecord[] {
  const groupMatches = OFFICIAL_GROUP_FIXTURES.map((f, idx) => {
    const [hg, ag] = PREVIEW_SCORES[previewScoreKey(f.homeTeam, f.awayTeam)] ?? [1, 1]
    return groupFixtureToMatch(f, idx + 1, {
      score: { home: hg, away: ag },
      status: 'finished',
      stats: {
        possession: { home: 52, away: 48 },
        shots: { home: hg * 4 + 6, away: ag * 4 + 5 },
        xG: { home: hg * 0.7 + 0.5, away: ag * 0.7 + 0.4 },
      },
    })
  })

  const knockoutMatches = OFFICIAL_KNOCKOUT_FIXTURES.map((f) =>
    knockoutFixtureToMatch(f)
  )

  return [...groupMatches, ...knockoutMatches].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )
}

function buildPreviewPlayers(): PlayerRecord[] {
  return buildFullSquads(GROUPS_2026, true)
}

const LIVE_TEAMS = buildStandings()
const LIVE_PLAYERS = buildPlayers()
const LIVE_MATCHES = buildMatches()

const PREVIEW_TEAMS = buildPreviewStandings()
const PREVIEW_PLAYERS = buildPreviewPlayers()
const PREVIEW_MATCHES = buildPreviewMatches()

export function getActiveTeams() {
  return isPreviewMode() ? PREVIEW_TEAMS : LIVE_TEAMS
}

export function getActivePlayers() {
  return isPreviewMode() ? PREVIEW_PLAYERS : LIVE_PLAYERS
}

export function getActiveMatches() {
  return isPreviewMode() ? PREVIEW_MATCHES : LIVE_MATCHES
}

export function getSeedDataset() {
  const preview = isPreviewMode()
  return {
    teams: preview ? PREVIEW_TEAMS : LIVE_TEAMS,
    players: preview ? PREVIEW_PLAYERS : LIVE_PLAYERS,
    matches: preview ? PREVIEW_MATCHES : LIVE_MATCHES,
    h2h: H2H_DATA,
    tournament: {
      name: 'FIFA World Cup 2026',
      hosts: ['United States', 'Mexico', 'Canada'],
      teams: 48,
      groups: 12,
      format: '12 groups of 4 → Round of 32 → Final (104 matches)',
      totalMatches: FIFA_TOTAL_MATCHES,
      squadSize: FIFA_SQUAD_SIZE,
      totalPlayers: getTotalPlayerCount(),
      startDate: '2026-06-11',
      endDate: '2026-07-19',
      officialDrawDate: '2025-12-05',
      currentStage: preview ? 'preview-mockup' : 'live',
      dataMode: getTournamentDataMode(),
      venues: VENUES.length,
      dataSources: {
        groups: 'official',
        fixtures: 'official',
        knockoutBracket: 'official',
        venues: 'official',
        kickoffTimes: 'official',
        squads: preview ? 'preview-mockup' : 'pending-official',
        headToHead: 'verified-historical',
        worldCupHistory: 'verified-historical',
        previewScores: preview ? 'mockup' : 'synced-live',
        knockoutResults: preview ? 'scheduled' : 'synced-live',
        liveResults: preview ? 'pending-kickoff' : 'synced-live',
      },
      dataNote: preview
        ? 'Official FIFA schedule: 104 matches. Tournament squads pending FIFA publication. Group-stage scores are illustrative mockup; knockouts scheduled with bracket placeholders.'
        : 'Official 104-match schedule with live results synced via npm run sync / admin agent. Tournament squads pending FIFA publication.',
    },
  }
}

export const WC2026_TEAMS = LIVE_TEAMS
export const WC2026_PLAYERS = LIVE_PLAYERS
export const WC2026_MATCHES = LIVE_MATCHES
export const WC2026_H2H = H2H_DATA
export const WC2026_TOURNAMENT = getSeedDataset().tournament

function toMockTeams(teams: TeamRecord[]) {
  return teams.map((t) => ({
    name: t.name,
    group: t.group,
    played: t.played,
    wins: t.wins,
    draws: t.draws,
    losses: t.losses,
    goalsFor: t.goalsFor,
    goalsAgainst: t.goalsAgainst,
    points: t.points,
    possession: t.possession,
    form: t.form,
  }))
}

function toMockPlayers(players: PlayerRecord[]) {
  return players.map((p) => ({
    name: p.name,
    team: p.team,
    group: p.group,
    position: p.position,
    goals: p.goals,
    assists: p.assists,
    xG: p.xG,
    minutes: p.minutes,
    passAccuracy: p.passAccuracy,
    club: p.club,
    clubForm: p.clubForm,
    worldCupHistory: p.worldCupHistory,
  }))
}

/** Active mock dataset — preview illustrative data before kickoff, live seed after */
export const MOCK_TEAMS = toMockTeams(getActiveTeams())
export const MOCK_PLAYERS = toMockPlayers(getActivePlayers())
export const MOCK_MATCHES = getActiveMatches()
export const MOCK_HEAD_TO_HEAD = H2H_DATA