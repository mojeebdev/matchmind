import { PLAYER_WORLD_CUP_CAREERS } from './worldcup-historical-data'
import type { PlayerPosition, PlayerRecord, SquadRosterEntry } from './player-types'

const CAREER_BY_NAME = new Map(
  PLAYER_WORLD_CUP_CAREERS.map((c) => [c.name.toLowerCase(), c])
)

const OPPONENTS = [
  'Barcelona', 'Real Madrid', 'Bayern Munich', 'Liverpool', 'Arsenal', 'Chelsea',
  'Inter Milan', 'AC Milan', 'Atlético Madrid', 'Dortmund', 'PSG', 'Juventus',
  'Napoli', 'Roma', 'Manchester City', 'Manchester United', 'Tottenham', 'Newcastle',
]

const COMPETITIONS = ['League', 'Champions League', 'Cup', 'Europa League', 'Conference League']

type CuratedClubProfile = {
  lastFive: string[]
  seasonGoals: number
  seasonAssists: number
  avgRating: number
  recentClubMatches: PlayerRecord['recentClubMatches']
}

const CURATED_CLUB_FORM: Record<string, CuratedClubProfile> = {
  'Lionel Messi': {
    lastFive: ['W', 'W', 'D', 'W', 'W'],
    seasonGoals: 18, seasonAssists: 14, avgRating: 8.4,
    recentClubMatches: [
      { date: '2026-05-28', opponent: 'Orlando City', competition: 'MLS', result: '3-1 W', goals: 1, assists: 2, minutes: 90, rating: 8.9 },
      { date: '2026-05-21', opponent: 'Columbus Crew', competition: 'MLS', result: '2-0 W', goals: 1, assists: 0, minutes: 78, rating: 8.2 },
      { date: '2026-05-14', opponent: 'Nashville SC', competition: 'MLS', result: '1-1 D', goals: 0, assists: 1, minutes: 90, rating: 7.6 },
      { date: '2026-05-07', opponent: 'CF Montréal', competition: 'MLS', result: '4-1 W', goals: 2, assists: 1, minutes: 85, rating: 9.1 },
      { date: '2026-04-30', opponent: 'New York City FC', competition: 'MLS', result: '2-1 W', goals: 1, assists: 0, minutes: 90, rating: 8.0 },
    ],
  },
  'Cristiano Ronaldo': {
    lastFive: ['W', 'W', 'W', 'D', 'W'],
    seasonGoals: 28, seasonAssists: 6, avgRating: 8.1,
    recentClubMatches: [
      { date: '2026-05-27', opponent: 'Al Hilal', competition: 'Saudi Pro League', result: '2-1 W', goals: 2, assists: 0, minutes: 90, rating: 8.7 },
      { date: '2026-05-20', opponent: 'Al Ahli', competition: 'Saudi Pro League', result: '3-0 W', goals: 1, assists: 1, minutes: 90, rating: 8.3 },
      { date: '2026-05-13', opponent: 'Al Ittihad', competition: 'Saudi Pro League', result: '2-2 D', goals: 1, assists: 0, minutes: 90, rating: 7.5 },
      { date: '2026-05-06', opponent: 'Al Shabab', competition: 'Saudi Pro League', result: '1-0 W', goals: 0, assists: 1, minutes: 88, rating: 7.8 },
      { date: '2026-04-29', opponent: 'Al Fateh', competition: 'Saudi Pro League', result: '4-1 W', goals: 2, assists: 0, minutes: 90, rating: 8.9 },
    ],
  },
  'Kylian Mbappé': {
    lastFive: ['W', 'W', 'W', 'L', 'W'],
    seasonGoals: 32, seasonAssists: 8, avgRating: 8.3,
    recentClubMatches: [
      { date: '2026-05-25', opponent: 'Barcelona', competition: 'La Liga', result: '2-1 W', goals: 1, assists: 0, minutes: 90, rating: 8.1 },
      { date: '2026-05-18', opponent: 'Sevilla', competition: 'La Liga', result: '3-0 W', goals: 2, assists: 1, minutes: 90, rating: 9.0 },
      { date: '2026-05-11', opponent: 'Atlético Madrid', competition: 'La Liga', result: '1-0 W', goals: 1, assists: 0, minutes: 85, rating: 7.9 },
      { date: '2026-05-04', opponent: 'Manchester City', competition: 'Champions League', result: '1-2 L', goals: 1, assists: 0, minutes: 90, rating: 7.4 },
      { date: '2026-04-27', opponent: 'Real Sociedad', competition: 'La Liga', result: '2-0 W', goals: 1, assists: 1, minutes: 90, rating: 8.5 },
    ],
  },
  'Vinícius Jr.': {
    lastFive: ['W', 'D', 'W', 'W', 'W'],
    seasonGoals: 22, seasonAssists: 14, avgRating: 8.0,
    recentClubMatches: [
      { date: '2026-05-25', opponent: 'Real Madrid', competition: 'La Liga', result: '2-1 W', goals: 1, assists: 1, minutes: 90, rating: 8.6 },
      { date: '2026-05-18', opponent: 'Barcelona', competition: 'La Liga', result: '0-0 D', goals: 0, assists: 0, minutes: 90, rating: 7.2 },
      { date: '2026-05-11', opponent: 'Bayern Munich', competition: 'Champions League', result: '3-1 W', goals: 2, assists: 0, minutes: 90, rating: 9.2 },
      { date: '2026-05-04', opponent: 'Villarreal', competition: 'La Liga', result: '2-0 W', goals: 1, assists: 1, minutes: 82, rating: 8.4 },
      { date: '2026-04-27', opponent: 'Athletic Bilbao', competition: 'La Liga', result: '1-0 W', goals: 0, assists: 1, minutes: 90, rating: 7.8 },
    ],
  },
  'Harry Kane': {
    lastFive: ['W', 'W', 'W', 'W', 'D'],
    seasonGoals: 34, seasonAssists: 9, avgRating: 8.2,
    recentClubMatches: [
      { date: '2026-05-24', opponent: 'Dortmund', competition: 'Bundesliga', result: '3-1 W', goals: 2, assists: 0, minutes: 90, rating: 8.8 },
      { date: '2026-05-17', opponent: 'Leverkusen', competition: 'Bundesliga', result: '2-0 W', goals: 1, assists: 1, minutes: 90, rating: 8.3 },
      { date: '2026-05-10', opponent: 'RB Leipzig', competition: 'Bundesliga', result: '4-1 W', goals: 2, assists: 0, minutes: 88, rating: 8.9 },
      { date: '2026-05-03', opponent: 'Inter Milan', competition: 'Champions League', result: '2-1 W', goals: 1, assists: 0, minutes: 90, rating: 8.1 },
      { date: '2026-04-26', opponent: 'Freiburg', competition: 'Bundesliga', result: '1-1 D', goals: 0, assists: 1, minutes: 90, rating: 7.4 },
    ],
  },
  'Jude Bellingham': {
    lastFive: ['W', 'W', 'L', 'W', 'W'],
    seasonGoals: 14, seasonAssists: 11, avgRating: 7.9,
    recentClubMatches: [
      { date: '2026-05-25', opponent: 'Real Madrid', competition: 'La Liga', result: '2-1 W', goals: 1, assists: 0, minutes: 90, rating: 8.0 },
      { date: '2026-05-18', opponent: 'Manchester City', competition: 'Champions League', result: '1-2 L', goals: 1, assists: 0, minutes: 90, rating: 7.6 },
      { date: '2026-05-11', opponent: 'Sevilla', competition: 'La Liga', result: '3-0 W', goals: 0, assists: 2, minutes: 90, rating: 8.4 },
      { date: '2026-05-04', opponent: 'Barcelona', competition: 'La Liga', result: '1-0 W', goals: 0, assists: 1, minutes: 85, rating: 7.7 },
      { date: '2026-04-27', opponent: 'Atlético Madrid', competition: 'La Liga', result: '2-1 W', goals: 1, assists: 0, minutes: 90, rating: 8.2 },
    ],
  },
  'Lamine Yamal': {
    lastFive: ['W', 'W', 'W', 'D', 'W'],
    seasonGoals: 11, seasonAssists: 16, avgRating: 8.1,
    recentClubMatches: [
      { date: '2026-05-25', opponent: 'Barcelona', competition: 'La Liga', result: '2-1 W', goals: 1, assists: 1, minutes: 90, rating: 8.5 },
      { date: '2026-05-18', opponent: 'Real Madrid', competition: 'La Liga', result: '0-0 D', goals: 0, assists: 1, minutes: 90, rating: 7.8 },
      { date: '2026-05-11', opponent: 'Villarreal', competition: 'La Liga', result: '3-1 W', goals: 1, assists: 2, minutes: 85, rating: 9.0 },
      { date: '2026-05-04', opponent: 'Inter Milan', competition: 'Champions League', result: '2-0 W', goals: 0, assists: 1, minutes: 90, rating: 8.2 },
      { date: '2026-04-27', opponent: 'Girona', competition: 'La Liga', result: '4-0 W', goals: 2, assists: 1, minutes: 75, rating: 9.1 },
    ],
  },
  'Rodri': {
    lastFive: ['W', 'W', 'D', 'W', 'W'],
    seasonGoals: 4, seasonAssists: 7, avgRating: 7.8,
    recentClubMatches: [
      { date: '2026-05-24', opponent: 'Bournemouth', competition: 'Premier League', result: '2-0 W', goals: 0, assists: 1, minutes: 90, rating: 7.9 },
      { date: '2026-05-17', opponent: 'Arsenal', competition: 'Premier League', result: '1-1 D', goals: 0, assists: 0, minutes: 90, rating: 7.5 },
      { date: '2026-05-10', opponent: 'Real Madrid', competition: 'Champions League', result: '3-1 W', goals: 1, assists: 0, minutes: 90, rating: 8.4 },
      { date: '2026-05-03', opponent: 'Wolves', competition: 'Premier League', result: '3-0 W', goals: 0, assists: 1, minutes: 90, rating: 8.0 },
      { date: '2026-04-26', opponent: 'Everton', competition: 'Premier League', result: '2-1 W', goals: 1, assists: 0, minutes: 90, rating: 7.7 },
    ],
  },
  'Bruno Fernandes': {
    lastFive: ['W', 'L', 'W', 'D', 'W'],
    seasonGoals: 12, seasonAssists: 15, avgRating: 7.7,
    recentClubMatches: [
      { date: '2026-05-25', opponent: 'Aston Villa', competition: 'Premier League', result: '2-1 W', goals: 1, assists: 1, minutes: 90, rating: 8.3 },
      { date: '2026-05-18', opponent: 'Chelsea', competition: 'Premier League', result: '0-1 L', goals: 0, assists: 0, minutes: 90, rating: 6.8 },
      { date: '2026-05-11', opponent: 'Liverpool', competition: 'Premier League', result: '2-0 W', goals: 1, assists: 1, minutes: 90, rating: 8.5 },
      { date: '2026-05-04', opponent: 'Brentford', competition: 'Premier League', result: '1-1 D', goals: 0, assists: 1, minutes: 90, rating: 7.4 },
      { date: '2026-04-27', opponent: 'Tottenham', competition: 'Premier League', result: '3-1 W', goals: 1, assists: 0, minutes: 90, rating: 8.0 },
    ],
  },
  'Son Heung-min': {
    lastFive: ['W', 'W', 'L', 'W', 'W'],
    seasonGoals: 16, seasonAssists: 9, avgRating: 7.8,
    recentClubMatches: [
      { date: '2026-05-25', opponent: 'Crystal Palace', competition: 'Premier League', result: '2-0 W', goals: 1, assists: 0, minutes: 90, rating: 8.0 },
      { date: '2026-05-18', opponent: 'Manchester City', competition: 'Premier League', result: '1-2 L', goals: 1, assists: 0, minutes: 90, rating: 7.2 },
      { date: '2026-05-11', opponent: 'Arsenal', competition: 'Premier League', result: '3-1 W', goals: 1, assists: 1, minutes: 90, rating: 8.6 },
      { date: '2026-05-04', opponent: 'Newcastle', competition: 'Premier League', result: '1-0 W', goals: 0, assists: 1, minutes: 85, rating: 7.5 },
      { date: '2026-04-27', opponent: 'Brighton', competition: 'Premier League', result: '2-1 W', goals: 1, assists: 0, minutes: 90, rating: 8.1 },
    ],
  },
}

