import { enrichSquadPlayer } from './player-enrichment'
import type { PlayerRecord, SquadRosterEntry } from './player-types'
import { WC2026_ROSTERS, getAllRosterNames } from './worldcup2026-squads'

export { getAllRosterNames }

const PREVIEW_TOP_SCORERS = new Set([
  'Lionel Messi', 'Lautaro Martínez', 'Kylian Mbappé', 'Harry Kane', 'Vinícius Jr.',
  'Bukayo Saka', 'Lamine Yamal', 'Christian Pulisic', 'Sadio Mané', 'Luis Díaz',
  'Cristiano Ronaldo', 'Rodrygo', 'Jamal Musiala', 'Patrik Schick',
])

const PREVIEW_STATS: Record<string, { goals: number; assists: number; xG: number; minutes: number }> = {
  'Lionel Messi': { goals: 3, assists: 4, xG: 2.8, minutes: 251 },
  'Lautaro Martínez': { goals: 4, assists: 1, xG: 3.1, minutes: 264 },
  'Kylian Mbappé': { goals: 5, assists: 2, xG: 4.2, minutes: 270 },
  'Harry Kane': { goals: 4, assists: 1, xG: 3.8, minutes: 270 },
  'Vinícius Jr.': { goals: 4, assists: 2, xG: 3.6, minutes: 268 },
  'Bukayo Saka': { goals: 3, assists: 2, xG: 2.2, minutes: 265 },
  'Lamine Yamal': { goals: 3, assists: 3, xG: 2.5, minutes: 255 },
  'Christian Pulisic': { goals: 3, assists: 2, xG: 2.3, minutes: 268 },
  'Sadio Mané': { goals: 3, assists: 1, xG: 2.4, minutes: 262 },
  'Luis Díaz': { goals: 3, assists: 2, xG: 2.5, minutes: 268 },
  'Cristiano Ronaldo': { goals: 2, assists: 1, xG: 1.9, minutes: 240 },
  'Rodrygo': { goals: 3, assists: 1, xG: 2.4, minutes: 255 },
  'Jamal Musiala': { goals: 2, assists: 2, xG: 1.8, minutes: 248 },
  'Patrik Schick': { goals: 2, assists: 1, xG: 1.6, minutes: 230 },
}

function teamGroup(team: string, groups: Record<string, string[]>): string {
  for (const [group, teams] of Object.entries(groups)) {
    if (teams.includes(team)) return group
  }
  return '?'
}

function rosterToEntry(team: string, tuple: (typeof WC2026_ROSTERS)[string][number]): SquadRosterEntry {
  return {
    name: tuple[0],
    team,
    position: tuple[1],
    age: tuple[2],
    club: tuple[3],
    squadNumber: tuple[4],
  }
}

export function buildFullSquads(
  groups: Record<string, string[]>,
  previewMode: boolean
): PlayerRecord[] {
  const players: PlayerRecord[] = []

  for (const [team, roster] of Object.entries(WC2026_ROSTERS)) {
    const group = teamGroup(team, groups)
    for (const tuple of roster) {
      const entry = rosterToEntry(team, tuple)
      let tournamentStats = { goals: 0, assists: 0, xG: 0, minutes: 0 }

      if (previewMode) {
        if (PREVIEW_STATS[entry.name]) {
          tournamentStats = PREVIEW_STATS[entry.name]
        } else if (!PREVIEW_TOP_SCORERS.has(entry.name)) {
          tournamentStats = { goals: 1, assists: 0, xG: 0.8, minutes: 180 }
        }
      }

      players.push(enrichSquadPlayer(entry, group, tournamentStats))
    }
  }

  return players.sort((a, b) => a.group.localeCompare(b.group) || a.team.localeCompare(b.team) || a.squadNumber - b.squadNumber)
}