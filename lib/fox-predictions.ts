/**
 * FOX Sports bold World Cup 2026 predictions (Jun 11, 2026).
 * Analysts: Doug McIntyre, Matteo Bonetti, Luis Miguel Echegaray, Laken Litman, Brian Sciaretta
 * @see https://www.foxsports.com/stories/soccer/world-cup-predictions-usmnt-spain-france-england-brazil-argentina
 */

export const FOX_PREDICTIONS_ARTICLE_URL =
  'https://www.foxsports.com/stories/soccer/world-cup-predictions-usmnt-spain-france-england-brazil-argentina'

export type FoxPredictionCategory =
  | 'bold_prediction'
  | 'golden_ball'
  | 'golden_boot'
  | 'golden_glove'
  | 'storyline'
  | 'breakout'
  | 'excited_to_watch'
  | 'champion'

export type FoxAnalystPick = {
  category: FoxPredictionCategory
  analyst: string
  headline: string
  summary: string
  team?: string
  player?: string
  odds?: string
}

const TEAM_ALIASES: Record<string, string> = {
  USA: 'United States',
  'Côte d\'Ivoire': 'Ivory Coast',
}

export const FOX_CHAMPION_PICKS: Array<{
  team: string
  analyst: string
  headline: string
  summary: string
  odds: string
}> = [
  {
    team: 'England',
    analyst: 'Luis Miguel Echegaray',
    headline: "It's Coming Home!",
    summary: 'Predicts England reach the final vs Spain and win the title.',
    odds: '+700',
  },
  {
    team: 'France',
    analyst: 'Matteo Bonetti',
    headline: 'Too Much Talent',
    summary: 'France avenges 2022 Qatar final with stacked squad and outrageous attacking talent.',
    odds: '+475',
  },
  {
    team: 'Argentina',
    analyst: 'Doug McIntyre',
    headline: 'Back-to-Back Champs?',
    summary: 'Messi & Co. tough to eliminate; U.S. venues reduce heat disadvantage vs European rivals.',
    odds: '+950',
  },
  {
    team: 'Spain',
    analyst: 'Laken Litman',
    headline: 'Second Star For La Roja',
    summary: 'Spain over Argentina in final — Messi (39) vs Yamal (19) as the marquee matchup.',
    odds: '+450',
  },
  {
    team: 'Spain',
    analyst: 'Brian Sciaretta',
    headline: 'Talent Prevails',
    summary: 'Spain beats France in a close final; best team wins on depth.',
    odds: '+450',
  },
]

export const FOX_BOLD_PREDICTIONS: FoxAnalystPick[] = [
  {
    category: 'bold_prediction',
    analyst: 'Doug McIntyre',
    team: 'United States',
    headline: 'USA Will Make Semis',
    summary:
      'Home soil, favorable draw, and improving form under Pochettino could match South Korea 2002, Türkiye 2002, or Morocco 2022.',
    odds: '+850 semis',
  },
  {
    category: 'bold_prediction',
    analyst: 'Laken Litman',
    team: 'United States',
    headline: 'Early Exit For USA',
    summary: 'Eliminated in Round of 16 — defensive issues and goalkeeper inexperience cap the run.',
    odds: '+220 lose in R16',
  },
  {
    category: 'bold_prediction',
    analyst: 'Luis Miguel Echegaray',
    team: 'Japan',
    headline: 'Japan To Make A Deep Run',
    summary: 'First-ever semifinal for cohesive, technically gifted Samurai Blue.',
    odds: '+1100 semis',
  },
  {
    category: 'bold_prediction',
    analyst: 'Brian Sciaretta',
    team: 'Canada',
    headline: 'Oh, Canada!',
    summary: 'Quarterfinal run as co-host; Marsch side improved since 2022 disappointment and Copa América semi.',
    odds: '+450 quarters',
  },
]

