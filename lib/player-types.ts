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
  /** curated = hand-picked samples; illustrative = hash-generated demo data */
  clubFormSource?: 'curated' | 'illustrative' | 'fotmob'
  recentClubMatches: ClubMatch[]
  /** World Cup 2026 match log from FotMob sync */
  recentTournamentMatches?: ClubMatch[]
  /** FotMob player id for incremental sync */
  fotmobId?: number
  /** Guardian squad-guide headshot */
  playerImageUrl?: string
  /** Guardian per-player bio (FOX scoutBio takes precedence for spotlight cards) */
  guardianBio?: string
  guardianBioSource?: string
  /** Guardian editorial tag (key player, promising talent, etc.) */
  scoutTag?: string
  /** National-team caps — FOX Top 100 or Guardian squad guide */
  nationalCaps?: number
  nationalGoals?: number
  nationalCapsSource?: string
  worldCupHistory: WorldCupHistorySummary | null
  /** Scout spotlight — Reuters key player and/or FOX Top 100 */
  keyPlayer?: boolean
  scoutNote?: string
  scoutSource?: string
  /** FOX analyst paragraph(s) for richer scout cards */
  scoutBio?: string
  scoutBioSource?: string
  scoutBioAnalyst?: string
  /** FOX Sports World Cup Top 100 rank (1 = best) */
  foxRank?: number
  foxCaps?: number
  /** Omitted from squad or injured per FOX editor's note */
  foxUnavailable?: string
  /** FOX analyst prediction tags (Golden Ball, breakout, etc.) */
  foxPredictions?: string[]
  foxPredictionNote?: string
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