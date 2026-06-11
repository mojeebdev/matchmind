/**
 * FOX Sports power ranking of the 12 Americas teams at WC2026 (Jun 11, 2026).
 * Analyst: Melissa Ortiz
 * @see https://www.foxsports.com/stories/soccer/power-ranking-teams-from-americas-2026-world-cup
 */

export const FOX_AMERICAS_RANKINGS_ARTICLE_URL =
  'https://www.foxsports.com/stories/soccer/power-ranking-teams-from-americas-2026-world-cup'

export type FoxAmericasRanking = {
  rank: number
  team: string
  titleOdds: string
  headline: string
  summary: string
  darkHorse?: boolean
}

export const FOX_AMERICAS_POWER_RANKINGS: FoxAmericasRanking[] = [
  {
    rank: 1,
    team: 'Argentina',
    titleOdds: '+950',
    headline: 'Back-to-back contenders',
    summary:
      'Defending champions with most of the 2022 squad intact; Messi still leads though not at his Qatar peak. Talent depth remains the question for a repeat.',
  },
  {
    rank: 2,
    team: 'Brazil',
    titleOdds: '+950',
    headline: 'Talent to watch',
    summary:
      'Perennial powerhouse with explosive attacking options; Endrick among the breakout names to monitor on the global stage.',
  },
  {
    rank: 3,
    team: 'Colombia',
    titleOdds: '+4000',
    headline: 'Luis Díaz drives the attack',
    summary:
      'Technical, possession-minded side built around Bayern Munich winger Luis Díaz; defensive concentration and goalkeeping are potential weak spots.',
  },
  {
    rank: 4,
    team: 'Ecuador',
    titleOdds: '+8000',
    headline: 'Rising CONMEBOL force',
    summary:
      'Compact, physical side that has punched above its weight in recent cycles and can trouble bigger names in group play.',
  },
  {
    rank: 5,
    team: 'United States',
    titleOdds: '+6000',
    headline: 'Dark horse on home soil',
    darkHorse: true,
    summary:
      'Pochettino has blended culture with intensity; breakout striker Folarin Balogun, engine Weston McKennie, and left back Antonee Robinson are key, with Matt Freese a GK question mark.',
  },
  {
    rank: 6,
    team: 'Uruguay',
    titleOdds: '+6500',
    headline: 'Grit and experience',
    summary:
      'Always competitive with battle-tested core; veteran goalkeeper Fernando Muslera turns 40 during the tournament.',
  },
  {
    rank: 7,
    team: 'Mexico',
    titleOdds: '+6500',
    headline: 'Raúl Rangel in goal, Ochoa subplot',
    summary:
      'El Tri lean on young starter Raúl Rangel while 40-year-old Memo Ochoa remains a sentimental subplot on home soil.',
  },
  {
    rank: 8,
    team: 'Canada',
    titleOdds: '+20000',
    headline: 'Marsch\'s co-hosts',
    summary:
      'Jesse Marsch\'s high-press Canada have improved sharply but remain long shots for a deep run despite home advantage.',
  },
  {
    rank: 9,
    team: 'Paraguay',
    titleOdds: '+30000',
    headline: 'Organized underdog',
    summary:
      'Disciplined South American side that can frustrate opponents; limited firepower caps knockout upside.',
  },
  {
    rank: 10,
    team: 'Haiti',
    titleOdds: '+250000',
    headline: 'Historic debutants',
    summary:
      'First World Cup for Haiti — a feel-good story with modest expectations against the continent\'s giants.',
  },
  {
    rank: 11,
    team: 'Panama',
    titleOdds: '+100000',
    headline: '2018 returnees',
    summary:
      'Back on the global stage after 2018; physical CONCACAF side aiming to steal results rather than dominate possession.',
  },
  {
    rank: 12,
    team: 'Curaçao',
    titleOdds: '+250000',
    headline: 'Best vibes in the bracket',
    summary:
      'Debutantes with epic team energy; most of the squad is Netherlands-based and short on senior international minutes.',
  },
]

const RANK_BY_TEAM = new Map(FOX_AMERICAS_POWER_RANKINGS.map((entry) => [entry.team, entry]))

export function getFoxAmericasRanking(team: string): FoxAmericasRanking | undefined {
  return RANK_BY_TEAM.get(team)
}

export function getFoxAmericasMetaForTeam(team: string) {
  const entry = getFoxAmericasRanking(team)
  if (!entry) return {}
  return {
    foxAmericasRank: entry.rank,
    foxAmericasTitleOdds: entry.titleOdds,
    foxAmericasNote: entry.darkHorse ? `${entry.headline} — ${entry.summary}` : entry.summary,
  }
}

export function getFoxAmericasTournamentBundle() {
  return {
    source: FOX_AMERICAS_RANKINGS_ARTICLE_URL,
    updated: '2026-06-11',
    analyst: 'Melissa Ortiz',
    rankings: FOX_AMERICAS_POWER_RANKINGS,
    darkHorse: 'United States (+6000)',
    topContenders: 'Argentina (+950), Brazil (+950)',
  }
}