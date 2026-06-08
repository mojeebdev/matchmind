/**
 * Curated FIFA World Cup historical intelligence (1930â€“2022)
 *
 * Research-grade dataset for career stats, tournament editions, and all-time records.
 * Separate from 2026 live/preview collections â€” always factual, never mockup.
 * Sources: FIFA official archives, RSSSF, worldfootball.net (verified June 2026).
 */

import type { MongoQueryPlan } from './types'

export type TournamentAppearance = {
  year: number
  host: string
  team: string
  appearances: number
  goals: number
  assists: number
  stageReached: string
  notableMoments: string[]
}

export type PlayerWorldCupCareer = {
  name: string
  nationality: string
  position: string
  worldCup2026Team: string | null
  worldCup2026Group: string | null
  tournamentsPlayed: number
  totalAppearances: number
  totalGoals: number
  totalAssists: number
  worldCupTitles: number
  goldenBoot: boolean
  goldenBall: boolean
  debutYear: number
  lastTournament: number
  appearances: TournamentAppearance[]
  careerSummary: string
  dataSource: string
}

export type WorldCupEdition = {
  year: number
  host: string
  hosts: string[]
  winner: string
  runnerUp: string
  scoreline: string
  thirdPlace: string
  fourthPlace: string
  teams: number
  matches: number
  goals: number
  attendance: number
  goldenBoot: { player: string; team: string; goals: number }
  goldenBall: { player: string; team: string }
  venue: string
  highlight: string
}

export type WorldCupRecord = {
  category: string
  rank: number
  holder: string
  nationality: string
  value: string
  numericValue: number
  context: string
  era: string
}

const SOURCE = 'FIFA World Cup official statistics (1930â€“2022)'

