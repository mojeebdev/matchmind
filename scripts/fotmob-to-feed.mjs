import fs from 'fs'
import { resolve } from 'path'
import { getAllRosterNames } from '../lib/worldcup2026-squads.ts'
import {
  buildRosterIndex,
  mapFotmobTeamName,
  resolvePlayerName,
} from './fotmob-shared.mjs'

const SEASON = process.env.FOTMOB_SEASON ?? '24254'
const LEAGUE = process.env.FOTMOB_LEAGUE ?? '77'
const OUT = resolve(process.cwd(), process.argv[2] ?? 'data/sync/feed.json')

const STAT_SLUGS = {
  goals: 'goals',
  assists: 'goal_assist',
  minutes: 'mins_played',
  rating: 'rating',
  xG: 'expected_goals',
}

async function fetchStat(slug) {
  const url = `https://data.fotmob.com/stats/${LEAGUE}/season/${SEASON}/${slug}.json`
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
  })
  if (!r.ok) throw new Error(`FotMob ${slug}: ${r.status}`)
  return r.json()
}

function extractRows(data) {
  if (Array.isArray(data?.TopLists?.[0]?.StatList)) return data.TopLists[0].StatList
  if (Array.isArray(data)) return data
  return []
}

function emptyPlayer(resolved, team, fotmobId) {
  return {
    playerName: resolved,
    team,
    fotmobId,
    goals: 0,
    assists: 0,
    minutes: 0,
    xG: 0,
    rating: null,
  }
}

const rosterIndex = buildRosterIndex(getAllRosterNames())
const players = new Map()
const skipped = []

const statData = await Promise.all(
  Object.entries(STAT_SLUGS).map(async ([field, slug]) => [field, await fetchStat(slug)])
)

for (const [field, data] of statData) {
  for (const row of extractRows(data)) {
    const name = row.ParticipantName ?? row.name ?? row.participant?.name
    const teamRaw = row.TeamName ?? row.teamName ?? row.participant?.teamName
    const team = mapFotmobTeamName(teamRaw)
    const value = row.StatValue ?? row.stat?.value ?? row.value
    const fotmobId = row.ParticiantId ?? row.participant?.id
    if (!name || value == null) continue
    if (field !== 'minutes' && value === 0) continue

    const resolved = resolvePlayerName(name, rosterIndex)
    if (!resolved) {
      skipped.push({ name, team, field, value })
      continue
    }

    const key = resolved.toLowerCase()
    const cur = players.get(key) ?? emptyPlayer(resolved, team, fotmobId)
    if (fotmobId) cur.fotmobId = fotmobId

    if (field === 'rating') {
      cur.rating = Math.max(cur.rating ?? 0, value)
    } else if (field === 'xG') {
      cur.xG = Math.max(cur.xG, value)
    } else if (field === 'minutes') {
      cur.minutes = Math.max(cur.minutes, value)
    } else {
      cur[field] = Math.max(cur[field] ?? 0, value)
    }

    players.set(key, cur)
  }
}

const feedPlayers = [...players.values()]
  .filter((p) => p.minutes > 0 || p.goals > 0 || p.assists > 0)
  .map(({ fotmobId, rating, ...p }) => {
    const row = { ...p }
    if (rating != null) row.rating = Math.round(rating * 100) / 100
    if (fotmobId) row.fotmobId = fotmobId
    if (row.xG) row.xG = Math.round(row.xG * 100) / 100
    return row
  })
  .sort((a, b) => b.goals - a.goals || b.assists - a.assists || b.minutes - a.minutes)

const feed = {
  meta: {
    source: 'fotmob',
    note: `FotMob WC2026 league ${LEAGUE} season ${SEASON} — goals, assists, minutes, xG, rating`,
    fetchedAt: new Date().toISOString(),
    playerDataApi: 'https://www.fotmob.com/api/data/playerData?id={fotmobId}',
  },
  matches: [],
  players: feedPlayers,
}

fs.mkdirSync(resolve(OUT, '..'), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(feed, null, 2) + '\n')

console.log(`Wrote ${feedPlayers.length} players → ${OUT}`)
console.log(
  `Top: ${feedPlayers
    .slice(0, 5)
    .map((p) => `${p.playerName} ${p.goals}G/${p.assists}A ${p.minutes}min xG${p.xG}`)
    .join(', ')}`
)
if (skipped.length) {
  console.log(`Skipped ${skipped.length} unmapped FotMob names:`)
  for (const s of skipped.slice(0, 15)) console.log(`  - ${s.name} (${s.team}) ${s.field}=${s.value}`)
}