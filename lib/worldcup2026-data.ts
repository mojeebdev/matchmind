/**
 * FIFA World Cup 2026 intelligence dataset
 * 48 teams · 12 groups (A–L) · squads · fixtures · historical H2H
 * Preview mode (before kickoff): illustrative mockup stats — clearly labeled in UI
 * Live mode (after kickoff): real results via npm run sync / admin agent
 */

import { getTournamentDataMode, isPreviewMode } from './tournament-phase'

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

export type PlayerRecord = {
  name: string
  team: string
  group: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
  goals: number
  assists: number
  xG: number
  minutes: number
  passAccuracy: number
  age: number
  club: string
}

export type MatchRecord = {
  homeTeam: string
  awayTeam: string
  score: { home: number; away: number }
  status: 'scheduled' | 'live' | 'finished'
  date: Date
  stage: 'group' | 'round-of-32' | 'round-of-16' | 'quarter' | 'semi' | 'final'
  group: string | null
  venue: string
  city: string
  matchday: number
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

export const GROUPS_2026: Record<string, string[]> = {
  A: ['Mexico', 'South Africa', 'South Korea', 'Denmark'],
  B: ['Canada', 'Switzerland', 'Qatar', 'Italy'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['United States', 'Paraguay', 'Australia', 'Turkey'],
  E: ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Ukraine', 'Tunisia'],
  G: ['Belgium', 'Iran', 'New Zealand', 'Egypt'],
  H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Bolivia', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'Uzbekistan', 'Colombia', 'Czech Republic'],
  L: ['England', 'Ghana', 'Panama', 'Croatia'],
}

const CONFEDERATION: Record<string, string> = {
  Mexico: 'CONCACAF', Canada: 'CONCACAF', 'United States': 'CONCACAF', Panama: 'CONCACAF', Haiti: 'CONCACAF', Curaçao: 'CONCACAF',
  Brazil: 'CONMEBOL', Argentina: 'CONMEBOL', Uruguay: 'CONMEBOL', Colombia: 'CONMEBOL', Ecuador: 'CONMEBOL', Paraguay: 'CONMEBOL', Bolivia: 'CONMEBOL',
  France: 'UEFA', England: 'UEFA', Spain: 'UEFA', Germany: 'UEFA', Portugal: 'UEFA', Netherlands: 'UEFA', Belgium: 'UEFA', Italy: 'UEFA',
  Croatia: 'UEFA', Switzerland: 'UEFA', Denmark: 'UEFA', Scotland: 'UEFA', Norway: 'UEFA', Austria: 'UEFA', 'Czech Republic': 'UEFA', Turkey: 'UEFA', Ukraine: 'UEFA',
  Morocco: 'CAF', Senegal: 'CAF', Ghana: 'CAF', 'Ivory Coast': 'CAF', Egypt: 'CAF', Algeria: 'CAF', Tunisia: 'CAF', 'South Africa': 'CAF', 'Cape Verde': 'CAF',
  Japan: 'AFC', 'South Korea': 'AFC', Australia: 'AFC', Iran: 'AFC', 'Saudi Arabia': 'AFC', Qatar: 'AFC', Jordan: 'AFC', Uzbekistan: 'AFC',
  'New Zealand': 'OFC',
}

const FIFA_RANK: Record<string, number> = {
  Argentina: 1, France: 2, Brazil: 3, England: 4, Spain: 5, Portugal: 6, Netherlands: 7, Belgium: 8, Germany: 9, Italy: 10,
  Croatia: 11, Morocco: 12, Colombia: 13, Uruguay: 14, Mexico: 15, 'United States': 16, Japan: 17, Senegal: 18, Switzerland: 19,
  Iran: 20, Denmark: 21, 'South Korea': 22, Ecuador: 23, Austria: 24, Turkey: 25, Canada: 26, Norway: 27, Australia: 28, Scotland: 29,
  Algeria: 30, Paraguay: 31, 'Czech Republic': 32, Egypt: 33, Tunisia: 34, 'Ivory Coast': 35, Qatar: 36, 'South Africa': 37, Ghana: 38,
  Panama: 39, Uzbekistan: 40, Jordan: 41, Bolivia: 42, Haiti: 43, 'Cape Verde': 44, 'New Zealand': 45, 'Saudi Arabia': 46, Ukraine: 47, Curaçao: 48,
}

const COACHES: Record<string, string> = {
  Argentina: 'Lionel Scaloni', Brazil: 'Dorival Júnior', France: 'Didier Deschamps', England: 'Gareth Southgate',
  Spain: 'Luis de la Fuente', Germany: 'Julian Nagelsmann', Portugal: 'Roberto Martínez', Netherlands: 'Ronald Koeman',
  Belgium: 'Domenico Tedesco', Italy: 'Luciano Spalletti', Mexico: 'Javier Aguirre', 'United States': 'Mauricio Pochettino',
  Canada: 'Jesse Marsch', Morocco: 'Walid Regragui', Japan: 'Hajime Moriyasu', Croatia: 'Zlatko Dalić', Colombia: 'Néstor Lorenzo',
}

const VENUES = [
  { venue: 'MetLife Stadium', city: 'New York/New Jersey' },
  { venue: 'SoFi Stadium', city: 'Los Angeles' },
  { venue: 'AT&T Stadium', city: 'Dallas' },
  { venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { venue: 'Hard Rock Stadium', city: 'Miami' },
  { venue: 'Estadio Azteca', city: 'Mexico City' },
  { venue: 'Estadio Akron', city: 'Guadalajara' },
  { venue: 'BC Place', city: 'Vancouver' },
  { venue: 'BMO Field', city: 'Toronto' },
  { venue: 'Lincoln Financial Field', city: 'Philadelphia' },
]

const SQUAD_PLAYERS: Omit<PlayerRecord, 'group'>[] = [
  { name: 'Lionel Messi', team: 'Argentina', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 87, age: 38, club: 'Inter Miami' },
  { name: 'Lautaro Martínez', team: 'Argentina', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 74, age: 28, club: 'Inter Milan' },
  { name: 'Emiliano Martínez', team: 'Argentina', position: 'GK', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 81, age: 32, club: 'Aston Villa' },
  { name: 'Rodrigo De Paul', team: 'Argentina', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 89, age: 30, club: 'Atlético Madrid' },
  { name: 'Vinícius Jr.', team: 'Brazil', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 80, age: 25, club: 'Real Madrid' },
  { name: 'Rodrygo', team: 'Brazil', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 82, age: 24, club: 'Real Madrid' },
  { name: 'Raphinha', team: 'Brazil', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 79, age: 28, club: 'Barcelona' },
  { name: 'Alisson', team: 'Brazil', position: 'GK', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 85, age: 32, club: 'Liverpool' },
  { name: 'Kylian Mbappé', team: 'France', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 81, age: 27, club: 'Real Madrid' },
  { name: 'Antoine Griezmann', team: 'France', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 88, age: 34, club: 'Atlético Madrid' },
  { name: 'Ousmane Dembélé', team: 'France', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 76, age: 27, club: 'PSG' },
  { name: 'William Saliba', team: 'France', position: 'DF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 91, age: 24, club: 'Arsenal' },
  { name: 'Harry Kane', team: 'England', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 77, age: 32, club: 'Bayern Munich' },
  { name: 'Bukayo Saka', team: 'England', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 83, age: 24, club: 'Arsenal' },
  { name: 'Jude Bellingham', team: 'England', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 86, age: 22, club: 'Real Madrid' },
  { name: 'Declan Rice', team: 'England', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 90, age: 26, club: 'Arsenal' },
  { name: 'Lamine Yamal', team: 'Spain', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 84, age: 18, club: 'Barcelona' },
  { name: 'Pedri', team: 'Spain', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 92, age: 22, club: 'Barcelona' },
  { name: 'Rodri', team: 'Spain', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 94, age: 28, club: 'Manchester City' },
  { name: 'Jamal Musiala', team: 'Germany', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 86, age: 22, club: 'Bayern Munich' },
  { name: 'Florian Wirtz', team: 'Germany', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 85, age: 22, club: 'Bayer Leverkusen' },
  { name: 'Joshua Kimmich', team: 'Germany', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 91, age: 30, club: 'Bayern Munich' },
  { name: 'Cristiano Ronaldo', team: 'Portugal', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 78, age: 40, club: 'Al Nassr' },
  { name: 'Bruno Fernandes', team: 'Portugal', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 84, age: 30, club: 'Manchester United' },
  { name: 'Rafael Leão', team: 'Portugal', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 77, age: 25, club: 'AC Milan' },
  { name: 'Virgil van Dijk', team: 'Netherlands', position: 'DF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 90, age: 33, club: 'Liverpool' },
  { name: 'Memphis Depay', team: 'Netherlands', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 76, age: 30, club: 'Corinthians' },
  { name: 'Frenkie de Jong', team: 'Netherlands', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 93, age: 27, club: 'Barcelona' },
  { name: 'Kevin De Bruyne', team: 'Belgium', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 88, age: 33, club: 'Manchester City' },
  { name: 'Romelu Lukaku', team: 'Belgium', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 72, age: 31, club: 'Roma' },
  { name: 'Achraf Hakimi', team: 'Morocco', position: 'DF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 84, age: 26, club: 'PSG' },
  { name: 'Sofyan Amrabat', team: 'Morocco', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 87, age: 28, club: 'Manchester United' },
  { name: 'Christian Pulisic', team: 'United States', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 80, age: 26, club: 'AC Milan' },
  { name: 'Tyler Adams', team: 'United States', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 85, age: 25, club: 'Bournemouth' },
  { name: 'Alphonso Davies', team: 'Canada', position: 'DF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 82, age: 24, club: 'Bayern Munich' },
  { name: 'Jonathan David', team: 'Canada', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 75, age: 25, club: 'Lille' },
  { name: 'Hirving Lozano', team: 'Mexico', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 78, age: 29, club: 'PSV' },
  { name: 'Edson Álvarez', team: 'Mexico', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 86, age: 27, club: 'West Ham' },
  { name: 'Son Heung-min', team: 'South Korea', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 79, age: 33, club: 'Tottenham' },
  { name: 'Kim Min-jae', team: 'South Korea', position: 'DF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 88, age: 28, club: 'Bayern Munich' },
  { name: 'Sadio Mané', team: 'Senegal', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 77, age: 32, club: 'Al Nassr' },
  { name: 'Luis Díaz', team: 'Colombia', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 80, age: 27, club: 'Liverpool' },
  { name: 'James Rodríguez', team: 'Colombia', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 86, age: 33, club: 'León' },
  { name: 'Luka Modrić', team: 'Croatia', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 90, age: 39, club: 'Real Madrid' },
  { name: 'Federico Chiesa', team: 'Italy', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 78, age: 27, club: 'Liverpool' },
  { name: 'Nicolas Jackson', team: 'Senegal', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 73, age: 23, club: 'Chelsea' },
  { name: 'Takumi Minamino', team: 'Japan', position: 'FW', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 81, age: 29, club: 'Monaco' },
  { name: 'Moisés Caicedo', team: 'Ecuador', position: 'MF', goals: 0, assists: 0, xG: 0, minutes: 0, passAccuracy: 88, age: 23, club: 'Chelsea' },
]

/** Group stage fixtures — MD1–MD3 for all 12 groups (no results until synced) */
const GROUP_FIXTURES: Record<string, [string, string][]> = {
  A: [
    ['Mexico', 'South Africa'], ['South Korea', 'Denmark'],
    ['Denmark', 'Mexico'], ['South Africa', 'South Korea'],
    ['Mexico', 'South Korea'], ['Denmark', 'South Africa'],
  ],
  B: [
    ['Canada', 'Switzerland'], ['Qatar', 'Italy'],
    ['Italy', 'Canada'], ['Switzerland', 'Qatar'],
    ['Canada', 'Qatar'], ['Italy', 'Switzerland'],
  ],
  C: [
    ['Brazil', 'Morocco'], ['Haiti', 'Scotland'],
    ['Scotland', 'Brazil'], ['Morocco', 'Haiti'],
    ['Brazil', 'Haiti'], ['Morocco', 'Scotland'],
  ],
  D: [
    ['United States', 'Paraguay'], ['Australia', 'Turkey'],
    ['Turkey', 'United States'], ['Paraguay', 'Australia'],
    ['United States', 'Australia'], ['Turkey', 'Paraguay'],
  ],
  E: [
    ['Germany', 'Curaçao'], ['Ivory Coast', 'Ecuador'],
    ['Ecuador', 'Germany'], ['Curaçao', 'Ivory Coast'],
    ['Germany', 'Ivory Coast'], ['Ecuador', 'Curaçao'],
  ],
  F: [
    ['Netherlands', 'Japan'], ['Ukraine', 'Tunisia'],
    ['Tunisia', 'Netherlands'], ['Japan', 'Ukraine'],
    ['Netherlands', 'Ukraine'], ['Japan', 'Tunisia'],
  ],
  G: [
    ['Belgium', 'Iran'], ['New Zealand', 'Egypt'],
    ['Egypt', 'Belgium'], ['Iran', 'New Zealand'],
    ['Belgium', 'New Zealand'], ['Egypt', 'Iran'],
  ],
  H: [
    ['Spain', 'Cape Verde'], ['Saudi Arabia', 'Uruguay'],
    ['Uruguay', 'Spain'], ['Cape Verde', 'Saudi Arabia'],
    ['Spain', 'Saudi Arabia'], ['Uruguay', 'Cape Verde'],
  ],
  I: [
    ['France', 'Senegal'], ['Bolivia', 'Norway'],
    ['Norway', 'France'], ['Senegal', 'Bolivia'],
    ['France', 'Bolivia'], ['Senegal', 'Norway'],
  ],
  J: [
    ['Argentina', 'Algeria'], ['Austria', 'Jordan'],
    ['Jordan', 'Argentina'], ['Algeria', 'Austria'],
    ['Argentina', 'Austria'], ['Algeria', 'Jordan'],
  ],
  K: [
    ['Portugal', 'Uzbekistan'], ['Colombia', 'Czech Republic'],
    ['Czech Republic', 'Portugal'], ['Uzbekistan', 'Colombia'],
    ['Portugal', 'Colombia'], ['Czech Republic', 'Uzbekistan'],
  ],
  L: [
    ['England', 'Ghana'], ['Panama', 'Croatia'],
    ['Croatia', 'England'], ['Ghana', 'Panama'],
    ['England', 'Panama'], ['Croatia', 'Ghana'],
  ],
}

const H2H_DATA: H2HRecord[] = [
  { team1: 'Brazil', team2: 'France', totalMatches: 12, team1Wins: 5, team2Wins: 4, draws: 3, lastFive: [{ date: '2022-11-26', result: '2-1 Brazil', competition: 'World Cup' }, { date: '2021-06-08', result: '3-0 France', competition: 'Friendly' }, { date: '2018-07-07', result: '2-1 France', competition: 'World Cup' }] },
  { team1: 'Argentina', team2: 'Germany', totalMatches: 8, team1Wins: 3, team2Wins: 3, draws: 2, lastFive: [{ date: '2014-07-13', result: '1-0 Germany', competition: 'World Cup Final' }, { date: '2023-10-18', result: '2-2 Draw', competition: 'Friendly' }] },
  { team1: 'Argentina', team2: 'Brazil', totalMatches: 15, team1Wins: 5, team2Wins: 7, draws: 3, lastFive: [{ date: '2023-11-21', result: '1-0 Argentina', competition: 'World Cup Qualifier' }, { date: '2021-07-10', result: '1-0 Argentina', competition: 'Copa América Final' }] },
  { team1: 'England', team2: 'Germany', totalMatches: 14, team1Wins: 5, team2Wins: 4, draws: 5, lastFive: [{ date: '2021-06-29', result: '2-0 Germany', competition: 'Euro 2020' }, { date: '2017-11-10', result: '0-0 Draw', competition: 'Friendly' }] },
  { team1: 'Spain', team2: 'Netherlands', totalMatches: 10, team1Wins: 4, team2Wins: 3, draws: 3, lastFive: [{ date: '2014-06-13', result: '5-1 Netherlands', competition: 'World Cup' }] },
  { team1: 'Mexico', team2: 'United States', totalMatches: 18, team1Wins: 7, team2Wins: 6, draws: 5, lastFive: [{ date: '2024-03-24', result: '2-0 Mexico', competition: 'CONCACAF Nations League' }, { date: '2023-10-22', result: '2-3 USA', competition: 'Friendly' }] },
  { team1: 'Portugal', team2: 'Spain', totalMatches: 9, team1Wins: 3, team2Wins: 4, draws: 2, lastFive: [{ date: '2022-09-27', result: '1-0 Spain', competition: 'Nations League' }] },
  { team1: 'Morocco', team2: 'Spain', totalMatches: 5, team1Wins: 1, team2Wins: 3, draws: 1, lastFive: [{ date: '2022-12-06', result: '0-0 (3-0 pens) Morocco', competition: 'World Cup' }] },
  { team1: 'Italy', team2: 'Switzerland', totalMatches: 6, team1Wins: 3, team2Wins: 1, draws: 2, lastFive: [{ date: '2021-09-05', result: '1-1 Draw', competition: 'Nations League' }, { date: '2020-11-17', result: '2-0 Italy', competition: 'Nations League' }] },
  { team1: 'Canada', team2: 'Switzerland', totalMatches: 4, team1Wins: 1, team2Wins: 2, draws: 1, lastFive: [{ date: '2024-06-29', result: '2-0 Switzerland', competition: 'Friendly' }] },
  { team1: 'Italy', team2: 'Qatar', totalMatches: 1, team1Wins: 1, team2Wins: 0, draws: 0, lastFive: [{ date: '2022-11-20', result: '2-1 Italy', competition: 'Friendly' }] },
  { team1: 'Portugal', team2: 'Colombia', totalMatches: 3, team1Wins: 2, team2Wins: 0, draws: 1, lastFive: [{ date: '2014-06-10', result: '0-0 Draw', competition: 'Friendly' }, { date: '2011-02-09', result: '1-0 Portugal', competition: 'Friendly' }] },
  { team1: 'Portugal', team2: 'Czech Republic', totalMatches: 4, team1Wins: 2, team2Wins: 1, draws: 1, lastFive: [{ date: '2022-09-24', result: '2-0 Portugal', competition: 'Nations League' }] },
  { team1: 'Colombia', team2: 'Czech Republic', totalMatches: 2, team1Wins: 1, team2Wins: 0, draws: 1, lastFive: [{ date: '2018-05-29', result: '1-1 Draw', competition: 'Friendly' }] },
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
        keyPlayer: SQUAD_PLAYERS.find((p) => p.team === name)?.name ?? name,
      })
    }
  }

  return Array.from(stats.values()).sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))
}

function buildMatches(): MatchRecord[] {
  const matches: MatchRecord[] = []
  const baseDate = new Date('2026-06-11T18:00:00Z')
  let dayOffset = 0

  for (const [group, fixtures] of Object.entries(GROUP_FIXTURES)) {
    fixtures.forEach(([home, away], idx) => {
      const matchday = Math.floor(idx / 2) + 1
      const venue = VENUES[(dayOffset + idx) % VENUES.length]
      matches.push({
        homeTeam: home,
        awayTeam: away,
        score: { home: 0, away: 0 },
        status: 'scheduled',
        date: new Date(baseDate.getTime() + (dayOffset + idx) * 86400000 * 0.5),
        stage: 'group',
        group,
        matchday,
        venue: venue.venue,
        city: venue.city,
        stats: {
          possession: { home: 50, away: 50 },
          shots: { home: 0, away: 0 },
          xG: { home: 0, away: 0 },
        },
      })
    })
    dayOffset += 2
  }

  return matches.sort((a, b) => a.date.getTime() - b.date.getTime())
}

function buildPlayers(): PlayerRecord[] {
  return SQUAD_PLAYERS.map((p) => ({ ...p, group: teamGroup(p.team) }))
}

/** Illustrative squad stats for preview mockup (before World Cup kickoff) */
const PREVIEW_SQUAD_PLAYERS: Omit<PlayerRecord, 'group'>[] = [
  { name: 'Lionel Messi', team: 'Argentina', position: 'FW', goals: 3, assists: 4, xG: 2.8, minutes: 251, passAccuracy: 87, age: 38, club: 'Inter Miami' },
  { name: 'Lautaro Martínez', team: 'Argentina', position: 'FW', goals: 4, assists: 1, xG: 3.1, minutes: 264, passAccuracy: 74, age: 28, club: 'Inter Milan' },
  { name: 'Kylian Mbappé', team: 'France', position: 'FW', goals: 5, assists: 2, xG: 4.2, minutes: 270, passAccuracy: 81, age: 27, club: 'Real Madrid' },
  { name: 'Harry Kane', team: 'England', position: 'FW', goals: 4, assists: 1, xG: 3.8, minutes: 270, passAccuracy: 77, age: 32, club: 'Bayern Munich' },
  { name: 'Vinícius Jr.', team: 'Brazil', position: 'FW', goals: 4, assists: 2, xG: 3.6, minutes: 268, passAccuracy: 80, age: 25, club: 'Real Madrid' },
  { name: 'Bukayo Saka', team: 'England', position: 'FW', goals: 3, assists: 2, xG: 2.2, minutes: 265, passAccuracy: 83, age: 24, club: 'Arsenal' },
  { name: 'Lamine Yamal', team: 'Spain', position: 'FW', goals: 3, assists: 3, xG: 2.5, minutes: 255, passAccuracy: 84, age: 18, club: 'Barcelona' },
  { name: 'Christian Pulisic', team: 'United States', position: 'FW', goals: 3, assists: 2, xG: 2.3, minutes: 268, passAccuracy: 80, age: 26, club: 'AC Milan' },
  { name: 'Sadio Mané', team: 'Senegal', position: 'FW', goals: 3, assists: 1, xG: 2.4, minutes: 262, passAccuracy: 77, age: 32, club: 'Al Nassr' },
  { name: 'Luis Díaz', team: 'Colombia', position: 'FW', goals: 3, assists: 2, xG: 2.5, minutes: 268, passAccuracy: 80, age: 27, club: 'Liverpool' },
  ...SQUAD_PLAYERS.filter(
    (p) =>
      ![
        'Lionel Messi',
        'Lautaro Martínez',
        'Kylian Mbappé',
        'Harry Kane',
        'Vinícius Jr.',
        'Bukayo Saka',
        'Lamine Yamal',
        'Christian Pulisic',
        'Sadio Mané',
        'Luis Díaz',
      ].includes(p.name)
  ).map((p) => ({
    ...p,
    goals: p.goals || 1,
    assists: p.assists || 0,
    xG: 0.8,
    minutes: 180,
  })),
]

const PREVIEW_GROUP_RESULTS: Record<string, [string, string, number, number][]> = {
  A: [
    ['Mexico', 'South Africa', 2, 0], ['South Korea', 'Denmark', 1, 1],
    ['Denmark', 'Mexico', 0, 1], ['South Africa', 'South Korea', 1, 2],
    ['Mexico', 'South Korea', 2, 1], ['Denmark', 'South Africa', 3, 0],
  ],
  I: [
    ['France', 'Senegal', 2, 0], ['Bolivia', 'Norway', 0, 1],
    ['Norway', 'France', 1, 1], ['Senegal', 'Bolivia', 3, 0],
    ['France', 'Bolivia', 4, 0], ['Senegal', 'Norway', 2, 1],
  ],
  B: [
    ['Canada', 'Switzerland', 1, 1], ['Qatar', 'Italy', 0, 2],
    ['Italy', 'Canada', 2, 0], ['Switzerland', 'Qatar', 3, 0],
    ['Canada', 'Qatar', 4, 1], ['Italy', 'Switzerland', 1, 0],
  ],
  C: [
    ['Brazil', 'Morocco', 2, 1], ['Haiti', 'Scotland', 0, 1],
    ['Scotland', 'Brazil', 0, 3], ['Morocco', 'Haiti', 2, 0],
    ['Brazil', 'Haiti', 4, 0], ['Morocco', 'Scotland', 1, 1],
  ],
  D: [
    ['United States', 'Paraguay', 2, 0], ['Australia', 'Turkey', 1, 2],
    ['Turkey', 'United States', 1, 1], ['Paraguay', 'Australia', 0, 0],
    ['United States', 'Australia', 3, 1], ['Turkey', 'Paraguay', 2, 1],
  ],
  E: [
    ['Germany', 'Curaçao', 5, 0], ['Ivory Coast', 'Ecuador', 1, 1],
    ['Ecuador', 'Germany', 0, 2], ['Curaçao', 'Ivory Coast', 0, 3],
    ['Germany', 'Ivory Coast', 1, 1], ['Ecuador', 'Curaçao', 3, 0],
  ],
  F: [
    ['Netherlands', 'Japan', 2, 1], ['Ukraine', 'Tunisia', 1, 0],
    ['Tunisia', 'Netherlands', 0, 0], ['Japan', 'Ukraine', 2, 2],
    ['Netherlands', 'Ukraine', 3, 1], ['Japan', 'Tunisia', 1, 0],
  ],
  G: [
    ['Belgium', 'Iran', 3, 0], ['New Zealand', 'Egypt', 0, 0],
    ['Egypt', 'Belgium', 1, 2], ['Iran', 'New Zealand', 1, 0],
    ['Belgium', 'New Zealand', 2, 0], ['Egypt', 'Iran', 0, 1],
  ],
  H: [
    ['Spain', 'Cape Verde', 3, 0], ['Saudi Arabia', 'Uruguay', 0, 1],
    ['Uruguay', 'Spain', 1, 2], ['Cape Verde', 'Saudi Arabia', 2, 1],
    ['Spain', 'Saudi Arabia', 2, 0], ['Uruguay', 'Cape Verde', 4, 0],
  ],
  J: [
    ['Argentina', 'Algeria', 2, 0], ['Austria', 'Jordan', 3, 1],
    ['Jordan', 'Argentina', 0, 1], ['Algeria', 'Austria', 1, 1],
    ['Argentina', 'Austria', 2, 1], ['Algeria', 'Jordan', 2, 0],
  ],
  K: [
    ['Portugal', 'Uzbekistan', 3, 0], ['Colombia', 'Czech Republic', 2, 1],
    ['Czech Republic', 'Portugal', 0, 2], ['Uzbekistan', 'Colombia', 0, 1],
    ['Portugal', 'Colombia', 1, 1], ['Czech Republic', 'Uzbekistan', 2, 0],
  ],
  L: [
    ['England', 'Ghana', 2, 0], ['Panama', 'Croatia', 0, 2],
    ['Croatia', 'England', 1, 1], ['Ghana', 'Panama', 2, 1],
    ['England', 'Panama', 3, 0], ['Croatia', 'Ghana', 1, 0],
  ],
}

const PREVIEW_KNOCKOUT_MATCHES: Omit<MatchRecord, 'group'>[] = [
  { homeTeam: 'Brazil', awayTeam: 'Japan', score: { home: 2, away: 0 }, status: 'finished', date: new Date('2026-07-01'), stage: 'round-of-16', venue: 'SoFi Stadium', city: 'Los Angeles', matchday: 0, stats: { possession: { home: 58, away: 42 }, shots: { home: 15, away: 6 }, xG: { home: 2.1, away: 0.5 } } },
  { homeTeam: 'France', awayTeam: 'Colombia', score: { home: 3, away: 1 }, status: 'finished', date: new Date('2026-07-02'), stage: 'round-of-16', venue: 'Hard Rock Stadium', city: 'Miami', matchday: 0, stats: { possession: { home: 55, away: 45 }, shots: { home: 14, away: 10 }, xG: { home: 2.4, away: 1.1 } } },
  { homeTeam: 'Argentina', awayTeam: 'Netherlands', score: { home: 2, away: 2 }, status: 'finished', date: new Date('2026-07-03'), stage: 'round-of-16', venue: 'AT&T Stadium', city: 'Dallas', matchday: 0, stats: { possession: { home: 48, away: 52 }, shots: { home: 11, away: 13 }, xG: { home: 1.8, away: 2.0 } } },
  { homeTeam: 'Brazil', awayTeam: 'France', score: { home: 2, away: 1 }, status: 'finished', date: new Date('2026-07-09'), stage: 'quarter', venue: 'Estadio Azteca', city: 'Mexico City', matchday: 0, stats: { possession: { home: 52, away: 48 }, shots: { home: 13, away: 11 }, xG: { home: 1.9, away: 1.3 } } },
]

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
        keyPlayer: PREVIEW_SQUAD_PLAYERS.find((p) => p.team === name)?.name ?? name,
      })
    }
  }

  for (const results of Object.values(PREVIEW_GROUP_RESULTS)) {
    results.forEach(([home, away, hg, ag]) => {
      const h = stats.get(home)!
      const a = stats.get(away)!
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
    })
  }

  return Array.from(stats.values()).sort((a, b) => a.group.localeCompare(b.group) || b.points - a.points)
}

