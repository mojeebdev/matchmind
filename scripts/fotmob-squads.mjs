/**
 * Map all 48 WC squads → FotMob player IDs, optionally enrich via playerData API.
 *
 * Usage:
 *   npm run fotmob-squads
 *   npm run fotmob-squads -- --enrich
 *   npm run fotmob-squads -- --enrich --feed
 *   npm run fotmob-full
 *
 * Env:
 *   FOTMOB_ENRICH_DELAY_MS=150   pause between playerData calls
 *   FOTMOB_ENRICH_LIMIT=50       cap enrichments (testing)
 */

import fs from 'fs'
import { resolve } from 'path'
import { WC2026_ROSTERS } from '../lib/worldcup2026-squads.ts'
import {
  buildRosterIndex,
  fetchFotmobTeamIds,
  fetchPlayerData,
  fetchTeamSquad,
  parsePlayerEnrichment,
  resolvePlayerName,
  sleep,
} from './fotmob-shared.mjs'

const args = new Set(process.argv.slice(2))
const enrich = args.has('--enrich') || args.has('--feed')
const writeFeed = args.has('--feed')
const mapPath = resolve(process.cwd(), process.argv.find((a) => a.startsWith('--map='))?.split('=')[1] ?? 'data/sync/fotmob-id-map.json')
const feedPath = resolve(process.cwd(), process.argv.find((a) => a.startsWith('--out='))?.split('=')[1] ?? 'data/sync/feed.json')
const enrichDelay = Number(process.env.FOTMOB_ENRICH_DELAY_MS ?? 150)
const enrichLimit = process.env.FOTMOB_ENRICH_LIMIT ? Number(process.env.FOTMOB_ENRICH_LIMIT) : Infinity

const rosterTeams = Object.keys(WC2026_ROSTERS)
const teamIndexes = new Map()
for (const [team, roster] of Object.entries(WC2026_ROSTERS)) {
  teamIndexes.set(team, buildRosterIndex(roster.map((p) => p[0])))
}

console.log('Fetching FotMob team IDs from WC fixtures…')
const teamIds = await fetchFotmobTeamIds(rosterTeams)
console.log(`Resolved ${teamIds.size}/${rosterTeams.length} teams`)

const mapped = []
const unmapped = []
const duplicateIds = new Map()

for (const team of rosterTeams.sort()) {
  const fotmobTeamId = teamIds.get(team)
  if (!fotmobTeamId) {
    console.warn(`  ✗ No FotMob team id for ${team}`)
    continue
  }

  const squad = await fetchTeamSquad(fotmobTeamId)
  const rosterIndex = teamIndexes.get(team)

  for (const member of squad) {
    const resolved = resolvePlayerName(member.name, rosterIndex)
    if (!resolved) {
      unmapped.push({
        fotmobName: member.name,
        team,
        fotmobId: member.id,
        shirtNumber: member.shirtNumber ?? null,
      })
      continue
    }

    const entry = {
      playerName: resolved,
      team,
      fotmobId: member.id,
      fotmobUrl: `https://www.fotmob.com/players/${member.id}/${member.name.toLowerCase().replace(/\s+/g, '-')}`,
      squadGoals: member.goals ?? 0,
      squadAssists: member.assists ?? 0,
      squadRating: member.rating ?? null,
    }

    const prev = duplicateIds.get(member.id)
    if (prev && prev.playerName !== resolved) {
      console.warn(`  ! Duplicate FotMob id ${member.id}: ${prev.playerName} vs ${resolved}`)
    }
    duplicateIds.set(member.id, entry)
    mapped.push(entry)
  }

  console.log(`  ${team}: ${squad.length} squad → ${mapped.filter((p) => p.team === team).length} mapped`)
}

const idMap = {
  meta: {
    source: 'fotmob-squads',
    fetchedAt: new Date().toISOString(),
    teamsResolved: teamIds.size,
    playersMapped: mapped.length,
    playersUnmapped: unmapped.length,
    playerDataApi: 'https://www.fotmob.com/api/data/playerData?id={fotmobId}',
  },
  teams: [...teamIds.entries()].map(([team, fotmobTeamId]) => ({ team, fotmobTeamId })),
  players: mapped.sort((a, b) => a.team.localeCompare(b.team) || a.playerName.localeCompare(b.playerName)),
  unmapped,
}

fs.mkdirSync(resolve(mapPath, '..'), { recursive: true })
fs.writeFileSync(mapPath, JSON.stringify(idMap, null, 2) + '\n')
console.log(`\nWrote id map: ${mapped.length} players → ${mapPath}`)
if (unmapped.length) {
  console.log(`Unmapped ${unmapped.length} FotMob squad names (first 10):`)
  for (const u of unmapped.slice(0, 10)) console.log(`  - ${u.fotmobName} (${u.team})`)
}