export const FOX_STORYLINES: FoxAnalystPick[] = [
  {
    category: 'storyline',
    analyst: 'Brian Sciaretta',
    team: 'United States',
    headline: 'Crowds And Legacy',
    summary: 'Will American enthusiasm match 1994 and accelerate soccer growth for the next generation?',
  },
  {
    category: 'storyline',
    analyst: 'Luis Miguel Echegaray',
    team: 'Brazil',
    headline: "Brazil Eyes To Break Drought",
    summary: 'Can Ancelotti end 24-year wait for a sixth star? Opens vs Morocco.',
    odds: '+950 title',
  },
  {
    category: 'storyline',
    analyst: 'Matteo Bonetti',
    headline: 'Last Dance For Legends',
    summary: 'Messi, Ronaldo, and Neymar in twilight — Messi best poised; Ronaldo start debated; Neymar rotation role.',
  },
  {
    category: 'storyline',
    analyst: 'Doug McIntyre',
    team: 'Mexico',
    headline: 'Eyes On Mexico And Canada',
    summary: 'Azteca hosts a third World Cup; Canada seeks first-ever win starting in Toronto vs Bosnia.',
  },
  {
    category: 'storyline',
    analyst: 'Laken Litman',
    headline: 'A New In-Game Wrinkle',
    summary: 'FIFA water breaks in summer heat may become tactical timeouts — some coaches criticize flow disruption.',
  },
]