function buildPreviewMatches(): MatchRecord[] {
  const matches: MatchRecord[] = []
  const baseDate = new Date('2026-06-11T18:00:00Z')
  let dayOffset = 0

  for (const [group, results] of Object.entries(PREVIEW_GROUP_RESULTS)) {
    results.forEach(([home, away, hg, ag], idx) => {
      const matchday = Math.floor(idx / 2) + 1
      const venue = VENUES[(dayOffset + idx) % VENUES.length]
      matches.push({
        homeTeam: home,
        awayTeam: away,
        score: { home: hg, away: ag },
        status: 'finished',
        date: new Date(baseDate.getTime() + (dayOffset + idx) * 86400000 * 0.5),
        stage: 'group',
        group,
        matchday,
        venue: venue.venue,
        city: venue.city,
        stats: {
          possession: { home: 52, away: 48 },
          shots: { home: hg * 4 + 6, away: ag * 4 + 5 },
          xG: { home: hg * 0.7 + 0.5, away: ag * 0.7 + 0.4 },
        },
      })
    })
    dayOffset += 2
  }

  for (const km of PREVIEW_KNOCKOUT_MATCHES) {
    matches.push({ ...km, group: null })
  }

  return matches.sort((a, b) => a.date.getTime() - b.date.getTime())
}

function buildPreviewPlayers(): PlayerRecord[] {
  return PREVIEW_SQUAD_PLAYERS.map((p) => ({ ...p, group: teamGroup(p.team) }))
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
      format: '12 groups of 4 → Round of 32',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
      currentStage: preview ? 'preview-mockup' : 'live',
      dataMode: getTournamentDataMode(),
      venues: VENUES.length,
      dataNote: preview
        ? 'Illustrative preview mockup — clearly labeled until kickoff; replaced by synced results after 11 Jun 2026'
        : 'Live tournament data — updated via npm run sync / admin agent',
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
    position: p.position,
    goals: p.goals,
    assists: p.assists,
    xG: p.xG,
    minutes: p.minutes,
    passAccuracy: p.passAccuracy,
  }))
}

/** Active mock dataset — preview illustrative data before kickoff, live seed after */
export const MOCK_TEAMS = toMockTeams(getActiveTeams())
export const MOCK_PLAYERS = toMockPlayers(getActivePlayers())
export const MOCK_MATCHES = getActiveMatches()
export const MOCK_HEAD_TO_HEAD = H2H_DATA