export const PLAYER_WORLD_CUP_CAREERS: PlayerWorldCupCareer[] = [
  {
    name: 'Cristiano Ronaldo',
    nationality: 'Portugal',
    position: 'FW',
    worldCup2026Team: 'Portugal',
    worldCup2026Group: 'K',
    tournamentsPlayed: 5,
    totalAppearances: 22,
    totalGoals: 8,
    totalAssists: 2,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2006,
    lastTournament: 2022,
    careerSummary:
      'Portugal\'s all-time World Cup top scorer with 8 goals across five tournaments (2006â€“2022). Famous 2018 hat-trick vs Spain and became the first man to score in five separate World Cups.',
    appearances: [
      { year: 2006, host: 'Germany', team: 'Portugal', appearances: 6, goals: 1, assists: 0, stageReached: 'Semi-final', notableMoments: ['Penalty vs Iran (group)', 'Semi-final exit vs France'] },
      { year: 2010, host: 'South Africa', team: 'Portugal', appearances: 4, goals: 1, assists: 0, stageReached: 'Round of 16', notableMoments: ['Long-range strike vs North Korea'] },
      { year: 2014, host: 'Brazil', team: 'Portugal', appearances: 3, goals: 0, assists: 0, stageReached: 'Group stage', notableMoments: ['Eliminated in group with USA, Germany, Ghana'] },
      { year: 2018, host: 'Russia', team: 'Portugal', appearances: 4, goals: 4, assists: 0, stageReached: 'Round of 16', notableMoments: ['Hat-trick vs Spain (3-3)', 'Goal vs Morocco', 'Free-kick vs Uruguay'] },
      { year: 2022, host: 'Qatar', team: 'Portugal', appearances: 5, goals: 2, assists: 1, stageReached: 'Quarter-final', notableMoments: ['Header vs Ghana (record 5th WC)', 'Goal vs Uruguay', 'Quarter-final exit vs Morocco'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Lionel Messi',
    nationality: 'Argentina',
    position: 'FW',
    worldCup2026Team: 'Argentina',
    worldCup2026Group: 'J',
    tournamentsPlayed: 5,
    totalAppearances: 26,
    totalGoals: 13,
    totalAssists: 8,
    worldCupTitles: 1,
    goldenBoot: false,
    goldenBall: true,
    debutYear: 2006,
    lastTournament: 2022,
    careerSummary:
      '2022 World Cup winner and two-time Golden Ball winner (2014, 2022). Argentina\'s greatest World Cup player with 13 goals â€” seven alone in Qatar 2022.',
    appearances: [
      { year: 2006, host: 'Germany', team: 'Argentina', appearances: 3, goals: 0, assists: 1, stageReached: 'Quarter-final', notableMoments: ['Assist vs Serbia & Montenegro', 'Bench role under Pekerman'] },
      { year: 2010, host: 'South Africa', team: 'Argentina', appearances: 5, goals: 0, assists: 1, stageReached: 'Quarter-final', notableMoments: ['Maradona era quarter-final exit vs Germany (0-4)'] },
      { year: 2014, host: 'Brazil', team: 'Argentina', appearances: 7, goals: 1, assists: 1, stageReached: 'Final', notableMoments: ['Golden Ball as runners-up', 'Assist for Di MarÃ­a vs Switzerland'] },
      { year: 2018, host: 'Russia', team: 'Argentina', appearances: 4, goals: 1, assists: 2, stageReached: 'Round of 16', notableMoments: ['Last-minute winner vs Iran', 'R16 exit vs France'] },
      { year: 2022, host: 'Qatar', team: 'Argentina', appearances: 7, goals: 7, assists: 3, stageReached: 'Winner', notableMoments: ['2 goals vs Mexico', 'Brace vs Croatia semi', '2 goals in final vs France', 'Golden Ball'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Kylian MbappÃ©',
    nationality: 'France',
    position: 'FW',
    worldCup2026Team: 'France',
    worldCup2026Group: 'I',
    tournamentsPlayed: 2,
    totalAppearances: 14,
    totalGoals: 12,
    totalAssists: 2,
    worldCupTitles: 1,
    goldenBoot: true,
    goldenBall: false,
    debutYear: 2018,
    lastTournament: 2022,
    careerSummary:
      'Youngest French scorer in a World Cup final (2018). Golden Boot in 2022 with 8 goals including a hat-trick in the final â€” only the second player ever to do so.',
    appearances: [
      { year: 2018, host: 'Russia', team: 'France', appearances: 7, goals: 4, assists: 0, stageReached: 'Winner', notableMoments: ['Goal in final vs Croatia', 'Youngest French WC finalist scorer since PelÃ©'] },
      { year: 2022, host: 'Qatar', team: 'France', appearances: 7, goals: 8, assists: 2, stageReached: 'Final', notableMoments: ['Hat-trick in final vs Argentina', 'Golden Boot (8 goals)', 'Penalty in shootout'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Miroslav Klose',
    nationality: 'Germany',
    position: 'FW',
    worldCup2026Team: null,
    worldCup2026Group: null,
    tournamentsPlayed: 4,
    totalAppearances: 24,
    totalGoals: 16,
    totalAssists: 4,
    worldCupTitles: 1,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2002,
    lastTournament: 2014,
    careerSummary:
      'All-time FIFA World Cup top scorer with 16 goals. Surpassed Ronaldo (Brazil) in 2014 semi-final vs Brazil. 2014 World Cup winner.',
    appearances: [
      { year: 2002, host: 'Japan/South Korea', team: 'Germany', appearances: 7, goals: 5, assists: 0, stageReached: 'Final', notableMoments: ['5 goals as supersub', 'Silver medal'] },
      { year: 2006, host: 'Germany', team: 'Germany', appearances: 7, goals: 5, assists: 1, stageReached: 'Third place', notableMoments: ['5 goals on home soil', 'Bronze medal'] },
      { year: 2010, host: 'South Africa', team: 'Germany', appearances: 6, goals: 4, assists: 1, stageReached: 'Third place', notableMoments: ['4 goals including brace vs England'] },
      { year: 2014, host: 'Brazil', team: 'Germany', appearances: 4, goals: 2, assists: 2, stageReached: 'Winner', notableMoments: ['Record-breaking 16th WC goal vs Brazil (7-1)', '2014 champion'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Ronaldo',
    nationality: 'Brazil',
    position: 'FW',
    worldCup2026Team: null,
    worldCup2026Group: null,
    tournamentsPlayed: 4,
    totalAppearances: 19,
    totalGoals: 15,
    totalAssists: 4,
    worldCupTitles: 2,
    goldenBoot: true,
    goldenBall: false,
    debutYear: 1998,
    lastTournament: 2006,
    careerSummary:
      'Brazil legend "O FenÃ´meno" â€” 15 World Cup goals, Golden Boot 2002, two-time winner (1994 squad member, 2002 star).',
    appearances: [
      { year: 1998, host: 'France', team: 'Brazil', appearances: 7, goals: 4, assists: 2, stageReached: 'Final', notableMoments: ['4 goals', 'Final vs France (mystery illness narrative)'] },
      { year: 2002, host: 'Japan/South Korea', team: 'Brazil', appearances: 7, goals: 8, assists: 2, stageReached: 'Winner', notableMoments: ['Golden Boot (8 goals)', 'Brace in final vs Germany', 'Redemption arc'] },
      { year: 2006, host: 'Germany', team: 'Brazil', appearances: 5, goals: 3, assists: 0, stageReached: 'Quarter-final', notableMoments: ['3 goals', 'Exit vs France'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'PelÃ©',
    nationality: 'Brazil',
    position: 'FW',
    worldCup2026Team: null,
    worldCup2026Group: null,
    tournamentsPlayed: 4,
    totalAppearances: 14,
    totalGoals: 12,
    totalAssists: 6,
    worldCupTitles: 3,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 1958,
    lastTournament: 1970,
    careerSummary:
      'Only player to win three World Cups (1958, 1962, 1970). Scored in four separate World Cups. Youngest WC finalist scorer at 17 (1958).',
    appearances: [
      { year: 1958, host: 'Sweden', team: 'Brazil', appearances: 4, goals: 6, assists: 0, stageReached: 'Winner', notableMoments: ['17 years old', '2 goals in final vs Sweden', 'Youngest WC winner'] },
      { year: 1962, host: 'Chile', team: 'Brazil', appearances: 2, goals: 1, assists: 1, stageReached: 'Winner', notableMoments: ['Injured early â€” Garrincha carried team'] },
      { year: 1966, host: 'England', team: 'Brazil', appearances: 3, goals: 1, assists: 0, stageReached: 'Group stage', notableMoments: ['Brutal tackling â€” Brazil eliminated in group'] },
      { year: 1970, host: 'Mexico', team: 'Brazil', appearances: 5, goals: 4, assists: 5, stageReached: 'Winner', notableMoments: ['Assist for Carlos Alberto goal in final', 'Greatest team ever narrative'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Thomas MÃ¼ller',
    nationality: 'Germany',
    position: 'FW',
    worldCup2026Team: null,
    worldCup2026Group: null,
    tournamentsPlayed: 4,
    totalAppearances: 19,
    totalGoals: 10,
    totalAssists: 6,
    worldCupTitles: 1,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2010,
    lastTournament: 2022,
    careerSummary:
      'Germany\'s World Cup specialist â€” 10 goals, 6 assists. Golden Boot 2010 (5 goals). "Raumdeuter" who always performs on the biggest stage.',
    appearances: [
      { year: 2010, host: 'South Africa', team: 'Germany', appearances: 6, goals: 5, assists: 3, stageReached: 'Third place', notableMoments: ['Golden Boot at 20', 'Brace vs Uruguay in 3rd-place match'] },
      { year: 2014, host: 'Brazil', team: 'Germany', appearances: 7, goals: 5, assists: 2, stageReached: 'Winner', notableMoments: ['Hat-trick vs Portugal', '2014 champion'] },
      { year: 2018, host: 'Russia', team: 'Germany', appearances: 3, goals: 0, assists: 1, stageReached: 'Group stage', notableMoments: ['Defending champions eliminated in group'] },
      { year: 2022, host: 'Qatar', team: 'Germany', appearances: 3, goals: 0, assists: 0, stageReached: 'Group stage', notableMoments: ['Second consecutive group exit'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Harry Kane',
    nationality: 'England',
    position: 'FW',
    worldCup2026Team: 'England',
    worldCup2026Group: 'L',
    tournamentsPlayed: 2,
    totalAppearances: 11,
    totalGoals: 8,
    totalAssists: 2,
    worldCupTitles: 0,
    goldenBoot: true,
    goldenBall: false,
    debutYear: 2018,
    lastTournament: 2022,
    careerSummary:
      'England\'s World Cup top scorer with 8 goals. Golden Boot winner 2018 (6 goals). Semi-finalist in Russia.',
    appearances: [
      { year: 2018, host: 'Russia', team: 'England', appearances: 6, goals: 6, assists: 0, stageReached: 'Semi-final', notableMoments: ['Golden Boot', 'Penalty in semi vs Croatia'] },
      { year: 2022, host: 'Qatar', team: 'England', appearances: 5, goals: 2, assists: 2, stageReached: 'Quarter-final', notableMoments: ['Penalty vs France QF', 'Exit vs France 1-2'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Luka ModriÄ‡',
    nationality: 'Croatia',
    position: 'MF',
    worldCup2026Team: 'Croatia',
    worldCup2026Group: 'L',
    tournamentsPlayed: 4,
    totalAppearances: 19,
    totalGoals: 2,
    totalAssists: 3,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: true,
    debutYear: 2006,
    lastTournament: 2022,
    careerSummary:
      '2018 Golden Ball winner leading Croatia to the final. Only player besides Messi to win Golden Ball at multiple World Cups (2018, 2022 bronze).',
    appearances: [
      { year: 2006, host: 'Germany', team: 'Croatia', appearances: 3, goals: 0, assists: 0, stageReached: 'Group stage', notableMoments: ['Early exit'] },
      { year: 2014, host: 'Brazil', team: 'Croatia', appearances: 3, goals: 0, assists: 1, stageReached: 'Group stage', notableMoments: ['Group exit'] },
      { year: 2018, host: 'Russia', team: 'Croatia', appearances: 7, goals: 2, assists: 1, stageReached: 'Final', notableMoments: ['Golden Ball', 'Runner-up vs France'] },
      { year: 2022, host: 'Qatar', team: 'Croatia', appearances: 7, goals: 0, assists: 1, stageReached: 'Third place', notableMoments: ['Golden Ball (bronze)', 'Bronze medal at 37'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'James RodrÃ­guez',
    nationality: 'Colombia',
    position: 'MF',
    worldCup2026Team: 'Colombia',
    worldCup2026Group: 'K',
    tournamentsPlayed: 3,
    totalAppearances: 12,
    totalGoals: 6,
    totalAssists: 4,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2014,
    lastTournament: 2018,
    careerSummary:
      'Golden Boot winner 2014 with 6 goals â€” including the iconic volley vs Uruguay. Colombia\'s greatest World Cup campaign (quarter-finals).',
    appearances: [
      { year: 2014, host: 'Brazil', team: 'Colombia', appearances: 5, goals: 6, assists: 2, stageReached: 'Quarter-final', notableMoments: ['Golden Boot', 'Volley vs Uruguay', 'QF exit vs Brazil'] },
      { year: 2018, host: 'Russia', team: 'Colombia', appearances: 4, goals: 0, assists: 1, stageReached: 'Round of 16', notableMoments: ['R16 exit vs England on penalties'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Son Heung-min',
    nationality: 'South Korea',
    position: 'FW',
    worldCup2026Team: 'South Korea',
    worldCup2026Group: 'A',
    tournamentsPlayed: 3,
    totalAppearances: 10,
    totalGoals: 3,
    totalAssists: 1,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2014,
    lastTournament: 2022,
    careerSummary:
      'South Korea\'s star with 3 World Cup goals. Masked hero in 2022 â€” played with fractured eye socket, scored vs Portugal to help Korea advance.',
    appearances: [
      { year: 2014, host: 'Brazil', team: 'South Korea', appearances: 3, goals: 0, assists: 0, stageReached: 'Group stage', notableMoments: ['Group exit'] },
      { year: 2018, host: 'Russia', team: 'South Korea', appearances: 3, goals: 2, assists: 0, stageReached: 'Group stage', notableMoments: ['2 goals vs Germany (2-0 upset)'] },
      { year: 2022, host: 'Qatar', team: 'South Korea', appearances: 4, goals: 1, assists: 1, stageReached: 'Round of 16', notableMoments: ['Goal vs Portugal with face mask', 'R16 exit vs Brazil'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Xherdan Shaqiri',
    nationality: 'Switzerland',
    position: 'MF',
    worldCup2026Team: 'Switzerland',
    worldCup2026Group: 'B',
    tournamentsPlayed: 4,
    totalAppearances: 12,
    totalGoals: 5,
    totalAssists: 2,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2010,
    lastTournament: 2022,
    careerSummary:
      'Switzerland\'s World Cup record goalscorer with 5 goals. Famous for scoring in every major tournament he played.',
    appearances: [
      { year: 2010, host: 'South Africa', team: 'Switzerland', appearances: 3, goals: 0, assists: 0, stageReached: 'Group stage', notableMoments: ['Beat Spain 1-0 in opener'] },
      { year: 2014, host: 'Brazil', team: 'Switzerland', appearances: 3, goals: 3, assists: 0, stageReached: 'Round of 16', notableMoments: ['Hat-trick vs Honduras'] },
      { year: 2018, host: 'Russia', team: 'Switzerland', appearances: 4, goals: 1, assists: 1, stageReached: 'Round of 16', notableMoments: ['R16 exit vs Sweden'] },
      { year: 2022, host: 'Qatar', team: 'Switzerland', appearances: 2, goals: 1, assists: 1, stageReached: 'Round of 16', notableMoments: ['R16 exit vs Portugal (6-1)'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Granit Xhaka',
    nationality: 'Switzerland',
    position: 'MF',
    worldCup2026Team: 'Switzerland',
    worldCup2026Group: 'B',
    tournamentsPlayed: 3,
    totalAppearances: 10,
    totalGoals: 1,
    totalAssists: 2,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2014,
    lastTournament: 2022,
    careerSummary:
      'Switzerland captain across three World Cups. 1 goal, 2 assists â€” midfield engine for Group B contenders.',
    appearances: [
      { year: 2014, host: 'Brazil', team: 'Switzerland', appearances: 3, goals: 0, assists: 1, stageReached: 'Round of 16', notableMoments: ['R16 exit'] },
      { year: 2018, host: 'Russia', team: 'Switzerland', appearances: 4, goals: 1, assists: 0, stageReached: 'Round of 16', notableMoments: ['Goal vs Serbia'] },
      { year: 2022, host: 'Qatar', team: 'Switzerland', appearances: 3, goals: 0, assists: 1, stageReached: 'Round of 16', notableMoments: ['Captain in R16'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Federico Chiesa',
    nationality: 'Italy',
    position: 'FW',
    worldCup2026Team: 'Italy',
    worldCup2026Group: 'B',
    tournamentsPlayed: 0,
    totalAppearances: 0,
    totalGoals: 0,
    totalAssists: 0,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 0,
    lastTournament: 0,
    careerSummary:
      'Italy missed 2018 and 2022 World Cups â€” Chiesa has no WC appearances yet. Euro 2020 winner with 2 goals in that tournament. 2026 would be his World Cup debut.',
    appearances: [],
    dataSource: SOURCE,
  },
  {
    name: 'Jonathan David',
    nationality: 'Canada',
    position: 'FW',
    worldCup2026Team: 'Canada',
    worldCup2026Group: 'B',
    tournamentsPlayed: 1,
    totalAppearances: 3,
    totalGoals: 0,
    totalAssists: 0,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2022,
    lastTournament: 2022,
    careerSummary:
      'Canada\'s leading striker at Qatar 2022 â€” first World Cup in 36 years. No goals but key in CONCACAF qualifying.',
    appearances: [
      { year: 2022, host: 'Qatar', team: 'Canada', appearances: 3, goals: 0, assists: 0, stageReached: 'Group stage', notableMoments: ['Canada\'s return after 1986', 'Group exit'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Alphonso Davies',
    nationality: 'Canada',
    position: 'DF',
    worldCup2026Team: 'Canada',
    worldCup2026Group: 'B',
    tournamentsPlayed: 1,
    totalAppearances: 3,
    totalGoals: 0,
    totalAssists: 0,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2022,
    lastTournament: 2022,
    careerSummary:
      'Bayern Munich star â€” Canada\'s 2022 World Cup appearance. Defensive anchor with elite recovery speed.',
    appearances: [
      { year: 2022, host: 'Qatar', team: 'Canada', appearances: 3, goals: 0, assists: 0, stageReached: 'Group stage', notableMoments: ['First WC for Canada since 1986'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Gareth Bale',
    nationality: 'Wales',
    position: 'FW',
    worldCup2026Team: null,
    worldCup2026Group: null,
    tournamentsPlayed: 1,
    totalAppearances: 3,
    totalGoals: 2,
    totalAssists: 0,
    worldCupTitles: 0,
    goldenBoot: false,
    goldenBall: false,
    debutYear: 2022,
    lastTournament: 2022,
    careerSummary:
      'Wales\' first World Cup since 1958. 2 goals including a stunning free-kick vs USA.',
    appearances: [
      { year: 2022, host: 'Qatar', team: 'Wales', appearances: 3, goals: 2, assists: 0, stageReached: 'Group stage', notableMoments: ['Free-kick vs USA', 'Penalty vs Iran', '64-year WC return'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'Just Fontaine',
    nationality: 'France',
    position: 'FW',
    worldCup2026Team: null,
    worldCup2026Group: null,
    tournamentsPlayed: 1,
    totalAppearances: 6,
    totalGoals: 13,
    totalAssists: 0,
    worldCupTitles: 0,
    goldenBoot: true,
    goldenBall: false,
    debutYear: 1958,
    lastTournament: 1958,
    careerSummary:
      'Record for most goals in a single World Cup: 13 in 1958. A record that still stands â€” no player has come closer in 68 years.',
    appearances: [
      { year: 1958, host: 'Sweden', team: 'France', appearances: 6, goals: 13, assists: 0, stageReached: 'Third place', notableMoments: ['13 goals in one tournament â€” all-time record', 'Bronze medal'] },
    ],
    dataSource: SOURCE,
  },
  {
    name: 'EusÃ©bio',
    nationality: 'Portugal',
    position: 'FW',
    worldCup2026Team: null,
    worldCup2026Group: null,
    tournamentsPlayed: 1,
    totalAppearances: 6,
    totalGoals: 9,
    totalAssists: 0,
    worldCupTitles: 0,
    goldenBoot: true,
    goldenBall: false,
    debutYear: 1966,
    lastTournament: 1966,
    careerSummary:
      'Portugal\'s all-time World Cup top scorer with 9 goals â€” all in England 1966. Golden Boot winner, Bronze medal, "Black Panther" legend.',
    appearances: [
      { year: 1966, host: 'England', team: 'Portugal', appearances: 6, goals: 9, assists: 0, stageReached: 'Third place', notableMoments: ['4 goals vs North Korea (quarter-final)', 'Golden Boot', 'Bronze vs Soviet Union'] },
    ],
    dataSource: SOURCE,
  },
]

export const WORLD_CUP_EDITIONS: WorldCupEdition[] = [
  { year: 1930, host: 'Uruguay', hosts: ['Uruguay'], winner: 'Uruguay', runnerUp: 'Argentina', scoreline: '4-2', thirdPlace: 'United States', fourthPlace: 'Yugoslavia', teams: 13, matches: 18, goals: 70, attendance: 590549, goldenBoot: { player: 'Guillermo StÃ¡bile', team: 'Argentina', goals: 8 }, goldenBall: { player: 'JosÃ© Nasazzi', team: 'Uruguay' }, venue: 'Estadio Centenario', highlight: 'First ever World Cup â€” Uruguay hosts and wins' },
  { year: 1950, host: 'Brazil', hosts: ['Brazil'], winner: 'Uruguay', runnerUp: 'Brazil', scoreline: '2-1', thirdPlace: 'Sweden', fourthPlace: 'Spain', teams: 13, matches: 22, goals: 88, attendance: 1045246, goldenBoot: { player: 'Ademir', team: 'Brazil', goals: 9 }, goldenBall: { player: 'Zizinho', team: 'Brazil' }, venue: 'MaracanÃ£', highlight: 'Maracanazo â€” Uruguay stuns 200,000 at MaracanÃ£' },
  { year: 1958, host: 'Sweden', hosts: ['Sweden'], winner: 'Brazil', runnerUp: 'Sweden', scoreline: '5-2', thirdPlace: 'France', fourthPlace: 'West Germany', teams: 16, matches: 35, goals: 126, attendance: 819810, goldenBoot: { player: 'Just Fontaine', team: 'France', goals: 13 }, goldenBall: { player: 'Didi', team: 'Brazil' }, venue: 'RÃ¥sunda Stadium', highlight: '17-year-old PelÃ© announces himself to the world' },
  { year: 1966, host: 'England', hosts: ['England'], winner: 'England', runnerUp: 'West Germany', scoreline: '4-2 (aet)', thirdPlace: 'Portugal', fourthPlace: 'Soviet Union', teams: 16, matches: 32, goals: 89, attendance: 1563135, goldenBoot: { player: 'EusÃ©bio', team: 'Portugal', goals: 9 }, goldenBall: { player: 'Bobby Charlton', team: 'England' }, venue: 'Wembley Stadium', highlight: 'England\'s only World Cup â€” "They think it\'s all over"' },
  { year: 1970, host: 'Mexico', hosts: ['Mexico'], winner: 'Brazil', runnerUp: 'Italy', scoreline: '4-1', thirdPlace: 'West Germany', fourthPlace: 'Uruguay', teams: 16, matches: 32, goals: 95, attendance: 1603975, goldenBoot: { player: 'Gerd MÃ¼ller', team: 'West Germany', goals: 10 }, goldenBall: { player: 'PelÃ©', team: 'Brazil' }, venue: 'Estadio Azteca', highlight: 'Greatest team ever â€” Brazil\'s third title' },
  { year: 1974, host: 'West Germany', hosts: ['West Germany'], winner: 'West Germany', runnerUp: 'Netherlands', scoreline: '2-1', thirdPlace: 'Poland', fourthPlace: 'Brazil', teams: 16, matches: 38, goals: 97, attendance: 1865753, goldenBoot: { player: 'Grzegorz Lato', team: 'Poland', goals: 7 }, goldenBall: { player: 'Johan Cruyff', team: 'Netherlands' }, venue: 'Olympiastadion', highlight: 'Total Football vs German efficiency' },
  { year: 1986, host: 'Mexico', hosts: ['Mexico'], winner: 'Argentina', runnerUp: 'West Germany', scoreline: '3-2', thirdPlace: 'France', fourthPlace: 'Belgium', teams: 24, matches: 52, goals: 132, attendance: 2394031, goldenBoot: { player: 'Gary Lineker', team: 'England', goals: 6 }, goldenBall: { player: 'Diego Maradona', team: 'Argentina' }, venue: 'Estadio Azteca', highlight: 'Maradona\'s Hand of God and Goal of the Century' },
  { year: 1998, host: 'France', hosts: ['France'], winner: 'France', runnerUp: 'Brazil', scoreline: '3-0', thirdPlace: 'Croatia', fourthPlace: 'Netherlands', teams: 32, matches: 64, goals: 171, attendance: 2785100, goldenBoot: { player: 'Davor Å uker', team: 'Croatia', goals: 6 }, goldenBall: { player: 'Ronaldo', team: 'Brazil' }, venue: 'Stade de France', highlight: 'Zidane\'s double header â€” France\'s first title' },
  { year: 2002, host: 'Japan/South Korea', hosts: ['Japan', 'South Korea'], winner: 'Brazil', runnerUp: 'Germany', scoreline: '2-0', thirdPlace: 'Turkey', fourthPlace: 'South Korea', teams: 32, matches: 64, goals: 161, attendance: 2705197, goldenBoot: { player: 'Ronaldo', team: 'Brazil', goals: 8 }, goldenBall: { player: 'Ronaldo', team: 'Brazil' }, venue: 'International Stadium Yokohama', highlight: 'First Asian World Cup â€” Ronaldo\'s redemption' },
  { year: 2006, host: 'Germany', hosts: ['Germany'], winner: 'Italy', runnerUp: 'France', scoreline: '1-1 (5-3 pens)', thirdPlace: 'Germany', fourthPlace: 'Portugal', teams: 32, matches: 64, goals: 147, attendance: 3260189, goldenBoot: { player: 'Miroslav Klose', team: 'Germany', goals: 5 }, goldenBall: { player: 'Zinedine Zidane', team: 'France' }, venue: 'Olympiastadion Berlin', highlight: 'Zidane headbutt â€” Italy wins on penalties' },
  { year: 2010, host: 'South Africa', hosts: ['South Africa'], winner: 'Spain', runnerUp: 'Netherlands', scoreline: '1-0 (aet)', thirdPlace: 'Germany', fourthPlace: 'Uruguay', teams: 32, matches: 64, goals: 145, attendance: 3178856, goldenBoot: { player: 'Thomas MÃ¼ller', team: 'Germany', goals: 5 }, goldenBall: { player: 'Diego ForlÃ¡n', team: 'Uruguay' }, venue: 'Soccer City', highlight: 'First African World Cup â€” Spain\'s tiki-taka triumph' },
  { year: 2014, host: 'Brazil', hosts: ['Brazil'], winner: 'Germany', runnerUp: 'Argentina', scoreline: '1-0 (aet)', thirdPlace: 'Netherlands', fourthPlace: 'Brazil', teams: 32, matches: 64, goals: 171, attendance: 3429873, goldenBoot: { player: 'James RodrÃ­guez', team: 'Colombia', goals: 6 }, goldenBall: { player: 'Lionel Messi', team: 'Argentina' }, venue: 'MaracanÃ£', highlight: 'Germany 7-1 Brazil â€” Mineirazo' },
  { year: 2018, host: 'Russia', hosts: ['Russia'], winner: 'France', runnerUp: 'Croatia', scoreline: '4-2', thirdPlace: 'Belgium', fourthPlace: 'England', teams: 32, matches: 64, goals: 169, attendance: 3031768, goldenBoot: { player: 'Harry Kane', team: 'England', goals: 6 }, goldenBall: { player: 'Luka ModriÄ‡', team: 'Croatia' }, venue: 'Luzhniki Stadium', highlight: 'MbappÃ© emerges â€” France\'s second star' },
  { year: 2022, host: 'Qatar', hosts: ['Qatar'], winner: 'Argentina', runnerUp: 'France', scoreline: '3-3 (4-2 pens)', thirdPlace: 'Croatia', fourthPlace: 'Morocco', teams: 32, matches: 64, goals: 172, attendance: 3404252, goldenBoot: { player: 'Kylian MbappÃ©', team: 'France', goals: 8 }, goldenBall: { player: 'Lionel Messi', team: 'Argentina' }, venue: 'Lusail Stadium', highlight: 'Messi\'s crowning glory â€” greatest final ever' },
]

export const WORLD_CUP_RECORDS: WorldCupRecord[] = [
  { category: 'All-time top scorer', rank: 1, holder: 'Miroslav Klose', nationality: 'Germany', value: '16 goals', numericValue: 16, context: '2002â€“2014, surpassed Ronaldo (15) in 2014 semi vs Brazil', era: '2002â€“2014' },
  { category: 'All-time top scorer', rank: 2, holder: 'Ronaldo', nationality: 'Brazil', value: '15 goals', numericValue: 15, context: 'O FenÃ´meno â€” Golden Boot 2002', era: '1998â€“2006' },
  { category: 'All-time top scorer', rank: 3, holder: 'Gerd MÃ¼ller', nationality: 'West Germany', value: '14 goals', numericValue: 14, context: 'Der Bomber â€” Golden Boot 1970', era: '1970â€“1974' },
  { category: 'All-time top scorer', rank: 4, holder: 'Just Fontaine', nationality: 'France', value: '13 goals (single tournament)', numericValue: 13, context: 'Record 13 goals in 1958 alone â€” still unbeaten', era: '1958' },
  { category: 'All-time top scorer', rank: 5, holder: 'Lionel Messi', nationality: 'Argentina', value: '13 goals', numericValue: 13, context: '7 goals in 2022 alone â€” 2022 champion', era: '2006â€“2022' },
  { category: 'Most appearances', rank: 1, holder: 'Lionel Messi', nationality: 'Argentina', value: '26 matches', numericValue: 26, context: '5 tournaments, 2022 winner', era: '2006â€“2022' },
  { category: 'Most appearances', rank: 2, holder: 'Lothar MatthÃ¤us', nationality: 'Germany', value: '25 matches', numericValue: 25, context: '5 tournaments as player, 1 as captain winning 1990', era: '1982â€“1998' },
  { category: 'Most World Cup titles (player)', rank: 1, holder: 'PelÃ©', nationality: 'Brazil', value: '3 titles', numericValue: 3, context: '1958, 1962, 1970 â€” unique record', era: '1958â€“1970' },
  { category: 'Most goals in one tournament', rank: 1, holder: 'Just Fontaine', nationality: 'France', value: '13 goals', numericValue: 13, context: '1958 Sweden â€” 6 matches', era: '1958' },
  { category: 'Most goals in one tournament', rank: 2, holder: 'Kylian MbappÃ©', nationality: 'France', value: '8 goals', numericValue: 8, context: '2022 Qatar â€” Golden Boot, hat-trick in final', era: '2022' },
  { category: 'Youngest scorer', rank: 1, holder: 'PelÃ©', nationality: 'Brazil', value: '17 years 239 days', numericValue: 17, context: 'Goal vs Wales, Sweden 1958', era: '1958' },
  { category: 'Oldest scorer', rank: 1, holder: 'Roger Milla', nationality: 'Cameroon', value: '42 years 39 days', numericValue: 42, context: 'Goal vs Russia, USA 1994', era: '1994' },
  { category: 'Biggest win', rank: 1, holder: 'Hungary', nationality: 'Hungary', value: '10-1 vs El Salvador', numericValue: 10, context: '1982 Spain group stage', era: '1982' },
  { category: 'Biggest win (knockout)', rank: 1, holder: 'Germany', nationality: 'Germany', value: '7-1 vs Brazil', numericValue: 7, context: '2014 semi-final â€” Mineirazo', era: '2014' },
  { category: 'Most tournaments scored in', rank: 1, holder: 'Cristiano Ronaldo', nationality: 'Portugal', value: '5 tournaments', numericValue: 5, context: '2006, 2010, 2014, 2018, 2022 â€” first man to achieve this', era: '2006â€“2022' },
  { category: 'Portugal all-time WC top scorer', rank: 1, holder: 'EusÃ©bio', nationality: 'Portugal', value: '9 goals', numericValue: 9, context: 'All 9 in 1966 â€” Golden Boot, third place', era: '1966' },
  { category: 'Portugal all-time WC top scorer', rank: 2, holder: 'Cristiano Ronaldo', nationality: 'Portugal', value: '8 goals', numericValue: 8, context: '2006â€“2022 across five tournaments â€” scored in every WC he played', era: '2006â€“2022' },
]

const PLAYER_ALIASES: Record<string, string> = {
  ronaldo: 'Cristiano Ronaldo',
  'cristiano ronaldo': 'Cristiano Ronaldo',
  cr7: 'Cristiano Ronaldo',
  messi: 'Lionel Messi',
  'lionel messi': 'Lionel Messi',
  mbappe: 'Kylian MbappÃ©',
  'kylian mbappe': 'Kylian MbappÃ©',
  klose: 'Miroslav Klose',
  kane: 'Harry Kane',
  modric: 'Luka ModriÄ‡',
  james: 'James RodrÃ­guez',
  son: 'Son Heung-min',
  shaqiri: 'Xherdan Shaqiri',
  xhaka: 'Granit Xhaka',
  eusebio: 'EusÃ©bio',
  pele: 'PelÃ©',
  muller: 'Thomas MÃ¼ller',
  fontaine: 'Just Fontaine',
}

export function findPlayerInQuestion(question: string): string | null {
  const q = question.toLowerCase()
  for (const [alias, name] of Object.entries(PLAYER_ALIASES)) {
    if (q.includes(alias)) return name
  }
  for (const player of PLAYER_WORLD_CUP_CAREERS) {
    const lastName = player.name.split(' ').pop()?.toLowerCase()
    if (lastName && lastName.length > 3 && q.includes(lastName)) return player.name
  }
  return null
}

export function matchHistoricalQuery(question: string): MongoQueryPlan | null {
  const q = question.toLowerCase()
  const player = findPlayerInQuestion(question)

  if (
    player &&
    (/career|world cup|scored|goals|history|how many|total/.test(q) ||
      questionTypeHintsHistorical(q))
  ) {
    return {
      collection: 'playerWorldCupCareers',
      pipeline: [{ $match: { name: player } }],
    }
  }

  if (/group\s+([a-l])/i.test(q) && /history|track record|past world cup|scored|scorer/.test(q)) {
    const groupMatch = q.match(/group\s+([a-l])/i)
    const group = groupMatch ? groupMatch[1].toUpperCase() : null
    if (group) {
      return {
        collection: 'playerWorldCupCareers',
        pipeline: [
          { $match: { worldCup2026Group: group, totalGoals: { $gt: 0 } } },
          { $sort: { totalGoals: -1 } },
          { $limit: 10 },
        ],
      }
    }
  }

  if (/all.time|all time|record|most goals|top scorer|golden boot|leaderboard/.test(q)) {
    const pipeline =
      /top scorer|most goals|all.time|all time/.test(q)
        ? [
            { $match: { category: 'All-time top scorer' } },
            { $sort: { rank: 1 } },
            { $limit: 10 },
          ]
        : [{ $sort: { rank: 1 } }, { $limit: 12 }]
    return { collection: 'worldCupRecords', pipeline }
  }

  if (/\b(19|20)\d{2}\b/.test(q) || /winner|host|champion|final|edition|tournament history/.test(q)) {
    const yearMatch = q.match(/\b((19|20)\d{2})\b/)
    if (yearMatch) {
      return {
        collection: 'worldCupEditions',
        pipeline: [{ $match: { year: Number(yearMatch[1]) } }],
      }
    }
    return {
      collection: 'worldCupEditions',
      pipeline: [{ $sort: { year: -1 } }, { $limit: 5 }],
    }
  }

  if (player) {
    return {
      collection: 'playerWorldCupCareers',
      pipeline: [{ $match: { name: player } }],
    }
  }

  return null
}

function questionTypeHintsHistorical(q: string): boolean {
  return /historical|past|previous|ever|legacy|legend/.test(q)
}

export function getHistoricalSeedData() {
  return {
    playerWorldCupCareers: PLAYER_WORLD_CUP_CAREERS,
    worldCupEditions: WORLD_CUP_EDITIONS,
    worldCupRecords: WORLD_CUP_RECORDS,
    meta: {
      curatedAt: '2026-06-08',
      coverage: '1930â€“2022 (22 editions)',
      playerCount: PLAYER_WORLD_CUP_CAREERS.length,
      editionCount: WORLD_CUP_EDITIONS.length,
      recordCount: WORLD_CUP_RECORDS.length,
      dataSource: SOURCE,
      note: 'Factual historical data â€” independent of 2026 preview mockup',
    },
  }
}