export const FOX_PLAYER_PICKS: FoxAnalystPick[] = [
  // Golden Ball
  {
    category: 'golden_ball',
    analyst: 'Matteo Bonetti',
    player: 'Kylian Mbappé',
    team: 'France',
    headline: 'Golden Ball',
    summary: 'Electrifying in 2022; leads tournament favorite after 42 goals in 44 Real Madrid games.',
    odds: '+900',
  },
  {
    category: 'golden_ball',
    analyst: 'Luis Miguel Echegaray',
    player: 'Lamine Yamal',
    team: 'Spain',
    headline: 'Golden Ball',
    summary: 'Fit for opener vs Cape Verde; expected to deliver on biggest stage.',
    odds: '+800',
  },
  {
    category: 'golden_ball',
    analyst: 'Doug McIntyre',
    player: 'Lamine Yamal',
    team: 'Spain',
    headline: 'Golden Ball',
    summary: 'Arguably best player in the world at 18; Euro 2024 sem winner vs France.',
    odds: '+800',
  },
  {
    category: 'golden_ball',
    analyst: 'Laken Litman',
    player: 'Lamine Yamal',
    team: 'Spain',
    headline: 'Golden Ball',
    summary: 'Will light up tournament once back from hamstring recovery.',
    odds: '+800',
  },
  {
    category: 'golden_ball',
    analyst: 'Brian Sciaretta',
    player: 'Erling Haaland',
    team: 'Norway',
    headline: 'Golden Ball',
    summary: 'First major tournament; motivated with Ødegaard, Sørloth, Nusa supporting.',
    odds: '+2800',
  },
  // Golden Boot
  {
    category: 'golden_boot',
    analyst: 'Matteo Bonetti',
    player: 'Harry Kane',
    team: 'England',
    headline: 'Golden Boot',
    summary: 'Most clinical finisher in the world; weak defenses in 48-team format.',
    odds: '+700',
  },
  {
    category: 'golden_boot',
    analyst: 'Luis Miguel Echegaray',
    player: 'Harry Kane',
    team: 'England',
    headline: 'Golden Boot',
    summary: 'Repeats 2018 Golden Boot; favorable Group L path.',
    odds: '+700',
  },
  {
    category: 'golden_boot',
    analyst: 'Brian Sciaretta',
    player: 'Mikel Oyarzabal',
    team: 'Spain',
    headline: 'Golden Boot',
    summary: '12 goals in 12 games in 2025–26; scored in six straight for Spain.',
    odds: '+1100',
  },
  {
    category: 'golden_boot',
    analyst: 'Doug McIntyre',
    player: 'Kylian Mbappé',
    team: 'France',
    headline: 'Golden Boot',
    summary: '.86 goals/game at World Cups (tied with Pelé); deeper run than Kane expected.',
    odds: '+600',
  },
  {
    category: 'golden_boot',
    analyst: 'Laken Litman',
    player: 'Kylian Mbappé',
    team: 'France',
    headline: 'Golden Boot',
    summary: 'Magic on biggest stage regardless of club season end.',
    odds: '+600',
  },
  // Golden Glove
  {
    category: 'golden_glove',
    analyst: 'Brian Sciaretta',
    player: 'Unai Simón',
    team: 'Spain',
    headline: 'Golden Glove',
    summary: 'Nations League and Euro 2024 hero; momentum too strong.',
    odds: '+450',
  },
  {
    category: 'golden_glove',
    analyst: 'Luis Miguel Echegaray',
    player: 'Unai Simón',
    team: 'Spain',
    headline: 'Golden Glove',
    summary: 'Shot-stopping and distribution; Spain deep run favors him.',
    odds: '+450',
  },
  {
    category: 'golden_glove',
    analyst: 'Laken Litman',
    player: 'Unai Simón',
    team: 'Spain',
    headline: 'Golden Glove',
    summary: 'Best team in tournament; proven on big stages.',
    odds: '+450',
  },
  {
    category: 'golden_glove',
    analyst: 'Matteo Bonetti',
    player: 'Mike Maignan',
    team: 'France',
    headline: 'Golden Glove',
    summary: 'World-class reflexes and distribution behind imposing French defense.',
    odds: '+600',
  },
  {
    category: 'golden_glove',
    analyst: 'Doug McIntyre',
    player: 'Mike Maignan',
    team: 'France',
    headline: 'Golden Glove',
    summary: 'France expected to reach semis; upgrade on Hugo Lloris.',
    odds: '+600',
  },
  // Breakout
  {
    category: 'breakout',
    analyst: 'Luis Miguel Echegaray',
    player: 'Gilberto Mora',
    team: 'Mexico',
    headline: 'Breakout Player',
    summary: 'Youngest El Tri player ever at 17; game-changer for quinto partido curse.',
    odds: '+3500 young player',
  },
  {
    category: 'breakout',
    analyst: 'Matteo Bonetti',
    player: 'Yan Diomande',
    team: 'Ivory Coast',
    headline: 'Breakout Player',
    summary: '19-year-old RB Leipzig winger — 13 goals, 10 assists this season.',
    odds: '+2000 young player',
  },
  {
    category: 'breakout',
    analyst: 'Doug McIntyre',
    player: 'Ismaël Koné',
    team: 'Canada',
    headline: 'Breakout Player',
    summary: 'Strong Sassuolo season; central to Canada first win and knockout push.',
  },
  {
    category: 'breakout',
    analyst: 'Brian Sciaretta',
    player: 'Ayyoub Bouaddi',
    team: 'Morocco',
    headline: 'Breakout Player',
    summary: '18-year-old Lille DM switched to Morocco; Champions League star vs Real Madrid.',
  },
  {
    category: 'breakout',
    analyst: 'Laken Litman',
    player: 'Sebastian Berhalter',
    team: 'United States',
    headline: 'Breakout Player',
    summary: 'Pochettino favorite for grit and set-piece delivery at key moments.',
  },
  // Excited to watch (beyond Messi/Ronaldo)
  {
    category: 'excited_to_watch',
    analyst: 'Luis Miguel Echegaray',
    player: 'Luis Díaz',
    team: 'Colombia',
    headline: 'Excited To Watch',
    summary: 'Colombia feels like home team in U.S.; Díaz never freer on the pitch.',
    odds: '+6500 golden ball',
  },
  {
    category: 'excited_to_watch',
    analyst: 'Laken Litman',
    player: 'Christian Pulisic',
    team: 'United States',
    headline: 'Excited To Watch',
    summary: 'His moment on home soil — legacy on the line after finding form vs Senegal.',
    odds: '+10000 golden ball',
  },
  {
    category: 'excited_to_watch',
    analyst: 'Brian Sciaretta',
    player: 'Christian Pulisic',
    team: 'United States',
    headline: 'Excited To Watch',
    summary: 'Most accomplished USMNT club player; scoring drought ended May 31 vs Senegal.',
    odds: '+10000 golden ball',
  },
  {
    category: 'excited_to_watch',
    analyst: 'Doug McIntyre',
    player: 'Lamine Yamal',
    team: 'Spain',
    headline: 'Excited To Watch',
    summary: 'First World Cup for Yamal — where stars become icons.',
    odds: '+800 golden ball',
  },
  {
    category: 'excited_to_watch',
    analyst: 'Matteo Bonetti',
    player: 'Michael Olise',
    team: 'France',
    headline: 'Excited To Watch',
    summary: 'Unstoppable left-foot curler at Bayern; finds angles that should not exist.',
    odds: '+900 golden ball',
  },
]

