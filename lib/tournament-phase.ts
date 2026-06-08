export const WC2026_KICKOFF_ISO = '2026-06-11T00:00:00.000Z'
export const WC2026_KICKOFF_LABEL = '11 June 2026'

export const OFFICIAL_DATA_SOURCE =
  'Official FIFA data (Dec 2025 draw + published schedule)'

export const PREVIEW_DATA_SOURCE =
  'Preview mockup (illustrative scores & stats — official fixtures only)'

export const PREVIEW_DISCLOSURE =
  `Groups, fixtures, venues, and kickoff times match the official FIFA World Cup 2026 draw (${OFFICIAL_DATA_SOURCE}). ` +
  `Scores, standings, player tournament stats, and sample knockouts are illustrative preview mockup for demo UX — not real match results. ` +
  `Live synced results replace mockup data after kickoff on ${WC2026_KICKOFF_LABEL}.`

/**
 * Before kickoff: preview mockup dataset with clear labeling.
 * On/after kickoff: live MongoDB results (synced via npm run sync / admin agent).
 */
export function isPreviewMode(now: Date = new Date()): boolean {
  if (process.env.FORCE_TOURNAMENT_LIVE === 'true') return false
  if (process.env.FORCE_TOURNAMENT_PREVIEW === 'true') return true
  return now < new Date(WC2026_KICKOFF_ISO)
}

export function getTournamentDataMode(): 'preview' | 'live' {
  return isPreviewMode() ? 'preview' : 'live'
}