if (!enrich && !writeFeed) {
  console.log('\nTip: npm run fotmob-squads -- --enrich --feed  for club form + match logs')
  process.exit(0)
}

if (!enrich && writeFeed) {
  const feedPlayers = mapped.map((p) => ({
    playerName: p.playerName,
    team: p.team,
    fotmobId: p.fotmobId,
    goals: p.squadGoals ?? 0,
    assists: p.squadAssists ?? 0,
    ...(p.squadRating != null ? { rating: p.squadRating } : {}),
  }))
  const feed = {
    meta: {
      source: 'fotmob-squads',
      note: 'FotMob squad APIs — tournament G/A/rating for full squads (no playerData enrich)',
      fetchedAt: new Date().toISOString(),
      players: feedPlayers.length,
    },
    matches: [],
    players: feedPlayers.sort((a, b) => b.goals - a.goals || b.assists - a.assists),
  }
  fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2) + '\n')
  console.log(`Wrote squad feed → ${feedPath} (${feedPlayers.length} players)`)
  process.exit(0)
}

const toEnrich = mapped.slice(0, enrichLimit)
console.log(`\nEnriching ${toEnrich.length} players via playerData (delay ${enrichDelay}ms)…`)

const enrichedByName = new Map()
let enrichOk = 0
let enrichFail = 0

for (let i = 0; i < toEnrich.length; i++) {
  const row = toEnrich[i]
  try {
    const data = await fetchPlayerData(row.fotmobId)
    const parsed = parsePlayerEnrichment(data)
    enrichedByName.set(row.playerName.toLowerCase(), {
      ...row,
      ...parsed,
      goals: parsed.tournament.goals || row.squadGoals,
      assists: parsed.tournament.assists || row.squadAssists,
      minutes: parsed.tournament.minutes,
      rating: parsed.tournament.rating ?? row.squadRating,
    })
    enrichOk++
    if ((i + 1) % 50 === 0) console.log(`  …${i + 1}/${toEnrich.length}`)
  } catch (err) {
    enrichFail++
    enrichedByName.set(row.playerName.toLowerCase(), {
      ...row,
      goals: row.squadGoals,
      assists: row.squadAssists,
      enrichError: String(err.message ?? err),
    })
  }
  if (i < toEnrich.length - 1) await sleep(enrichDelay)
}

const enrichPath = resolve(mapPath, '..', 'fotmob-enrich.json')
fs.writeFileSync(
  enrichPath,
  JSON.stringify(
    {
      meta: { ...idMap.meta, enrichOk, enrichFail, enrichedAt: new Date().toISOString() },
      players: [...enrichedByName.values()],
    },
    null,
    2
  ) + '\n'
)
console.log(`Wrote enrich cache → ${enrichPath} (${enrichOk} ok, ${enrichFail} failed)`)

if (!writeFeed) process.exit(0)

const feedPlayers = mapped.map((mappedRow) => {
  const p = enrichedByName.get(mappedRow.playerName.toLowerCase()) ?? {
    ...mappedRow,
    goals: mappedRow.squadGoals,
    assists: mappedRow.squadAssists,
    rating: mappedRow.squadRating,
  }
  const feedRow = {
    playerName: p.playerName,
    team: p.team,
    fotmobId: p.fotmobId,
    goals: p.goals ?? 0,
    assists: p.assists ?? 0,
  }
  if (p.minutes) feedRow.minutes = p.minutes
  if (p.rating != null) feedRow.rating = p.rating
  if (p.clubForm) {
    feedRow.clubForm = p.clubForm
    feedRow.clubFormSource = p.clubFormSource
  }
  if (p.recentClubMatches?.length) feedRow.recentClubMatches = p.recentClubMatches
  if (p.recentTournamentMatches?.length) feedRow.recentTournamentMatches = p.recentTournamentMatches
  return feedRow
})

const feed = {
  meta: {
    source: 'fotmob-squads',
    note: 'FotMob squad map + playerData enrichment (club form, match logs, tournament stats)',
    fetchedAt: new Date().toISOString(),
    players: feedPlayers.length,
  },
  matches: [],
  players: feedPlayers.sort((a, b) => b.goals - a.goals || b.assists - a.assists),
}

fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2) + '\n')
console.log(`Wrote feed → ${feedPath} (${feedPlayers.length} players)`)
console.log('Next: npm run validate-feed && SYNC_MODE=both npm run sync')