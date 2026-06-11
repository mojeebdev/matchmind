import type { RosterTuple } from './player-types'
import { GROUP_A_SQUADS } from './squads/group-a'
import { GROUP_B_SQUADS } from './squads/group-b'
import { GROUP_C_SQUADS } from './squads/group-c'
import { GROUP_D_SQUADS } from './squads/group-d'
import { GROUP_E_SQUADS } from './squads/group-e'
import { GROUP_F_SQUADS } from './squads/group-f'
import { GROUP_G_SQUADS } from './squads/group-g'
import { GROUP_H_SQUADS } from './squads/group-h'
import { GROUP_I_SQUADS } from './squads/group-i'
import { GROUP_J_SQUADS } from './squads/group-j'
import { GROUP_K_SQUADS } from './squads/group-k'
import { GROUP_L_SQUADS } from './squads/group-l'
import { FIFA_SQUAD_SIZE } from './worldcup2026-official-fixtures'

/**
 * Tournament squads — Guardian WC2026 guide (48 × 26, Jun 2026).
 * United States roster is FOX Sports official (Jun 10 2026); all others from Guardian.
 * @see https://www.theguardian.com/football/2026/jun/06/world-cup-2026-squads-guide
 */
export const GUARDIAN_SQUADS_ARTICLE_URL =
  'https://www.theguardian.com/football/2026/jun/06/world-cup-2026-squads-guide'
export const WC2026_ROSTERS: Record<string, RosterTuple[]> = {
  ...GROUP_A_SQUADS,
  ...GROUP_B_SQUADS,
  ...GROUP_C_SQUADS,
  ...GROUP_D_SQUADS,
  ...GROUP_E_SQUADS,
  ...GROUP_F_SQUADS,
  ...GROUP_G_SQUADS,
  ...GROUP_H_SQUADS,
  ...GROUP_I_SQUADS,
  ...GROUP_J_SQUADS,
  ...GROUP_K_SQUADS,
  ...GROUP_L_SQUADS,
}

export const WC2026_SQUAD_SIZE = FIFA_SQUAD_SIZE

/** FOX Sports official USMNT 26-man roster (Jun 10, 2026). */
export const FOX_USMNT_ROSTER_ARTICLE_URL =
  'https://www.foxsports.com/stories/soccer/usmnt-world-cup-roster-2026-pulisic-mckennie-weah-adams'

/** Teams with published official tournament squads (not yet all 48). */
export const OFFICIAL_SQUAD_TEAMS = new Set(['United States'])

export function hasOfficialSquads(): boolean {
  return OFFICIAL_SQUAD_TEAMS.size === Object.keys(WC2026_ROSTERS).length
}

export function isOfficialSquadTeam(team: string): boolean {
  return OFFICIAL_SQUAD_TEAMS.has(team)
}

export function getAllRosterNames(): string[] {
  return Object.values(WC2026_ROSTERS).flatMap((roster) => roster.map((p) => p[0]))
}

export function getRosterTeamCount(): number {
  return Object.keys(WC2026_ROSTERS).length
}

export function getTotalPlayerCount(): number {
  return Object.values(WC2026_ROSTERS).reduce((sum, roster) => sum + roster.length, 0)
}