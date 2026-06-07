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

export async function updateMatchResult(input: {
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status?: 'scheduled' | 'live' | 'finished'
}) {
  const client = await getMongoClient()
  const db = client.db('matchmind')

  const match = await db.collection('matches').findOne({
    homeTeam: input.homeTeam,
    awayTeam: input.awayTeam,
  })

  if (!match) {
    const swapped = await db.collection('matches').findOne({
      homeTeam: input.awayTeam,
      awayTeam: input.homeTeam,
    })
    if (!swapped) {
      return {
        status: 'error' as const,
        message: `No match found for ${input.homeTeam} vs ${input.awayTeam}`,
      }
    }
    return {
      status: 'error' as const,
      message: `Match exists as ${input.awayTeam} (home) vs ${input.homeTeam} (away). Use that home/away order.`,
    }
  }

  const previous = match.score as { home: number; away: number }
  await db.collection('matches').updateOne(
    { _id: match._id },
    {
      $set: {
        score: { home: input.homeScore, away: input.awayScore },
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
        homeTeam: input.homeTeam,
        awayTeam: input.awayTeam,
        homeScore: input.homeScore,
        awayScore: input.awayScore,
      })
    )
    .catch((error) => console.error('Match alert emails failed:', error))

  return {
    status: 'success' as const,
    match: {
      homeTeam: input.homeTeam,
      awayTeam: input.awayTeam,
      previousScore: previous,
      newScore: { home: input.homeScore, away: input.awayScore },
      group: match.group ?? null,
      stage: match.stage,
    },
    standings,
  }
}

export async function updatePlayerStats(input: {
  playerName: string
  goals?: number
  assists?: number
  goalsDelta?: number
  assistsDelta?: number
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

  if (Object.keys(update).length === 0) {
    return {
      status: 'error' as const,
      message: 'Provide goals/assists or goalsDelta/assistsDelta to update',
    }
  }

  await db.collection('players').updateOne({ _id: player._id }, { $set: update })

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
      before: { goals: player.goals, assists: player.assists },
      after: {
        goals: afterGoals,
        assists: update.assists ?? player.assists,
      },
    },
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}