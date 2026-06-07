export const WC2026_KICKOFF_ISO = '2026-06-11T00:00:00.000Z'
export const WC2026_KICKOFF_LABEL = '11 June 2026'

export const PREVIEW_DATA_SOURCE =
  'Preview mockup (illustrative — updates when World Cup kicks off)'

export const PREVIEW_DISCLOSURE =
  `Stats shown are illustrative preview mockup data stored in MongoDB for demo purposes. ` +
  `The tournament has not started yet — real results will replace this dataset after kickoff on ${WC2026_KICKOFF_LABEL}.`

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