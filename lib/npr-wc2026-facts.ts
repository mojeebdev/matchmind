/**
 * NPR World Cup 2026 facts and figures (Jun 11, 2026).
 * Author: Juliana Kim
 * @see https://www.npr.org/2026/06/11/nx-s1-5851670/world-cup-2026-guide-players
 */

export const NPR_WC2026_FACTS_ARTICLE_URL =
  'https://www.npr.org/2026/06/11/nx-s1-5851670/world-cup-2026-guide-players'

export type NprWorldCupFact = {
  category: 'players' | 'teams' | 'history' | 'records' | 'tournament'
  title: string
  summary: string
  highlight?: string
  relatedPlayers?: string[]
  relatedTeams?: string[]
}

export const NPR_WC2026_FACTS: NprWorldCupFact[] = [
  {
    category: 'tournament',
    title: 'Scale of WC2026',
    summary:
      'A record 48 nations and 1,248 players (48 × 26) make this the largest World Cup ever staged.',
    highlight: '48 teams · 1,248 players',
  },
  {
    category: 'players',
    title: 'Oldest player',
    summary:
      'Scotland goalkeeper Craig Gordon, 43, is the oldest footballer at the 2026 World Cup and the second-oldest in tournament history.',
    highlight: 'Craig Gordon, 43',
    relatedPlayers: ['Craig Gordon'],
    relatedTeams: ['Scotland'],
  },
  {
    category: 'players',
    title: 'Quadragenarians',
    summary:
      'Seven players are in their 40s as of June 11. Cristiano Ronaldo (41) is the second-oldest; Luka Modrić and Guillermo Ochoa are 40; Uruguay\'s Fernando Muslera turns 40 on June 16.',
    highlight: '7 players aged 40+',
    relatedPlayers: ['Cristiano Ronaldo', 'Luka Modrić', 'Guillermo Ochoa', 'Fernando Muslera'],
    relatedTeams: ['Portugal', 'Croatia', 'Mexico', 'Uruguay'],
  },
  {
    category: 'players',
    title: 'Youngest player',
    summary:
      'Mexico\'s Gilberto Mora, 17, is the youngest at WC2026 and the youngest ever to represent Mexico at a World Cup — still about six months older than Norman Whiteside (1982), the youngest ever at a World Cup.',
    highlight: 'Gilberto Mora, 17',
    relatedPlayers: ['Gilberto Mora'],
    relatedTeams: ['Mexico'],
  },
  {
    category: 'teams',
    title: 'Team USA history',
    summary:
      'The U.S. has appeared 12 times, including a third-place finish at the inaugural 1930 World Cup (13 teams). Best modern run: 2002 quarterfinals (beat Portugal and Mexico, lost to Germany, finished 8th). 2022: eliminated by Netherlands 3-1 in the Round of 16 (14th place).',
    highlight: 'Best run: 2002 quarterfinals',
    relatedTeams: ['United States'],
  },
  {
    category: 'history',
    title: 'Most common scoreline',
    summary:
      'Across all World Cups, 182 matches — roughly one-fifth — have ended 1-0. The second-most common result is 2-1.',
    highlight: '1-0 (182 games)',
  },
  {
    category: 'history',
    title: 'Highest-scoring match',
    summary:
      'Hungary\'s 10-1 win over El Salvador in 1982 is among the rarest scorelines and the most goals in a single World Cup match.',
    highlight: 'Hungary 10-1 El Salvador (1982)',
    relatedTeams: ['Hungary', 'El Salvador'],
  },
  {
    category: 'records',
    title: 'Most red cards by nation',
    summary:
      'Brazil have received 11 red cards across nine different World Cup matches since 1930; their last was in 2010.',
    highlight: 'Brazil: 11 reds',
    relatedTeams: ['Brazil'],
  },
  {
    category: 'records',
    title: 'Two reds in a career',
    summary:
      'Only Rigobert Song (Cameroon) and Zinedine Zidane (France) have been sent off twice at the World Cup. Zidane\'s 2006 final headbutt on Marco Materazzi is the most infamous.',
    highlight: 'Song & Zidane — 2 reds each',
    relatedPlayers: ['Rigobert Song', 'Zinedine Zidane'],
    relatedTeams: ['Cameroon', 'France'],
  },
  {
    category: 'records',
    title: 'Most-represented club',
    summary:
      'Manchester City supply 19 players across 12 national teams on three continents: Algeria, Belgium, Croatia, Egypt, England, France, Ghana, Netherlands, Norway, Portugal, Spain, and Uzbekistan.',
    highlight: 'Man City: 19 players',
    relatedTeams: [
      'Algeria', 'Belgium', 'Croatia', 'Egypt', 'England', 'France',
      'Ghana', 'Netherlands', 'Norway', 'Portugal', 'Spain', 'Uzbekistan',
    ],
  },
]

export function getNprWorldCupFactsBundle() {
  return {
    source: NPR_WC2026_FACTS_ARTICLE_URL,
    updated: '2026-06-11',
    author: 'Juliana Kim',
    facts: NPR_WC2026_FACTS,
    quickHits: [
      'Oldest: Craig Gordon (Scotland), 43',
      'Youngest: Gilberto Mora (Mexico), 17',
      'Most common score: 1-0 (182 all-time WC games)',
      'Most club reps: Manchester City (19 players, 12 nations)',
      'USA best finish: 3rd in 1930; best modern run 2002 QF',
    ],
  }
}