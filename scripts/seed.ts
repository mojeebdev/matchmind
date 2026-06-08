import { loadEnvFiles } from '../lib/load-env'
import { applyDnsFix } from '../lib/dns-fix'
import { MongoClient } from 'mongodb'
import { getSeedDataset, GROUPS_2026 } from '../lib/worldcup2026-data'
import { getHistoricalSeedData } from '../lib/worldcup-historical-data'


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
  const dataset = getSeedDataset()
  const historical = getHistoricalSeedData()
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
      db.collection('playerWorldCupCareers').deleteMany({}),
      db.collection('worldCupEditions').deleteMany({}),
      db.collection('worldCupRecords').deleteMany({}),
    ])
    console.log('Cleared existing collections')

    const teamsResult = await db.collection('teams').insertMany(dataset.teams)
    console.log(`Seeded ${teamsResult.insertedCount} teams (12 groups A–L)`)

    if (dataset.players.length > 0) {
      const playersResult = await db.collection('players').insertMany(dataset.players)
      console.log(`Seeded ${playersResult.insertedCount} players`)
    } else {
      console.log(
        'Skipped players collection — official FIFA tournament squads not published yet'
      )
    }

    const matchesResult = await db.collection('matches').insertMany(dataset.matches)
    const matchNote =
      dataset.tournament.dataMode === 'preview'
        ? '104 official fixtures · group scores mockup · knockouts scheduled'
        : '104 official fixtures — scheduled, no results'
    console.log(`Seeded ${matchesResult.insertedCount} matches (${matchNote})`)

    const h2hResult = await db.collection('headToHead').insertMany(dataset.h2h)
    console.log(`Seeded ${h2hResult.insertedCount} head-to-head records`)

    const groupsDocs = Object.entries(GROUPS_2026).map(([group, teams]) => ({
      group,
      teams,
      teamCount: teams.length,
    }))
    await db.collection('groups').insertMany(groupsDocs)
    console.log(`Seeded ${groupsDocs.length} group definitions`)

    const careersResult = await db
      .collection('playerWorldCupCareers')
      .insertMany(historical.playerWorldCupCareers)
    console.log(
      `Seeded ${careersResult.insertedCount} player World Cup career records (1930–2022)`
    )

    const editionsResult = await db
      .collection('worldCupEditions')
      .insertMany(historical.worldCupEditions)
    console.log(`Seeded ${editionsResult.insertedCount} World Cup edition summaries`)

    const recordsResult = await db
      .collection('worldCupRecords')
      .insertMany(historical.worldCupRecords)
    console.log(`Seeded ${recordsResult.insertedCount} all-time World Cup records`)

    await db.collection('tournament').insertOne({
      ...dataset.tournament,
      seededAt: new Date(),
      collections: [
        'teams',
        'players',
        'matches',
        'headToHead',
        'groups',
        'playerWorldCupCareers',
        'worldCupEditions',
        'worldCupRecords',
      ],
      historical: historical.meta,
    })
    console.log(`Seeded tournament metadata (${dataset.tournament.dataMode} mode)`)

    if (dataset.tournament.dataMode === 'preview') {
      console.log('\n✅ World Cup 2026 PREVIEW MOCKUP database ready!')
      console.log('   Official 104 fixtures · group scores mockup · squads pending FIFA')
      console.log('   Re-seed or sync after 11 Jun 2026 for live results')
      console.log('   Ask the agent: "What are the Group A fixtures?" or "Who won the 2022 World Cup?"')
    } else {
      console.log('\n✅ World Cup 2026 LIVE database ready!')
      console.log('   48 teams · 12 groups · 104 fixtures · H2H (squads pending FIFA)')
      console.log('   Run npm run sync after matches to update scores')
    }
  } catch (error) {
    console.error(formatConnectionHelp(error))
    process.exit(1)
  } finally {
    await client.close()
  }
}

seed()