/**
 * Key players to watch — sourced from Reuters (Jun 11, 2026).
 * Primary: https://www.reuters.com/sports/soccer/world-cup-2026-teams-qualified-key-players-fixtures-2026-06-11/
 * Syndicated: https://www.straitstimes.com/sport/football/world-cup-2026-teams-qualified-key-players-and-fixtures
 */

export const REUTERS_WC2026_ARTICLE_URL =
  'https://www.reuters.com/sports/soccer/world-cup-2026-teams-qualified-key-players-fixtures-2026-06-11/'

export type ReutersKeyPlayer = {
  name: string
  position?: string
  club?: string
  note?: string
  aliases?: string[]
}

export type ReutersTeamProfile = {
  team: string
  group: string
  keyPlayers: ReutersKeyPlayer[]
  teamContext?: string
}

export const REUTERS_TEAM_PROFILES: ReutersTeamProfile[] = [
  {
    team: 'Mexico',
    group: 'A',
    keyPlayers: [
      { name: 'Raúl Jiménez', position: 'FW', club: 'Fulham' },
      { name: 'Guillermo Ochoa', position: 'GK', aliases: ['Memo Ochoa'] },
      { name: 'Gilberto Mora', position: 'MF', club: 'Tijuana', note: 'Youngest player at the tournament (17)' },
    ],
  },
  {
    team: 'South Africa',
    group: 'A',
    keyPlayers: [
      { name: 'Relebohile Mofokeng', position: 'FW', club: 'Orlando Pirates', note: 'Rising winger to watch' },
    ],
    teamContext: 'Fourth World Cup; yet to pass the group stage.',
  },
  {
    team: 'South Korea',
    group: 'A',
    keyPlayers: [
      { name: 'Lee Kang-in', position: 'MF', club: 'Paris Saint-Germain', aliases: ['Kang-in Lee'] },
      { name: 'Son Heung-min', position: 'FW', club: 'Tottenham', note: 'Former captain' },
    ],
  },
  {
    team: 'Czech Republic',
    group: 'A',
    keyPlayers: [
      { name: 'Patrik Schick', position: 'FW', club: 'Bayer Leverkusen' },
      { name: 'Tomáš Souček', position: 'MF', club: 'West Ham United', aliases: ['Tomas Soucek'] },
      { name: 'Pavel Šulc', position: 'MF', club: 'Lyon', aliases: ['Pavel Sulc'] },
    ],
  },
  {
    team: 'Canada',
    group: 'B',
    keyPlayers: [
      { name: 'Alphonso Davies', position: 'DF', club: 'Bayern Munich' },
      { name: 'Jonathan David', position: 'FW', club: 'Juventus' },
    ],
  },
  {
    team: 'Bosnia and Herzegovina',
    group: 'B',
    keyPlayers: [
      { name: 'Edin Džeko', position: 'FW', club: 'Schalke 04', aliases: ['Edin Dzeko'] },
      { name: 'Sead Kolašinac', position: 'DF', club: 'Atalanta', aliases: ['Sead Kolasinac'] },
      { name: 'Tarik Muharemović', position: 'DF', note: 'Emerging center-back' },
      { name: 'Kerim Alajbegović', position: 'FW', club: 'Bayer Leverkusen' },
      { name: 'Esmir Bajraktarević', position: 'FW', club: 'PSV Eindhoven' },
    ],
  },
  {
    team: 'Qatar',
    group: 'B',
    keyPlayers: [
      { name: 'Hassan Al-Haydos', position: 'MF', note: 'Captain', aliases: ['Hassan Al Haydos', 'Hassan Al-Haydos'] },
      { name: 'Almoez Ali', position: 'FW' },
    ],
  },
  {
    team: 'Switzerland',
    group: 'B',
    keyPlayers: [
      { name: 'Granit Xhaka', position: 'MF', note: 'Captain' },
      { name: 'Remo Freuler', position: 'MF' },
      { name: 'Breel Embolo', position: 'FW' },
      { name: 'Dan Ndoye', position: 'FW', club: 'Nottingham Forest' },
      { name: 'Noah Okafor', position: 'FW', club: 'Leeds United' },
    ],
  },
  {
    team: 'Brazil',
    group: 'C',
    keyPlayers: [
      { name: 'Vinícius Jr.', position: 'FW', club: 'Real Madrid', aliases: ['Vinícius Júnior', 'Vinicius Jr'] },
      { name: 'Raphinha', position: 'FW', club: 'Barcelona' },
    ],
  },
  {
    team: 'Morocco',
    group: 'C',
    keyPlayers: [{ name: 'Achraf Hakimi', position: 'DF', club: 'Paris Saint-Germain', note: 'Captain' }],
  },
  {
    team: 'Haiti',
    group: 'C',
    keyPlayers: [
      { name: 'Duckens Nazon', position: 'FW', note: 'Star player; club football in Iran' },
    ],
    teamContext: 'First World Cup since 1974.',
  },
  {
    team: 'Scotland',
    group: 'C',
    keyPlayers: [
      { name: 'Andy Robertson', position: 'DF', club: 'Liverpool', aliases: ['Andrew Robertson'] },
      { name: 'Scott McTominay', position: 'MF', club: 'Napoli' },
    ],
  },
  {
    team: 'United States',
    group: 'D',
    keyPlayers: [{ name: 'Christian Pulisic', position: 'FW', club: 'AC Milan' }],
  },
  {
    team: 'Paraguay',
    group: 'D',
    keyPlayers: [],
    teamContext: 'Coach Gustavo Alfaro — psychology-led “grit” campaign; 2010 quarter-final pedigree.',
  },
  {
    team: 'Australia',
    group: 'D',
    keyPlayers: [
      { name: 'Nestory Irankunda', position: 'FW', aliases: ['Irankunda'] },
      { name: 'Mohamed Toure', position: 'FW' },
    ],
  },
  {
    team: 'Turkey',
    group: 'D',
    keyPlayers: [
      { name: 'Hakan Çalhanoğlu', position: 'MF', club: 'Inter Milan', aliases: ['Hakan Calhanoglu'] },
      { name: 'Arda Güler', position: 'MF', club: 'Real Madrid', aliases: ['Arda Guler'] },
    ],
  },
  {
    team: 'Germany',
    group: 'E',
    keyPlayers: [
      { name: 'Manuel Neuer', position: 'GK', club: 'Bayern Munich' },
      { name: 'Florian Wirtz', position: 'MF', club: 'Liverpool' },
      { name: 'Jamal Musiala', position: 'MF', club: 'Bayern Munich' },
    ],
  },
  {
    team: 'Curaçao',
    group: 'E',
    keyPlayers: [],
    teamContext: 'Smallest nation ever to qualify; coach Dick Advocaat.',
  },
  {
    team: 'Ivory Coast',
    group: 'E',
    keyPlayers: [],
    teamContext: 'Unbeaten African qualifiers; coach Emerse Faé.',
  },
  {
    team: 'Ecuador',
    group: 'E',
    keyPlayers: [],
    teamContext: 'Stalwart defence — five goals conceded in 18 qualifiers.',
  },
  {
    team: 'Netherlands',
    group: 'F',
    keyPlayers: [
      { name: 'Memphis Depay', position: 'FW', note: 'All-time top scorer' },
      { name: 'Virgil van Dijk', position: 'DF', club: 'Liverpool' },
      { name: 'Micky van de Ven', position: 'DF', club: 'Tottenham Hotspur' },
    ],
  },
  {
    team: 'Japan',
    group: 'F',
    keyPlayers: [
      { name: 'Wataru Endo', position: 'MF', note: 'Captain', aliases: ['Endo Wataru'] },
      { name: 'Takefusa Kubo', position: 'FW', aliases: ['Kubo Takefusa'] },
      { name: 'Ayase Ueda', position: 'FW', aliases: ['Ueda Ayase'] },
    ],
  },
  {
    team: 'Sweden',
    group: 'F',
    keyPlayers: [{ name: 'Viktor Gyökeres', position: 'FW', club: 'Arsenal', aliases: ['Viktor Gyokeres'] }],
    teamContext: 'Qualified via Nations League playoffs after last-place in main group.',
  },
  {
    team: 'Tunisia',
    group: 'F',
    keyPlayers: [
      { name: 'Aymen Dahmen', position: 'GK' },
      { name: 'Hannibal Mejbri', position: 'MF', club: 'Burnley' },
    ],
  },
  {
    team: 'Belgium',
    group: 'G',
    keyPlayers: [
      { name: 'Kevin De Bruyne', position: 'MF', club: 'Napoli' },
      { name: 'Thibaut Courtois', position: 'GK', club: 'Real Madrid' },
    ],
  },
  {
    team: 'Iran',
    group: 'G',
    keyPlayers: [
      { name: 'Alireza Jahanbakhsh', position: 'MF', note: 'Skipper' },
      { name: 'Mehdi Taremi', position: 'FW', club: 'Olympiacos' },
    ],
  },
  {
    team: 'New Zealand',
    group: 'G',
    keyPlayers: [],
    teamContext: 'Oceania winners; first World Cup since 2010.',
  },
  {
    team: 'Egypt',
    group: 'G',
    keyPlayers: [
      {
        name: 'Mohamed Salah',
        position: 'FW',
        note: 'Left Liverpool end of season; PL all-time top foreign goalscorer',
      },
    ],
  },
  {
    team: 'Spain',
    group: 'H',
    keyPlayers: [
      { name: 'Lamine Yamal', position: 'FW', club: 'Barcelona' },
      { name: 'Nico Williams', position: 'FW', club: 'Athletic Bilbao' },
    ],
  },
  {
    team: 'Cape Verde',
    group: 'H',
    keyPlayers: [],
    teamContext: 'World Cup debut — diaspora-built squad.',
  },
  {
    team: 'Saudi Arabia',
    group: 'H',
    keyPlayers: [],
    teamContext: '2022 win over Argentina; third straight World Cup.',
  },
  {
    team: 'Uruguay',
    group: 'H',
    keyPlayers: [
      { name: 'Federico Valverde', position: 'MF', club: 'Real Madrid' },
      { name: 'Ronald Araújo', position: 'DF', club: 'Barcelona', aliases: ['Ronald Araujo'] },
      { name: 'Darwin Núñez', position: 'FW', aliases: ['Darwin Nunez'] },
    ],
  },
  {
    team: 'France',
    group: 'I',
    keyPlayers: [],
    teamContext: 'Back-to-back finalists; Didier Deschamps’ last tournament.',
  },
  {
    team: 'Senegal',
    group: 'I',
    keyPlayers: [
      { name: 'Kalidou Koulibaly', position: 'DF', note: 'Captain' },
      { name: 'Sadio Mané', position: 'FW', note: 'All-time top scorer' },
    ],
  },
  {
    team: 'Iraq',
    group: 'I',
    keyPlayers: [],
    teamContext: 'First World Cup since 1986; coach Graham Arnold.',
  },
  {
    team: 'Norway',
    group: 'I',
    keyPlayers: [
      { name: 'Erling Haaland', position: 'FW', club: 'Manchester City', note: 'Premier League top scorer' },
    ],
  },
  {
    team: 'Argentina',
    group: 'J',
    keyPlayers: [
      { name: 'Lionel Messi', position: 'FW' },
      { name: 'Julián Álvarez', position: 'FW', aliases: ['Julian Alvarez'] },
      { name: 'Enzo Fernández', position: 'MF', aliases: ['Enzo Fernandez'] },
      { name: 'Alexis Mac Allister', position: 'MF' },
    ],
  },
  {
    team: 'Algeria',
    group: 'J',
    keyPlayers: [
      { name: 'Riyad Mahrez', position: 'FW', club: 'Al-Ahli' },
      { name: 'Mohamed Amine Amoura', position: 'FW', club: 'Wolfsburg', aliases: ['Mohamed Amoura'], note: 'Top scorer in African qualifiers (10 goals)' },
    ],
  },
  {
    team: 'Austria',
    group: 'J',
    keyPlayers: [{ name: 'David Alaba', position: 'DF', club: 'Real Madrid' }],
  },
  {
    team: 'Jordan',
    group: 'J',
    keyPlayers: [],
    teamContext: 'First-ever World Cup; coach Jamal Sellami.',
  },
  {
    team: 'Portugal',
    group: 'K',
    keyPlayers: [
      {
        name: 'Cristiano Ronaldo',
        position: 'FW',
        note: 'All-time goalscorer; sixth and final World Cup',
      },
    ],
  },
  {
    team: 'DR Congo',
    group: 'K',
    keyPlayers: [
      { name: 'Axel Tuanzebe', position: 'DF', club: 'Burnley', note: 'Scored playoff winner vs Jamaica' },
    ],
    teamContext: 'First World Cup since 1974 (as Zaire).',
  },
  {
    team: 'Uzbekistan',
    group: 'K',
    keyPlayers: [
      { name: 'Abdukodir Khusanov', position: 'DF', club: 'Manchester City' },
      { name: 'Eldor Shomurodov', position: 'FW', club: 'İstanbul Başakşehir' },
    ],
    teamContext: 'First World Cup; coach Fabio Cannavaro.',
  },
  {
    team: 'Colombia',
    group: 'K',
    keyPlayers: [
      { name: 'Luis Díaz', position: 'FW', club: 'Bayern Munich' },
      { name: 'James Rodríguez', position: 'MF', club: 'Minnesota United' },
      { name: 'Luis Suárez', position: 'FW', club: 'Sporting CP', note: 'As named by Reuters' },
    ],
  },
  {
    team: 'England',
    group: 'L',
    keyPlayers: [],
    teamContext: 'Thomas Tuchel; eight straight qualifying wins without conceding.',
  },
  {
    team: 'Croatia',
    group: 'L',
    keyPlayers: [{ name: 'Luka Modrić', position: 'MF', note: 'Veteran captain', aliases: ['Luka Modric'] }],
  },
  {
    team: 'Ghana',
    group: 'L',
    keyPlayers: [],
    teamContext: 'Coach Carlos Queiroz; 2010 quarter-final pedigree.',
  },
  {
    team: 'Panama',
    group: 'L',
    keyPlayers: [],
    teamContext: 'Second World Cup; yet to win a match.',
  },
]

