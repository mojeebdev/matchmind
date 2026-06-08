export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW'

export type ClubMatch = {
  date: string
  opponent: string
  competition: string
  result: string
  goals: number
  assists: number
  minutes: number
  rating?: number
}

export type WorldCupHistorySummary = {
  tournamentsPlayed: number
  totalGoals: number
  totalAppearances: number
  totalAssists: number
  worldCupTitles: number
  lastTournament: number
  summary: string
}

export type PlayerRecord = {
  name: string
  team: string
  group: string
  position: PlayerPosition
  squadNumber: number
  goals: number
  assists: number
  xG: number
  minutes: number
  passAccuracy: number
  age: number
  club: string
  clubForm: {
    lastFive: string[]
    seasonGoals: number
    seasonAssists: number
    avgRating: number
  }
  recentClubMatches: ClubMatch[]
  worldCupHistory: WorldCupHistorySummary | null
}

export type SquadRosterEntry = {
  name: string
  team: string
  position: PlayerPosition
  age: number
  club: string
  squadNumber: number
}

/** Compact roster tuple: [name, position, age, club, squadNumber] */
export type RosterTuple = [string, PlayerPosition, number, string, number]