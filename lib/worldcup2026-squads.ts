import { OFFICIAL_GROUPS_2026, FIFA_SQUAD_SIZE } from './worldcup2026-official-fixtures'
import type { RosterTuple } from './player-types'

/** Official FIFA tournament squads are not published yet — no curated rosters. */
export const WC2026_ROSTERS: Record<string, RosterTuple[]> = Object.fromEntries(
  Object.values(OFFICIAL_GROUPS_2026)
    .flat()
    .map((team) => [team, [] as RosterTuple[]])
)

export const WC2026_SQUAD_SIZE = FIFA_SQUAD_SIZE

export function hasOfficialSquads(): boolean {
  return getTotalPlayerCount() > 0
}

export function getAllRosterNames(): string[] {
  return []
}

export function getRosterTeamCount(): number {
  return Object.keys(WC2026_ROSTERS).length
}

export function getTotalPlayerCount(): number {
  return 0
}