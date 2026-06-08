/**
 * Official FIFA World Cup 2026 fixtures (all 104 matches).
 * Source: FIFA match schedule (Feb 2024) + Dec 5 2025 final draw.
 * Kickoff times converted from local venue time to UTC.
 * @see https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums
 */

export type KnockoutStage =
  | 'round-of-32'
  | 'round-of-16'
  | 'quarter'
  | 'semi'
  | 'third-place'
  | 'final'

export type OfficialGroupFixture = {
  group: string
  matchday: number
  homeTeam: string
  awayTeam: string
  date: string
  venue: string
  city: string
}

export type OfficialKnockoutFixture = {
  fifaMatchNumber: number
  stage: KnockoutStage
  homeTeam: string
  awayTeam: string
  date: string
  venue: string
  city: string
}

export const FIFA_SQUAD_SIZE = 26
export const FIFA_TOTAL_MATCHES = 104
export const FIFA_GROUP_MATCHES = 72
export const FIFA_KNOCKOUT_MATCHES = 32

/** All 16 FIFA 2026 host stadiums */
export const OFFICIAL_VENUES = [
  { venue: 'Estadio Azteca', city: 'Mexico City' },
  { venue: 'Estadio Akron', city: 'Zapopan' },
  { venue: 'Estadio BBVA', city: 'Guadalupe' },
  { venue: 'BMO Field', city: 'Toronto' },
  { venue: 'BC Place', city: 'Vancouver' },
  { venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { venue: 'Gillette Stadium', city: 'Foxborough' },
  { venue: 'MetLife Stadium', city: 'East Rutherford' },
  { venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { venue: 'Lumen Field', city: 'Seattle' },
  { venue: 'SoFi Stadium', city: 'Inglewood' },
  { venue: "Levi's Stadium", city: 'Santa Clara' },
  { venue: 'NRG Stadium', city: 'Houston' },
  { venue: 'AT&T Stadium', city: 'Arlington' },
  { venue: 'Arrowhead Stadium', city: 'Kansas City' },
] as const

/** Official Dec 5 2025 draw — 48 teams in 12 groups */
export const OFFICIAL_GROUPS_2026: Record<string, string[]> = {
  A: ['Mexico', 'South Africa', 'South Korea', 'Czech Republic'],
  B: ['Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['United States', 'Paraguay', 'Australia', 'Turkey'],
  E: ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  G: ['Belgium', 'Iran', 'New Zealand', 'Egypt'],
  H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Iraq', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
  L: ['England', 'Croatia', 'Ghana', 'Panama'],
}

/** 72 official group-stage matches — FIFA match numbers 1–72 */
export const OFFICIAL_GROUP_FIXTURES: OfficialGroupFixture[] = [
  { group: 'A', matchday: 1, homeTeam: 'Mexico', awayTeam: 'South Africa', date: '2026-06-11T19:00:00.000Z', venue: 'Estadio Azteca', city: 'Mexico City' },
  { group: 'A', matchday: 1, homeTeam: 'South Korea', awayTeam: 'Czech Republic', date: '2026-06-12T02:00:00.000Z', venue: 'Estadio Akron', city: 'Zapopan' },
  { group: 'B', matchday: 1, homeTeam: 'Canada', awayTeam: 'Bosnia and Herzegovina', date: '2026-06-12T19:00:00.000Z', venue: 'BMO Field', city: 'Toronto' },
  { group: 'D', matchday: 1, homeTeam: 'United States', awayTeam: 'Paraguay', date: '2026-06-13T01:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood' },
  { group: 'B', matchday: 1, homeTeam: 'Qatar', awayTeam: 'Switzerland', date: '2026-06-13T19:00:00.000Z', venue: "Levi's Stadium", city: 'Santa Clara' },
  { group: 'C', matchday: 1, homeTeam: 'Brazil', awayTeam: 'Morocco', date: '2026-06-13T22:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { group: 'C', matchday: 1, homeTeam: 'Haiti', awayTeam: 'Scotland', date: '2026-06-14T01:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough' },
  { group: 'D', matchday: 1, homeTeam: 'Australia', awayTeam: 'Turkey', date: '2026-06-14T04:00:00.000Z', venue: 'BC Place', city: 'Vancouver' },
  { group: 'E', matchday: 1, homeTeam: 'Germany', awayTeam: 'Curaçao', date: '2026-06-14T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston' },
  { group: 'F', matchday: 1, homeTeam: 'Netherlands', awayTeam: 'Japan', date: '2026-06-14T20:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington' },
  { group: 'E', matchday: 1, homeTeam: 'Ivory Coast', awayTeam: 'Ecuador', date: '2026-06-14T23:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { group: 'F', matchday: 1, homeTeam: 'Sweden', awayTeam: 'Tunisia', date: '2026-06-15T02:00:00.000Z', venue: 'Estadio BBVA', city: 'Guadalupe' },
  { group: 'G', matchday: 1, homeTeam: 'Belgium', awayTeam: 'Egypt', date: '2026-06-15T19:00:00.000Z', venue: 'Lumen Field', city: 'Seattle' },
  { group: 'H', matchday: 1, homeTeam: 'Spain', awayTeam: 'Cape Verde', date: '2026-06-15T16:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { group: 'H', matchday: 1, homeTeam: 'Saudi Arabia', awayTeam: 'Uruguay', date: '2026-06-15T22:00:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { group: 'G', matchday: 1, homeTeam: 'Iran', awayTeam: 'New Zealand', date: '2026-06-16T01:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood' },
  { group: 'I', matchday: 1, homeTeam: 'France', awayTeam: 'Senegal', date: '2026-06-16T19:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { group: 'I', matchday: 1, homeTeam: 'Iraq', awayTeam: 'Norway', date: '2026-06-16T22:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough' },
  { group: 'J', matchday: 1, homeTeam: 'Argentina', awayTeam: 'Algeria', date: '2026-06-17T01:00:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { group: 'J', matchday: 1, homeTeam: 'Austria', awayTeam: 'Jordan', date: '2026-06-17T04:00:00.000Z', venue: "Levi's Stadium", city: 'Santa Clara' },
  { group: 'K', matchday: 1, homeTeam: 'Portugal', awayTeam: 'DR Congo', date: '2026-06-17T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston' },
  { group: 'L', matchday: 1, homeTeam: 'England', awayTeam: 'Croatia', date: '2026-06-17T20:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington' },
  { group: 'L', matchday: 1, homeTeam: 'Ghana', awayTeam: 'Panama', date: '2026-06-17T23:00:00.000Z', venue: 'BMO Field', city: 'Toronto' },
  { group: 'K', matchday: 1, homeTeam: 'Uzbekistan', awayTeam: 'Colombia', date: '2026-06-18T02:00:00.000Z', venue: 'Estadio Azteca', city: 'Mexico City' },
  { group: 'A', matchday: 2, homeTeam: 'Czech Republic', awayTeam: 'South Africa', date: '2026-06-18T16:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { group: 'B', matchday: 2, homeTeam: 'Switzerland', awayTeam: 'Bosnia and Herzegovina', date: '2026-06-18T19:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood' },
  { group: 'B', matchday: 2, homeTeam: 'Canada', awayTeam: 'Qatar', date: '2026-06-18T22:00:00.000Z', venue: 'BC Place', city: 'Vancouver' },
  { group: 'A', matchday: 2, homeTeam: 'Mexico', awayTeam: 'South Korea', date: '2026-06-19T01:00:00.000Z', venue: 'Estadio Akron', city: 'Zapopan' },
  { group: 'D', matchday: 2, homeTeam: 'United States', awayTeam: 'Australia', date: '2026-06-19T19:00:00.000Z', venue: 'Lumen Field', city: 'Seattle' },
  { group: 'C', matchday: 2, homeTeam: 'Scotland', awayTeam: 'Morocco', date: '2026-06-19T22:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough' },
  { group: 'C', matchday: 2, homeTeam: 'Brazil', awayTeam: 'Haiti', date: '2026-06-20T01:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { group: 'D', matchday: 2, homeTeam: 'Turkey', awayTeam: 'Paraguay', date: '2026-06-20T03:00:00.000Z', venue: "Levi's Stadium", city: 'Santa Clara' },
  { group: 'F', matchday: 2, homeTeam: 'Netherlands', awayTeam: 'Sweden', date: '2026-06-20T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston' },
  { group: 'E', matchday: 2, homeTeam: 'Germany', awayTeam: 'Ivory Coast', date: '2026-06-20T20:00:00.000Z', venue: 'BMO Field', city: 'Toronto' },
  { group: 'E', matchday: 2, homeTeam: 'Ecuador', awayTeam: 'Curaçao', date: '2026-06-21T00:00:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { group: 'F', matchday: 2, homeTeam: 'Tunisia', awayTeam: 'Japan', date: '2026-06-21T04:00:00.000Z', venue: 'Estadio BBVA', city: 'Guadalupe' },
  { group: 'G', matchday: 2, homeTeam: 'Belgium', awayTeam: 'Iran', date: '2026-06-21T19:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood' },
  { group: 'H', matchday: 2, homeTeam: 'Spain', awayTeam: 'Saudi Arabia', date: '2026-06-21T16:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { group: 'H', matchday: 2, homeTeam: 'Uruguay', awayTeam: 'Cape Verde', date: '2026-06-21T22:00:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { group: 'G', matchday: 2, homeTeam: 'New Zealand', awayTeam: 'Egypt', date: '2026-06-22T01:00:00.000Z', venue: 'BC Place', city: 'Vancouver' },
  { group: 'J', matchday: 2, homeTeam: 'Argentina', awayTeam: 'Austria', date: '2026-06-22T17:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington' },
  { group: 'I', matchday: 2, homeTeam: 'France', awayTeam: 'Iraq', date: '2026-06-22T21:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { group: 'I', matchday: 2, homeTeam: 'Norway', awayTeam: 'Senegal', date: '2026-06-23T00:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { group: 'J', matchday: 2, homeTeam: 'Jordan', awayTeam: 'Algeria', date: '2026-06-23T03:00:00.000Z', venue: "Levi's Stadium", city: 'Santa Clara' },
  { group: 'K', matchday: 2, homeTeam: 'Portugal', awayTeam: 'Uzbekistan', date: '2026-06-23T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston' },
  { group: 'L', matchday: 2, homeTeam: 'England', awayTeam: 'Ghana', date: '2026-06-23T20:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough' },
  { group: 'L', matchday: 2, homeTeam: 'Panama', awayTeam: 'Croatia', date: '2026-06-23T23:00:00.000Z', venue: 'BMO Field', city: 'Toronto' },
  { group: 'K', matchday: 2, homeTeam: 'Colombia', awayTeam: 'DR Congo', date: '2026-06-24T02:00:00.000Z', venue: 'Estadio Akron', city: 'Zapopan' },
  { group: 'B', matchday: 3, homeTeam: 'Switzerland', awayTeam: 'Canada', date: '2026-06-24T19:00:00.000Z', venue: 'BC Place', city: 'Vancouver' },
  { group: 'B', matchday: 3, homeTeam: 'Bosnia and Herzegovina', awayTeam: 'Qatar', date: '2026-06-24T19:00:00.000Z', venue: 'Lumen Field', city: 'Seattle' },
  { group: 'C', matchday: 3, homeTeam: 'Scotland', awayTeam: 'Brazil', date: '2026-06-24T22:00:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { group: 'C', matchday: 3, homeTeam: 'Morocco', awayTeam: 'Haiti', date: '2026-06-24T22:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { group: 'A', matchday: 3, homeTeam: 'Czech Republic', awayTeam: 'Mexico', date: '2026-06-25T01:00:00.000Z', venue: 'Estadio Azteca', city: 'Mexico City' },
  { group: 'A', matchday: 3, homeTeam: 'South Africa', awayTeam: 'South Korea', date: '2026-06-25T01:00:00.000Z', venue: 'Estadio BBVA', city: 'Guadalupe' },
  { group: 'E', matchday: 3, homeTeam: 'Curaçao', awayTeam: 'Ivory Coast', date: '2026-06-25T20:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { group: 'E', matchday: 3, homeTeam: 'Ecuador', awayTeam: 'Germany', date: '2026-06-25T20:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { group: 'F', matchday: 3, homeTeam: 'Japan', awayTeam: 'Sweden', date: '2026-06-25T23:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington' },
  { group: 'F', matchday: 3, homeTeam: 'Tunisia', awayTeam: 'Netherlands', date: '2026-06-25T23:00:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { group: 'D', matchday: 3, homeTeam: 'Turkey', awayTeam: 'United States', date: '2026-06-26T02:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood' },
  { group: 'D', matchday: 3, homeTeam: 'Paraguay', awayTeam: 'Australia', date: '2026-06-26T02:00:00.000Z', venue: "Levi's Stadium", city: 'Santa Clara' },
  { group: 'I', matchday: 3, homeTeam: 'Norway', awayTeam: 'France', date: '2026-06-26T19:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough' },
  { group: 'I', matchday: 3, homeTeam: 'Senegal', awayTeam: 'Iraq', date: '2026-06-26T19:00:00.000Z', venue: 'BMO Field', city: 'Toronto' },
  { group: 'H', matchday: 3, homeTeam: 'Uruguay', awayTeam: 'Spain', date: '2026-06-27T00:00:00.000Z', venue: 'Estadio Akron', city: 'Zapopan' },
  { group: 'H', matchday: 3, homeTeam: 'Cape Verde', awayTeam: 'Saudi Arabia', date: '2026-06-27T00:00:00.000Z', venue: 'NRG Stadium', city: 'Houston' },
  { group: 'G', matchday: 3, homeTeam: 'Egypt', awayTeam: 'Iran', date: '2026-06-27T03:00:00.000Z', venue: 'Lumen Field', city: 'Seattle' },
  { group: 'G', matchday: 3, homeTeam: 'New Zealand', awayTeam: 'Belgium', date: '2026-06-27T03:00:00.000Z', venue: 'BC Place', city: 'Vancouver' },
  { group: 'L', matchday: 3, homeTeam: 'Panama', awayTeam: 'England', date: '2026-06-27T21:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { group: 'L', matchday: 3, homeTeam: 'Croatia', awayTeam: 'Ghana', date: '2026-06-27T21:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { group: 'K', matchday: 3, homeTeam: 'Colombia', awayTeam: 'Portugal', date: '2026-06-27T23:30:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { group: 'K', matchday: 3, homeTeam: 'DR Congo', awayTeam: 'Uzbekistan', date: '2026-06-27T23:30:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { group: 'J', matchday: 3, homeTeam: 'Algeria', awayTeam: 'Austria', date: '2026-06-28T02:00:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { group: 'J', matchday: 3, homeTeam: 'Jordan', awayTeam: 'Argentina', date: '2026-06-28T02:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington' },
]

/** 32 official knockout matches — FIFA match numbers 73–104 */
export const OFFICIAL_KNOCKOUT_FIXTURES: OfficialKnockoutFixture[] = [
  { fifaMatchNumber: 73, stage: 'round-of-32', homeTeam: 'Runner-up Group A', awayTeam: 'Runner-up Group B', date: '2026-06-28T19:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood' },
  { fifaMatchNumber: 76, stage: 'round-of-32', homeTeam: 'Winner Group C', awayTeam: 'Runner-up Group F', date: '2026-06-29T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston' },
  { fifaMatchNumber: 74, stage: 'round-of-32', homeTeam: 'Winner Group E', awayTeam: 'Third Group A/B/C/D/F', date: '2026-06-29T20:30:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough' },
  { fifaMatchNumber: 75, stage: 'round-of-32', homeTeam: 'Winner Group F', awayTeam: 'Runner-up Group C', date: '2026-06-30T01:00:00.000Z', venue: 'Estadio BBVA', city: 'Guadalupe' },
  { fifaMatchNumber: 78, stage: 'round-of-32', homeTeam: 'Runner-up Group E', awayTeam: 'Runner-up Group I', date: '2026-06-30T17:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington' },
  { fifaMatchNumber: 77, stage: 'round-of-32', homeTeam: 'Winner Group I', awayTeam: 'Third Group C/D/F/G/H', date: '2026-06-30T21:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { fifaMatchNumber: 79, stage: 'round-of-32', homeTeam: 'Winner Group A', awayTeam: 'Third Group C/E/F/H/I', date: '2026-07-01T01:00:00.000Z', venue: 'Estadio Azteca', city: 'Mexico City' },
  { fifaMatchNumber: 80, stage: 'round-of-32', homeTeam: 'Winner Group L', awayTeam: 'Third Group E/H/I/J/K', date: '2026-07-01T16:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { fifaMatchNumber: 82, stage: 'round-of-32', homeTeam: 'Winner Group G', awayTeam: 'Third Group A/E/H/I/J', date: '2026-07-01T20:00:00.000Z', venue: 'Lumen Field', city: 'Seattle' },
  { fifaMatchNumber: 81, stage: 'round-of-32', homeTeam: 'Winner Group D', awayTeam: 'Third Group B/E/F/I/J', date: '2026-07-02T00:00:00.000Z', venue: "Levi's Stadium", city: 'Santa Clara' },
  { fifaMatchNumber: 84, stage: 'round-of-32', homeTeam: 'Winner Group H', awayTeam: 'Runner-up Group J', date: '2026-07-02T19:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood' },
  { fifaMatchNumber: 83, stage: 'round-of-32', homeTeam: 'Runner-up Group K', awayTeam: 'Runner-up Group L', date: '2026-07-02T23:00:00.000Z', venue: 'BMO Field', city: 'Toronto' },
  { fifaMatchNumber: 85, stage: 'round-of-32', homeTeam: 'Winner Group B', awayTeam: 'Third Group E/F/G/I/J', date: '2026-07-03T03:00:00.000Z', venue: 'BC Place', city: 'Vancouver' },
  { fifaMatchNumber: 88, stage: 'round-of-32', homeTeam: 'Runner-up Group D', awayTeam: 'Runner-up Group G', date: '2026-07-03T18:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington' },
  { fifaMatchNumber: 86, stage: 'round-of-32', homeTeam: 'Winner Group J', awayTeam: 'Runner-up Group H', date: '2026-07-03T22:00:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { fifaMatchNumber: 87, stage: 'round-of-32', homeTeam: 'Winner Group K', awayTeam: 'Third Group D/E/I/J/L', date: '2026-07-04T01:30:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { fifaMatchNumber: 90, stage: 'round-of-16', homeTeam: 'Winner Match 73', awayTeam: 'Winner Match 75', date: '2026-07-04T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston' },
  { fifaMatchNumber: 89, stage: 'round-of-16', homeTeam: 'Winner Match 74', awayTeam: 'Winner Match 77', date: '2026-07-04T21:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { fifaMatchNumber: 91, stage: 'round-of-16', homeTeam: 'Winner Match 76', awayTeam: 'Winner Match 78', date: '2026-07-05T20:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { fifaMatchNumber: 92, stage: 'round-of-16', homeTeam: 'Winner Match 79', awayTeam: 'Winner Match 80', date: '2026-07-06T00:00:00.000Z', venue: 'Estadio Azteca', city: 'Mexico City' },
  { fifaMatchNumber: 93, stage: 'round-of-16', homeTeam: 'Winner Match 83', awayTeam: 'Winner Match 84', date: '2026-07-06T19:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington' },
  { fifaMatchNumber: 94, stage: 'round-of-16', homeTeam: 'Winner Match 81', awayTeam: 'Winner Match 82', date: '2026-07-07T00:00:00.000Z', venue: 'Lumen Field', city: 'Seattle' },
  { fifaMatchNumber: 95, stage: 'round-of-16', homeTeam: 'Winner Match 86', awayTeam: 'Winner Match 88', date: '2026-07-07T16:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { fifaMatchNumber: 96, stage: 'round-of-16', homeTeam: 'Winner Match 85', awayTeam: 'Winner Match 87', date: '2026-07-07T20:00:00.000Z', venue: 'BC Place', city: 'Vancouver' },
  { fifaMatchNumber: 97, stage: 'quarter', homeTeam: 'Winner Match 89', awayTeam: 'Winner Match 90', date: '2026-07-09T20:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough' },
  { fifaMatchNumber: 98, stage: 'quarter', homeTeam: 'Winner Match 93', awayTeam: 'Winner Match 94', date: '2026-07-10T19:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood' },
  { fifaMatchNumber: 99, stage: 'quarter', homeTeam: 'Winner Match 91', awayTeam: 'Winner Match 92', date: '2026-07-11T21:00:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { fifaMatchNumber: 100, stage: 'quarter', homeTeam: 'Winner Match 95', awayTeam: 'Winner Match 96', date: '2026-07-12T01:00:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { fifaMatchNumber: 101, stage: 'semi', homeTeam: 'Winner Match 97', awayTeam: 'Winner Match 98', date: '2026-07-14T19:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington' },
  { fifaMatchNumber: 102, stage: 'semi', homeTeam: 'Winner Match 99', awayTeam: 'Winner Match 100', date: '2026-07-15T19:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { fifaMatchNumber: 103, stage: 'third-place', homeTeam: 'Loser Match 101', awayTeam: 'Loser Match 102', date: '2026-07-18T21:00:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { fifaMatchNumber: 104, stage: 'final', homeTeam: 'Winner Match 101', awayTeam: 'Winner Match 102', date: '2026-07-19T19:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford' },
]