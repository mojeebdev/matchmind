import fs from 'fs'
import { resolve } from 'path'
import { FeedSchema } from '../lib/sync-runner.ts'
import { getAllRosterNames } from '../lib/worldcup2026-squads.ts'

const feedPath = resolve(process.cwd(), process.argv[2] ?? 'data/sync/feed.json')
const raw = JSON.parse(fs.readFileSync(feedPath, 'utf8'))
const feed = FeedSchema.parse(raw)
const roster = new Set(getAllRosterNames().map((n) => n.toLowerCase()))

const missing = []
const ok = []

for (const p of feed.players) {
  if (roster.has(p.playerName.toLowerCase())) {
    ok.push(p.playerName)
  } else {
    const fuzzy = [...roster].filter((n) => n.includes(p.playerName.split(' ').pop().toLowerCase()))
    missing.push({ name: p.playerName, suggestions: fuzzy.slice(0, 3) })
  }
}

console.log(`Feed: ${feedPath}`)
console.log(`Players in feed: ${feed.players.length}`)
console.log(`Matched roster: ${ok.length}`)
console.log(`Missing roster: ${missing.length}`)

if (missing.length) {
  console.log('\nFix these names (must match MongoDB seed exactly):')
  for (const m of missing) {
    console.log(`  ✗ ${m.name}${m.suggestions.length ? ` → try: ${m.suggestions.join(', ')}` : ''}`)
  }
  process.exit(1)
}

console.log('\n✓ All player names match roster — safe to run npm run sync')