function hashName(name: string): number {
  return name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
}

function generateClubForm(name: string, position: PlayerPosition, club: string): CuratedClubProfile {
  const h = hashName(name)
  const baseGoals =
    position === 'FW' ? 6 + (h % 12) : position === 'MF' ? 2 + (h % 6) : position === 'DF' ? h % 3 : 0
  const baseAssists =
    position === 'FW' ? 2 + (h % 5) : position === 'MF' ? 3 + (h % 7) : position === 'DF' ? 1 + (h % 3) : h % 2
  const results: Array<'W' | 'D' | 'L'> = ['W', 'W', 'D', 'W', 'L']
  const rotated = results.map((_, i) => results[(i + (h % 5)) % 5])

  const recentClubMatches: PlayerRecord['recentClubMatches'] = rotated.map((res, i) => {
    const opp = OPPONENTS[(h + i) % OPPONENTS.length]
    const scored = position === 'GK' ? 0 : res === 'W' ? (h + i) % 2 : 0
    const assisted = position === 'GK' || position === 'DF' ? (h + i) % 2 : (h + i) % 2
    const scoreHome = res === 'W' ? 2 + (i % 2) : res === 'D' ? 1 : 0
    const scoreAway = res === 'L' ? 2 : res === 'D' ? 1 : 1
    return {
      date: `2026-0${5 - Math.floor(i / 2)}-${String(28 - i * 7).padStart(2, '0')}`,
      opponent: opp,
      competition: COMPETITIONS[(h + i) % COMPETITIONS.length],
      result: res === 'W' ? `${scoreHome}-${scoreAway} W` : res === 'D' ? `${scoreHome}-${scoreAway} D` : `${scoreHome}-${scoreAway} L`,
      goals: scored,
      assists: assisted,
      minutes: position === 'GK' ? 90 : 70 + ((h + i) % 21),
      rating: 6.5 + ((h + i) % 25) / 10,
    }
  })

  return {
    lastFive: rotated,
    seasonGoals: baseGoals,
    seasonAssists: baseAssists,
    avgRating: 6.8 + (h % 15) / 10,
    recentClubMatches,
  }
}