const PLAYER_ALIASES: Record<string, string[]> = {
  'Kylian Mbappé': ['Kylian Mbappe'],
  'Lamine Yamal': ['Lamine Yamal'],
  'Ismaël Koné': ['Ismael Kone'],
  'Unai Simón': ['Unai Simon'],
  'Mikel Oyarzabal': ['Mikel Oyarzabal'],
  'Mike Maignan': ['Mike Maignan'],
  'Christian Pulisic': ['Christian Pulisic'],
  'Gilberto Mora': ['Gilberto Mora'],
  'Michael Olise': ['Michael Olise'],
  'Ayyoub Bouaddi': ['Ayyoub Bouaddi'],
  'Sebastian Berhalter': ['Sebastian Berhalter'],
  'Yan Diomande': ['Yan Diomande'],
}

function normalizePlayerName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function mapTeam(team: string): string {
  return TEAM_ALIASES[team] ?? team
}

const PLAYER_PICK_LOOKUP = new Map<string, FoxAnalystPick[]>()

for (const pick of FOX_PLAYER_PICKS) {
  if (!pick.player || !pick.team) continue
  const team = mapTeam(pick.team)
  const names = [pick.player, ...(PLAYER_ALIASES[pick.player] ?? [])]
  for (const n of names) {
    const key = `${team}|${normalizePlayerName(n)}`
    const existing = PLAYER_PICK_LOOKUP.get(key) ?? []
    existing.push(pick)
    PLAYER_PICK_LOOKUP.set(key, existing)
  }
}

const CATEGORY_LABELS: Record<FoxPredictionCategory, string> = {
  bold_prediction: 'Bold prediction',
  golden_ball: 'Golden Ball pick',
  golden_boot: 'Golden Boot pick',
  golden_glove: 'Golden Glove pick',
  storyline: 'Storyline',
  breakout: 'Breakout pick',
  excited_to_watch: 'Excited to watch',
  champion: 'Champion pick',
}

export function getFoxPlayerPredictions(
  playerName: string,
  team: string
): FoxAnalystPick[] {
  const mappedTeam = mapTeam(team)
  return (
    PLAYER_PICK_LOOKUP.get(`${mappedTeam}|${normalizePlayerName(playerName)}`) ??
    PLAYER_PICK_LOOKUP.get(normalizePlayerName(playerName))?.filter(
      (p) => p.team && mapTeam(p.team) === mappedTeam
    ) ??
    []
  )
}

export function getFoxPredictionMeta(
  playerName: string,
  team: string
): {
  foxPredictions?: string[]
  foxPredictionNote?: string
} {
  const picks = getFoxPlayerPredictions(playerName, team)
  if (picks.length === 0) return {}

  const tags = [...new Set(picks.map((p) => CATEGORY_LABELS[p.category]))]
  const note = picks
    .map((p) => {
      const odds = p.odds ? ` (${p.odds})` : ''
      return `${CATEGORY_LABELS[p.category]} — ${p.analyst}: ${p.summary}${odds}`
    })
    .join(' | ')

  return { foxPredictions: tags, foxPredictionNote: note }
}

export function getFoxChampionPicksForTeam(team: string): typeof FOX_CHAMPION_PICKS {
  return FOX_CHAMPION_PICKS.filter((p) => mapTeam(p.team) === mapTeam(team))
}

export function getFoxBoldPredictionsForTeam(team: string): FoxAnalystPick[] {
  return FOX_BOLD_PREDICTIONS.filter((p) => p.team && mapTeam(p.team) === mapTeam(team))
}

export function getFoxStorylinesForTeam(team: string): FoxAnalystPick[] {
  return FOX_STORYLINES.filter((p) => !p.team || mapTeam(p.team) === mapTeam(team))
}

/** Tournament-level bundle for MongoDB seed + agent context */
export function getFoxTournamentPredictions() {
  return {
    source: FOX_PREDICTIONS_ARTICLE_URL,
    updated: '2026-06-11',
    analysts: ['Doug McIntyre', 'Matteo Bonetti', 'Luis Miguel Echegaray', 'Laken Litman', 'Brian Sciaretta'],
    championPicks: FOX_CHAMPION_PICKS,
    boldPredictions: FOX_BOLD_PREDICTIONS,
    storylines: FOX_STORYLINES,
    playerPicks: FOX_PLAYER_PICKS,
    consensus: {
      champion: 'Spain (+450) — two analysts; France (+475) one; England (+700) one; Argentina (+950) one',
      goldenBall: 'Lamine Yamal (+800) and Kylian Mbappé (+900)',
      goldenBoot: 'Kylian Mbappé (+600) and Harry Kane (+700)',
      goldenGlove: 'Unai Simón (+450)',
    },
  }
}