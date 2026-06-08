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

export function getAllRosterNames(): string[] {
  return Object.values(WC2026_ROSTERS).flatMap((roster) => roster.map((p) => p[0]))
}

export function getRosterTeamCount(): number {
  return Object.keys(WC2026_ROSTERS).length
}

export function getTotalPlayerCount(): number {
  return Object.values(WC2026_ROSTERS).reduce((sum, roster) => sum + roster.length, 0)
}