import { z } from 'zod'
import { updateMatchResult, updatePlayerStats } from './mongo-writes'
import { getMongoClient } from './mongodb'

export const MatchUpdateSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  homeScore: z.number().int().min(0),
  awayScore: z.number().int().min(0),
  status: z.enum(['scheduled', 'live', 'finished']).optional(),
})

export const PlayerUpdateSchema = z.object({
  playerName: z.string().min(1),
  goals: z.number().int().min(0).optional(),
  assists: z.number().int().min(0).optional(),
  goalsDelta: z.number().int().optional(),
  assistsDelta: z.number().int().optional(),
})

export const FeedSchema = z.object({
  matches: z.array(MatchUpdateSchema).default([]),
  players: z.array(PlayerUpdateSchema).default([]),
  meta: z
    .object({
      source: z.string().optional(),
      note: z.string().optional(),
    })
    .optional(),
})

export type SyncFeed = z.infer<typeof FeedSchema>

export type SyncApplyResult = {
  matchOk: number
  matchFail: number
  playerOk: number
  playerFail: number
  errors: string[]
}

async function stampSyncMetadata(source: string) {
  const client = await getMongoClient()
  const db = client.db('matchmind')
  await db.collection('tournament').updateOne(
    {},
    {
      $set: {
        lastSyncedAt: new Date(),
        lastSyncSource: source,
      },
    },
    { upsert: false }
  )
}

export async function applySyncFeed(
  feed: SyncFeed,
  dryRun = false
): Promise<SyncApplyResult> {
  let matchOk = 0
  let matchFail = 0
  let playerOk = 0
  let playerFail = 0
  const errors: string[] = []

  for (const match of feed.matches) {
    if (dryRun) {
      matchOk++
      continue
    }

    const result = await updateMatchResult(match)
    if (result.status === 'success') {
      matchOk++
    } else {
      matchFail++
      errors.push(`${match.homeTeam} vs ${match.awayTeam}: ${result.message}`)
    }
  }

  for (const player of feed.players) {
    if (dryRun) {
      playerOk++
      continue
    }

    const result = await updatePlayerStats(player)
    if (result.status === 'success') {
      playerOk++
    } else {
      playerFail++
      errors.push(`${player.playerName}: ${result.message}`)
    }
  }

  if (!dryRun && matchOk + playerOk > 0) {
    await stampSyncMetadata(feed.meta?.source ?? 'local-feed')
  }

  return { matchOk, matchFail, playerOk, playerFail, errors }
}