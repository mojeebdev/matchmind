import { loadEnvFiles } from '../lib/load-env.ts'
import { applyDnsFix } from '../lib/dns-fix.ts'
import { getMongoClient } from '../lib/mongodb.ts'

applyDnsFix()
loadEnvFiles()

const client = await getMongoClient()
const db = client.db('matchmind')
const t = await db.collection('tournament').findOne({})
const finished = await db.collection('matches').countDocuments({ status: 'finished' })
const scheduled = await db.collection('matches').countDocuments({ status: 'scheduled' })
const r32 = await db.collection('matches').countDocuments({ stage: 'round-of-32', status: 'finished' })
const group = await db.collection('matches').countDocuments({ stage: 'group', status: 'finished' })
const top = await db
  .collection('players')
  .find({ goals: { $gt: 0 } })
  .sort({ goals: -1 })
  .limit(5)
  .project({ name: 1, goals: 1, assists: 1, minutes: 1, xG: 1 })
  .toArray()

console.log('lastSyncedAt:', t?.lastSyncedAt ?? 'never')
console.log('lastSyncSource:', t?.lastSyncSource ?? '—')
console.log('dataMode:', t?.dataMode ?? '—')
console.log('DB matches finished:', finished, '| scheduled:', scheduled)
console.log('  group finished:', group, '| round-of-32 finished:', r32)
console.log('top scorers in DB:', top.map((p) => `${p.name} ${p.goals}G/${p.assists}A`).join(', '))
process.exit(0)