function normalizePlayerName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const PLAYER_LOOKUP = new Map<string, { team: string; player: ReutersKeyPlayer }>()

for (const profile of REUTERS_TEAM_PROFILES) {
  for (const player of profile.keyPlayers) {
    const names = [player.name, ...(player.aliases ?? [])]
    for (const n of names) {
      PLAYER_LOOKUP.set(`${profile.team}|${normalizePlayerName(n)}`, { team: profile.team, player })
      PLAYER_LOOKUP.set(normalizePlayerName(n), { team: profile.team, player })
    }
  }
}

const TEAM_LOOKUP = new Map(REUTERS_TEAM_PROFILES.map((p) => [p.team, p]))

export function getReutersTeamProfile(team: string): ReutersTeamProfile | undefined {
  return TEAM_LOOKUP.get(team)
}

export function getReutersKeyPlayerMeta(
  playerName: string,
  team: string
): { keyPlayer: boolean; scoutNote?: string; scoutSource?: string } {
  const hit =
    PLAYER_LOOKUP.get(`${team}|${normalizePlayerName(playerName)}`) ??
    PLAYER_LOOKUP.get(normalizePlayerName(playerName))

  if (!hit || hit.team !== team) {
    return { keyPlayer: false }
  }

  const parts = [
    hit.player.position,
    hit.player.club,
    hit.player.note,
  ].filter(Boolean)

  return {
    keyPlayer: true,
    scoutNote: parts.length > 0 ? parts.join(' · ') : 'Reuters key player to watch',
    scoutSource: 'Reuters (Jun 2026)',
  }
}

export function listReutersKeyPlayersForTeam(team: string): ReutersKeyPlayer[] {
  return TEAM_LOOKUP.get(team)?.keyPlayers ?? []
}

export function getReutersTeamKeyPlayerLabel(team: string): string {
  const profile = getReutersTeamProfile(team)
  if (!profile) return 'TBD'
  if (profile.keyPlayers.length > 0) {
    return profile.keyPlayers.map((p) => p.name).join(', ')
  }
  if (profile.teamContext) return profile.teamContext
  return 'TBD'
}

export function rosterMatchesReutersPlayer(
  rosterName: string,
  reutersPlayer: ReutersKeyPlayer
): boolean {
  const names = [reutersPlayer.name, ...(reutersPlayer.aliases ?? [])].map(normalizePlayerName)
  const normalized = normalizePlayerName(rosterName)
  return names.includes(normalized)
}