function buildWorldCupHistory(name: string): PlayerRecord['worldCupHistory'] {
  const career = CAREER_BY_NAME.get(name.toLowerCase())
  if (!career || career.tournamentsPlayed === 0) return null
  return {
    tournamentsPlayed: career.tournamentsPlayed,
    totalGoals: career.totalGoals,
    totalAppearances: career.totalAppearances,
    totalAssists: career.totalAssists,
    worldCupTitles: career.worldCupTitles,
    lastTournament: career.lastTournament,
    summary: career.careerSummary,
  }
}

function defaultPassAccuracy(position: PlayerPosition, age: number): number {
  if (position === 'GK') return 78 + (age % 8)
  if (position === 'DF') return 84 + (age % 10)
  if (position === 'MF') return 82 + (age % 12)
  return 74 + (age % 12)
}

export function enrichSquadPlayer(
  entry: SquadRosterEntry,
  group: string,
  tournamentStats: { goals: number; assists: number; xG: number; minutes: number } = {
    goals: 0,
    assists: 0,
    xG: 0,
    minutes: 0,
  }
): PlayerRecord {
  const clubProfile = CURATED_CLUB_FORM[entry.name] ?? generateClubForm(entry.name, entry.position, entry.club)

  return {
    name: entry.name,
    team: entry.team,
    group,
    position: entry.position,
    squadNumber: entry.squadNumber,
    goals: tournamentStats.goals,
    assists: tournamentStats.assists,
    xG: tournamentStats.xG,
    minutes: tournamentStats.minutes,
    passAccuracy: defaultPassAccuracy(entry.position, entry.age),
    age: entry.age,
    club: entry.club,
    clubForm: {
      lastFive: clubProfile.lastFive,
      seasonGoals: clubProfile.seasonGoals,
      seasonAssists: clubProfile.seasonAssists,
      avgRating: clubProfile.avgRating,
    },
    recentClubMatches: clubProfile.recentClubMatches,
    worldCupHistory: buildWorldCupHistory(entry.name),
  }
}

import { getAllRosterNames as rosterNames } from './worldcup2026-squads'

export function getAllRosterNames(): string[] {
  return rosterNames()
}

export function findSquadPlayerName(question: string, names: string[]): string | null {
  const q = question.toLowerCase()
  const sorted = [...names].sort((a, b) => b.length - a.length)
  for (const name of sorted) {
    const lower = name.toLowerCase()
    if (q.includes(lower)) return name
    const last = name.split(' ').pop()?.toLowerCase()
    if (last && last.length > 3 && q.includes(last)) return name
  }
  return null
}