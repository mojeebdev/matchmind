/**
 * Quick MongoDB connectivity check (optional local dev helper).
 *
 * Setup:
 *   cp scripts/test-mongo.example.ts scripts/test-mongo.ts
 *
 * Run:
 *   npx tsx scripts/test-mongo.ts
 */

import { loadEnvFiles } from '../lib/load-env'
import { applyDnsFix } from '../lib/dns-fix'
import { getMongoClient } from '../lib/mongodb'

loadEnvFiles()
applyDnsFix()

async function main() {
  const client = await getMongoClient()
  const count = await client.db('matchmind').collection('players').countDocuments()
  console.log('OK — players in DB:', count)
  await client.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('FAIL:', err)
  process.exit(1)
})