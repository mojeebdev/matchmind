import { sendCountryMatchAlert, sendFavoritePlayerAlert } from '@/lib/emails'
import { getDb } from '@/lib/mongodb-client'
import type { AppUser } from '@/lib/users'

type AlertUser = Pick<AppUser, 'email' | 'profile'>

async function getUsersForCountryAlert(team: string) {
  const db = await getDb()
  return db
    .collection<AlertUser>('users')
    .find({
      'profile.supportedCountry': team,
      'profile.onboardingComplete': true,
      'profile.emailAlerts': { $ne: false },
      'profile.alertSupportedCountry': { $ne: false },
      email: { $exists: true },
    })
    .toArray()
}

async function getUsersForPlayerAlert(playerName: string) {
  const db = await getDb()
  const escaped = playerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return db
    .collection<AlertUser>('users')
    .find({
      'profile.favoritePlayer': { $regex: new RegExp(`^${escaped}$`, 'i') },
      'profile.onboardingComplete': true,
      'profile.emailAlerts': { $ne: false },
      'profile.alertFavoritePlayer': { $ne: false },
      email: { $exists: true },
    })
    .toArray()
}

export async function notifySupportedCountryMatchResult(input: {
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
}) {
  const teams = [input.homeTeam, input.awayTeam]

  for (const team of teams) {
    const users = await getUsersForCountryAlert(team)
    await Promise.allSettled(
      users.map((user) =>
        sendCountryMatchAlert({
          to: user.email,
          username: user.profile.username || user.profile.displayName || 'fan',
          team,
          homeTeam: input.homeTeam,
          awayTeam: input.awayTeam,
          homeScore: input.homeScore,
          awayScore: input.awayScore,
        })
      )
    )
  }
}

export async function notifyFavoritePlayerUpdate(input: {
  playerName: string
  team: string
  goals: number
  goalsAdded: number
}) {
  if (input.goalsAdded <= 0) return

  const users = await getUsersForPlayerAlert(input.playerName)
  await Promise.allSettled(
    users.map((user) =>
      sendFavoritePlayerAlert({
        to: user.email,
        username: user.profile.username || user.profile.displayName || 'fan',
        playerName: input.playerName,
        team: input.team,
        goals: input.goals,
        goalsAdded: input.goalsAdded,
      })
    )
  )
}