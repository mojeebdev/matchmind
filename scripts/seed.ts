import { loadEnvFiles } from '../lib/load-env'
import { applyDnsFix } from '../lib/dns-fix'
import { MongoClient } from 'mongodb'
import {
  WC2026_TEAMS,
  WC2026_PLAYERS,
  WC2026_MATCHES,
  WC2026_H2H,
  WC2026_TOURNAMENT,
  GROUPS_2026,
} from '../lib/worldcup2026-data'

applyDnsFix()
loadEnvFiles()

const CLIENT_OPTS = {
  serverSelectionTimeoutMS: 20000,
  connectTimeoutMS: 20000,
}

function getMongoUris(): string[] {
  const uris = [process.env.MONGODB_URI_DIRECT, process.env.MONGODB_URI].filter(
    (uri): uri is string => Boolean(uri?.trim())
  )
  return [...new Set(uris)]
}

function describeUri(uri: string): string {
  return uri.startsWith('mongodb+srv://') ? 'SRV (mongodb+srv)' : 'direct (mongodb://)'
}

function formatConnectionHelp(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  const labels =
    error instanceof Error && 'errorLabels' in error
      ? (error as { errorLabels?: Set<string> }).errorLabels
      : undefined
  const isHandshake =
    message.includes('closed') ||
    message.includes('Handshake') ||
    labels?.has('HandshakeError')

  const lines = [
    `Seed failed: ${message}`,
    '',
    'Troubleshooting:',
    '1. Atlas → Network Access → add your current IP (or 0.0.0.0/0 for hackathon dev)',
    '2. Atlas → Database Access → confirm user/password match .env',
    '3. Atlas → Connect → Drivers → copy the Standard connection string into MONGODB_URI_DIRECT',
  ]

  if (isHandshake) {
    lines.push(
      '4. HandshakeError usually means Atlas blocked your IP — update Network Access and retry'
    )
  } else if (message.includes('querySrv')) {
    lines.push('4. querySrv failed — set MONGODB_URI_DIRECT in .env (Standard URI from Atlas)')
  }

  return lines.join('\n')
}

async function connectMongo(): Promise<MongoClient> {
  const uris = getMongoUris()
  if (uris.length === 0) {
    console.error('MONGODB_URI or MONGODB_URI_DIRECT is required in .env')
    process.exit(1)
  }

  let lastError: unknown
  for (const uri of uris) {
    const client = new MongoClient(uri, CLIENT_OPTS)
    try {
      await client.connect()
      await client.db('admin').command({ ping: 1 })
      console.log(`Connected to MongoDB (${describeUri(uri)})`)
      return client
    } catch (error) {
      lastError = error
      console.warn(`[seed] ${describeUri(uri)} failed — trying next option if available`)
      await client.close().catch(() => undefined)
    }
  }

  console.error(formatConnectionHelp(lastError))
  process.exit(1)
}

async function seed() {
  const client = await connectMongo()
  try {

    const db = client.db('matchmind')

    await Promise.all([
      db.collection('teams').deleteMany({}),
      db.collection('players').deleteMany({}),
      db.collection('matches').deleteMany({}),
      db.collection('headToHead').deleteMany({}),
      db.collection('groups').deleteMany({}),
      db.collection('tournament').deleteMany({}),
    ])
    console.log('Cleared existing collections')

    const teamsResult = await db.collection('teams').insertMany(WC2026_TEAMS)
    console.log(`Seeded ${teamsResult.insertedCount} teams (12 groups A–L)`)

    const playersResult = await db.collection('players').insertMany(WC2026_PLAYERS)
    console.log(`Seeded ${playersResult.insertedCount} players`)

    const matchesResult = await db.collection('matches').insertMany(WC2026_MATCHES)
    console.log(`Seeded ${matchesResult.insertedCount} matches (72 group + knockouts)`)

    const h2hResult = await db.collection('headToHead').insertMany(WC2026_H2H)
    console.log(`Seeded ${h2hResult.insertedCount} head-to-head records`)

    const groupsDocs = Object.entries(GROUPS_2026).map(([group, teams]) => ({
      group,
      teams,
      teamCount: teams.length,
    }))
    await db.collection('groups').insertMany(groupsDocs)
    console.log(`Seeded ${groupsDocs.length} group definitions`)

    await db.collection('tournament').insertOne({
      ...WC2026_TOURNAMENT,
      seededAt: new Date(),
      collections: ['teams', 'players', 'matches', 'headToHead', 'groups'],
    })
    console.log('Seeded tournament metadata')

    console.log('\n✅ World Cup 2026 intelligence database ready!')
    console.log('   48 teams · 12 groups · squads · fixtures · H2H')
    console.log('   Ask the agent: "Who leads Group I?" or "Top scorers?"')
  } catch (error) {
    console.error(formatConnectionHelp(error))
    process.exit(1)
  } finally {
    await client.close()
  }
}

seed()