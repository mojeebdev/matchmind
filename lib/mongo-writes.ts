import type { Db, Document } from 'mongodb'
import { getMongoClient } from './mongodb'

type TeamStanding = {
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

function emptyStanding(): TeamStanding {
  return {
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  }
}

function applyResult(
  standing: TeamStanding,
  goalsFor: number,
  goalsAgainst: number
): TeamStanding {
  const next = { ...standing, played: standing.played + 1 }
  next.goalsFor += goalsFor
  next.goalsAgainst += goalsAgainst

  if (goalsFor > goalsAgainst) {
    next.wins += 1
    next.points += 3
  } else if (goalsFor < goalsAgainst) {
    next.losses += 1
  } else {
    next.draws += 1
    next.points += 1
  }

  return next
}

export async function recalculateGroupStandings(group: string) {
  const client = await getMongoClient()
  const db = client.db('matchmind')

  const [teams, matches] = await Promise.all([
    db.collection('teams').find({ group }).toArray(),
    db
      .collection('matches')
      .find({ group, stage: 'group' })
      .toArray(),
  ])

  const standings = new Map<string, TeamStanding>()
  for (const team of teams) {
    standings.set(team.name as string, emptyStanding())
  }

  for (const match of matches) {
    if (match.status && match.status !== 'finished') continue

    const home = match.homeTeam as string
    const away = match.awayTeam as string
    const homeScore = (match.score as { home: number }).home ?? 0
    const awayScore = (match.score as { away: number }).away ?? 0

    const homeStanding = standings.get(home)
    const awayStanding = standings.get(away)
    if (!homeStanding || !awayStanding) continue

    standings.set(home, applyResult(homeStanding, homeScore, awayScore))
    standings.set(away, applyResult(awayStanding, awayScore, homeScore))
  }

  const updates = []
  for (const [name, stats] of standings) {
    const result = await db.collection('teams').updateOne({ name, group }, { $set: stats })
    updates.push({ team: name, group, modified: result.modifiedCount > 0, stats })
  }

  return { group, teamsUpdated: updates.length, updates }
}

const KNOCKOUT_STAGES = ['round-of-32', 'round-of-16', 'quarter', 'semi', 'third-place', 'final']

async function findKnockoutByKickoff(db: Db, kickoff: string) {
  const target = new Date(kickoff).getTime()
  if (Number.isNaN(target)) return null

  const candidates = await db
    .collection('matches')
    .find({ stage: { $in: KNOCKOUT_STAGES } })
    .toArray()

  let best: (typeof candidates)[number] | null = null
  let bestDelta = Infinity
  for (const row of candidates) {
    const rowTime = new Date(row.date as Date).getTime()
    if (Number.isNaN(rowTime)) continue
    const delta = Math.abs(rowTime - target)
    if (delta < bestDelta) {
      bestDelta = delta
      best = row
    }
  }

  // FIFA kickoffs can differ by ~1h from our schedule PDF; pick nearest within 2h.
  return bestDelta <= 2 * 60 * 60_000 ? best : null
}

async function applyMatchUpdate(
  db: Db,
  match: Document,
  input: {
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    status?: 'scheduled' | 'live' | 'finished'
  },
  score: { home: number; away: number },
  display: { homeTeam: string; awayTeam: string }
) {
  const previous = (match.score as { home: number; away: number }) ?? { home: 0, away: 0 }
  await db.collection('matches').updateOne(
    { _id: match._id },
    {
      $set: {
        homeTeam: display.homeTeam,
        awayTeam: display.awayTeam,
        score,
        status: input.status ?? 'finished',
        updatedAt: new Date(),
      },
    }
  )

  let standings = null
  if (match.group && match.stage === 'group') {
    standings = await recalculateGroupStandings(match.group as string)
  }

  import('@/lib/notifications')
    .then(({ notifySupportedCountryMatchResult }) =>
      notifySupportedCountryMatchResult({
        homeTeam: display.homeTeam,
        awayTeam: display.awayTeam,
        homeScore: score.home,
        awayScore: score.away,
      })
    )
    .catch((error) => console.error('Match alert emails failed:', error))

  return {
    status: 'success' as const,
    match: {
      homeTeam: display.homeTeam,
      awayTeam: display.awayTeam,
      previousScore: previous,
      newScore: score,
      group: (match.group as string | null) ?? null,
      stage: match.stage,
    },
    standings,
  }
}

export async function updateMatchResult(input: {
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status?: 'scheduled' | 'live' | 'finished'
  date?: string
}) {
  const client = await getMongoClient()
  const db = client.db('matchmind')

  let match = await db.collection('matches').findOne({
    homeTeam: input.homeTeam,
    awayTeam: input.awayTeam,
  })

  if (match) {
    return applyMatchUpdate(
      db,
      match,
      input,
      { home: input.homeScore, away: input.awayScore },
      { homeTeam: input.homeTeam, awayTeam: input.awayTeam }
    )
  }

  const swapped = await db.collection('matches').findOne({
    homeTeam: input.awayTeam,
    awayTeam: input.homeTeam,
  })

  if (swapped) {
    return applyMatchUpdate(
      db,
      swapped,
      input,
      { home: input.awayScore, away: input.homeScore },
      { homeTeam: input.homeTeam, awayTeam: input.awayTeam }
    )
  }

  if (input.date) {
    match = await findKnockoutByKickoff(db, input.date)
    if (match) {
      return applyMatchUpdate(
        db,
        match,
        input,
        { home: input.homeScore, away: input.awayScore },
        { homeTeam: input.homeTeam, awayTeam: input.awayTeam }
      )
    }
  }

  return {
    status: 'error' as const,
    message: `No match found for ${input.homeTeam} vs ${input.awayTeam}`,
  }
}

type ClubFormUpdate = {
  lastFive: string[]
  seasonGoals: number
  seasonAssists: number
  avgRating: number
}

type MatchLogUpdate = {
  date: string
  opponent: string
  competition: string
  result: string
  goals: number
  assists: number
  minutes: number
  rating?: number
}

export async function updatePlayerStats(input: {
  playerName: string
  goals?: number
  assists?: number
  goalsDelta?: number
  assistsDelta?: number
  minutes?: number
  xG?: number
  fotmobId?: number
  clubForm?: ClubFormUpdate
  clubFormSource?: 'curated' | 'illustrative' | 'fotmob'
  recentClubMatches?: MatchLogUpdate[]
  recentTournamentMatches?: MatchLogUpdate[]
}) {
  const client = await getMongoClient()
  const db = client.db('matchmind')

  const player = await db.collection('players').findOne({
    name: { $regex: new RegExp(`^${escapeRegex(input.playerName)}$`, 'i') },
  })

  if (!player) {
    return {
      status: 'error' as const,
      message: `No player found matching "${input.playerName}"`,
    }
  }

  const update: Record<string, number> = {}
  if (typeof input.goals === 'number') update.goals = input.goals
  if (typeof input.assists === 'number') update.assists = input.assists
  if (typeof input.goalsDelta === 'number') update.goals = (player.goals as number) + input.goalsDelta
  if (typeof input.assistsDelta === 'number') {
    update.assists = (player.assists as number) + input.assistsDelta
  }
  if (typeof input.minutes === 'number') update.minutes = input.minutes
  if (typeof input.xG === 'number') update.xG = input.xG

  const nested: Record<string, unknown> = {}
  if (typeof input.fotmobId === 'number') nested.fotmobId = input.fotmobId
  if (input.clubForm) nested.clubForm = input.clubForm
  if (input.clubFormSource) nested.clubFormSource = input.clubFormSource
  if (input.recentClubMatches) nested.recentClubMatches = input.recentClubMatches
  if (input.recentTournamentMatches) nested.recentTournamentMatches = input.recentTournamentMatches

  if (Object.keys(update).length === 0 && Object.keys(nested).length === 0) {
    return {
      status: 'error' as const,
      message: 'Provide goals/assists/minutes/xG/clubForm or goalsDelta/assistsDelta to update',
    }
  }

  await db.collection('players').updateOne(
    { _id: player._id },
    { $set: { ...update, ...nested } }
  )

  const beforeGoals = player.goals as number
  const afterGoals = (update.goals ?? player.goals) as number
  const goalsAdded =
    typeof input.goalsDelta === 'number'
      ? input.goalsDelta
      : typeof input.goals === 'number'
        ? Math.max(0, input.goals - beforeGoals)
        : 0

  if (goalsAdded > 0) {
    import('@/lib/notifications')
      .then(({ notifyFavoritePlayerUpdate }) =>
        notifyFavoritePlayerUpdate({
          playerName: player.name as string,
          team: player.team as string,
          goals: afterGoals,
          goalsAdded,
        })
      )
      .catch((error) => console.error('Player alert emails failed:', error))
  }

  return {
    status: 'success' as const,
    player: {
      name: player.name,
      team: player.team,
      before: {
        goals: player.goals,
        assists: player.assists,
        minutes: player.minutes,
        xG: player.xG,
      },
      after: {
        goals: afterGoals,
        assists: update.assists ?? player.assists,
        minutes: update.minutes ?? player.minutes,
        xG: update.xG ?? player.xG,
      },
    },
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}