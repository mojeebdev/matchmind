import { GROUPS_2026 } from '@/lib/worldcup2026-data'

export const WORLD_CUP_TEAMS = Object.values(GROUPS_2026)
  .flat()
  .sort((a, b) => a.localeCompare(b))