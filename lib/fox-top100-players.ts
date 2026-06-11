/**
 * FOX Sports Top 100 players — 2026 FIFA World Cup (updated Jun 11, 2026).
 * Source: https://www.foxsports.com/stories/soccer/world-cup-2026-ranking-best-100-players
 */

export const FOX_TOP100_ARTICLE_URL =
  'https://www.foxsports.com/stories/soccer/world-cup-2026-ranking-best-100-players'

export type FoxTop100Player = {
  rank: number
  name: string
  team: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
  age: number
  caps: number
  club: string
  aliases?: string[]
  /** Squad omission or injury — article editor's note */
  unavailable?: string
}

export const FOX_TOP_100_PLAYERS: FoxTop100Player[] = [
  { rank: 1, name: "Lamine Yamal", team: "Spain", position: "FW", age: 18, caps: 25, club: "Barcelona" },
  { rank: 2, name: "Kylian Mbappé", team: "France", position: "FW", age: 27, caps: 96, club: "Real Madrid" },
  { rank: 3, name: "Harry Kane", team: "England", position: "FW", age: 32, caps: 112, club: "Bayern Munich" },
  { rank: 4, name: "Ousmane Dembélé", team: "France", position: "FW", age: 28, caps: 58, club: "Paris Saint-Germain" },
  { rank: 5, name: "Michael Olise", team: "France", position: "FW", age: 24, caps: 15, club: "Bayern Munich" },
  { rank: 6, name: "Erling Haaland", team: "Norway", position: "FW", age: 25, caps: 49, club: "Manchester City" },
  { rank: 7, name: "Vinícius Júnior", team: "Brazil", position: "FW", age: 25, caps: 47, club: "Real Madrid", aliases: ["Vinícius Jr.", "Vinicius Jr", "Vinícius Jr"] },
  { rank: 8, name: "Achraf Hakimi", team: "Morocco", position: "DF", age: 27, caps: 95, club: "Paris Saint-Germain", aliases: ["Achraf Hakimi"] },
  { rank: 9, name: "Vitinha", team: "Portugal", position: "MF", age: 26, caps: 37, club: "Paris Saint-Germain" },
  { rank: 10, name: "Pedri", team: "Spain", position: "MF", age: 23, caps: 40, club: "Barcelona" },
  { rank: 11, name: "Federico Valverde", team: "Uruguay", position: "MF", age: 27, caps: 73, club: "Real Madrid" },
  { rank: 12, name: "Bruno Fernandes", team: "Portugal", position: "MF", age: 31, caps: 87, club: "Manchester United" },
  { rank: 13, name: "Julián Álvarez", team: "Argentina", position: "FW", age: 26, caps: 51, club: "Atlético Madrid" },
  { rank: 14, name: "Rodri", team: "Spain", position: "MF", age: 29, caps: 61, club: "Manchester City" },
  { rank: 15, name: "Raphinha", team: "Brazil", position: "FW", age: 29, caps: 37, club: "Barcelona" },
  { rank: 16, name: "Lionel Messi", team: "Argentina", position: "FW", age: 38, caps: 198, club: "Inter Miami" },
  { rank: 17, name: "João Neves", team: "Portugal", position: "MF", age: 21, caps: 21, club: "Paris Saint-Germain" },
  { rank: 18, name: "Jude Bellingham", team: "England", position: "MF", age: 22, caps: 46, club: "Real Madrid" },
  { rank: 19, name: "Declan Rice", team: "England", position: "MF", age: 27, caps: 72, club: "Arsenal" },
  { rank: 20, name: "Moisés Caicedo", team: "Ecuador", position: "MF", age: 24, caps: 60, club: "Chelsea" },
  { rank: 21, name: "Gabriel Magalhães", team: "Brazil", position: "DF", age: 28, caps: 17, club: "Arsenal" },
  { rank: 22, name: "Florian Wirtz", team: "Germany", position: "MF", age: 23, caps: 39, club: "Liverpool" },
  { rank: 23, name: "Luis Díaz", team: "Colombia", position: "FW", age: 29, caps: 72, club: "Bayern Munich" },
  { rank: 24, name: "Antoine Semenyo", team: "Ghana", position: "FW", age: 26, caps: 34, club: "Manchester City" },
  { rank: 25, name: "Aurélien Tchouaméni", team: "France", position: "MF", age: 26, caps: 44, club: "Real Madrid", unavailable: "Tchouaméni will miss the World Cup after not being selected for France's 26-man squad." },
  { rank: 26, name: "Lautaro Martínez", team: "Argentina", position: "FW", age: 28, caps: 75, club: "Inter Milan" },
  { rank: 27, name: "Bukayo Saka", team: "England", position: "FW", age: 24, caps: 48, club: "Arsenal" },
  { rank: 28, name: "Virgil van Dijk", team: "Netherlands", position: "DF", age: 34, caps: 90, club: "Liverpool" },
  { rank: 29, name: "Joshua Kimmich", team: "Germany", position: "MF", age: 31, caps: 108, club: "Bayern Munich" },
  { rank: 30, name: "Alphonso Davies", team: "Canada", position: "DF", age: 25, caps: 58, club: "Bayern Munich" },
  { rank: 31, name: "Bernardo Silva", team: "Portugal", position: "MF", age: 31, caps: 107, club: "Manchester City" },
  { rank: 32, name: "Jamal Musiala", team: "Germany", position: "MF", age: 23, caps: 40, club: "Bayern Munich" },
  { rank: 33, name: "Cole Palmer", team: "England", position: "MF", age: 24, caps: 14, club: "Chelsea", unavailable: "Palmer will miss the World Cup after not being selected for England's 26-man squad." },
  { rank: 34, name: "Luka Modrić", team: "Croatia", position: "MF", age: 40, caps: 196, club: "AC Milan", aliases: ["Luka Modric"] },
  { rank: 35, name: "Nuno Mendes", team: "Portugal", position: "DF", age: 23, caps: 43, club: "Paris Saint-Germain" },
  { rank: 36, name: "Denzel Dumfries", team: "Netherlands", position: "DF", age: 30, caps: 71, club: "Inter Milan" },
  { rank: 37, name: "Kevin De Bruyne", team: "Belgium", position: "MF", age: 34, caps: 117, club: "Napoli" },
  { rank: 38, name: "Désiré Doué", team: "France", position: "FW", age: 20, caps: 6, club: "Paris Saint-Germain", aliases: ["Desire Doue"] },
  { rank: 39, name: "Jérémy Doku", team: "Belgium", position: "FW", age: 23, caps: 41, club: "Manchester City", aliases: ["Jeremy Doku"] },
  { rank: 40, name: "Cristiano Ronaldo", team: "Portugal", position: "FW", age: 41, caps: 226, club: "Al-Nassr" },
  { rank: 41, name: "Rayan Cherki", team: "France", position: "FW", age: 22, caps: 5, club: "Manchester City" },
  { rank: 42, name: "Antonio Rüdiger", team: "Germany", position: "DF", age: 33, caps: 82, club: "Real Madrid", aliases: ["Antonio Rudiger"] },
  { rank: 43, name: "N'Golo Kanté", team: "France", position: "MF", age: 35, caps: 67, club: "Fenerbahçe", aliases: ["N Golo Kante", "NGolo Kante"] },
  { rank: 44, name: "Thibaut Courtois", team: "Belgium", position: "GK", age: 34, caps: 107, club: "Real Madrid" },
  { rank: 45, name: "Tijjani Reijnders", team: "Netherlands", position: "MF", age: 27, caps: 30, club: "Manchester City" },
  { rank: 46, name: "Rúben Dias", team: "Portugal", position: "DF", age: 29, caps: 74, club: "Manchester City" },
  { rank: 47, name: "Bruno Guimarães", team: "Brazil", position: "MF", age: 28, caps: 41, club: "Newcastle" },
  { rank: 48, name: "Emiliano Martínez", team: "Argentina", position: "GK", age: 33, caps: 59, club: "Aston Villa" },
  { rank: 49, name: "Frenkie de Jong", team: "Netherlands", position: "MF", age: 29, caps: 64, club: "Barcelona" },
  { rank: 50, name: "Marc Cucurella", team: "Spain", position: "DF", age: 27, caps: 23, club: "Chelsea" },
  { rank: 51, name: "Sadio Mané", team: "Senegal", position: "FW", age: 34, caps: 124, club: "Al-Nassr" },
  { rank: 52, name: "Martín Zubimendi", team: "Spain", position: "MF", age: 27, caps: 25, club: "Arsenal" },
  { rank: 53, name: "Nico Williams", team: "Spain", position: "FW", age: 23, caps: 30, club: "Athletic Club Bilbao" },
  { rank: 54, name: "Enzo Fernández", team: "Argentina", position: "MF", age: 25, caps: 40, club: "Chelsea" },
  { rank: 55, name: "Martin Ødegaard", team: "Norway", position: "MF", age: 27, caps: 67, club: "Arsenal", aliases: ["Martin Odegaard"] },
  { rank: 56, name: "Willian Pacho", team: "Ecuador", position: "DF", age: 24, caps: 34, club: "Paris Saint-Germain" },
  { rank: 57, name: "Scott McTominay", team: "Scotland", position: "MF", age: 29, caps: 69, club: "Napoli" },
  { rank: 58, name: "Ryan Gravenberch", team: "Netherlands", position: "MF", age: 23, caps: 25, club: "Liverpool" },
  { rank: 59, name: "Mohamed Salah", team: "Egypt", position: "FW", age: 33, caps: 113, club: "Liverpool", aliases: ["Mo Salah"] },
  { rank: 60, name: "Fermin López", team: "Spain", position: "MF", age: 22, caps: 7, club: "Barcelona" },
  { rank: 61, name: "Cody Gakpo", team: "Netherlands", position: "FW", age: 26, caps: 48, club: "Liverpool" },
  { rank: 62, name: "Joško Gvardiol", team: "Croatia", position: "DF", age: 24, caps: 46, club: "Manchester City" },
  { rank: 63, name: "Ibrahima Konaté", team: "France", position: "DF", age: 26, caps: 27, club: "Liverpool" },
  { rank: 64, name: "Alisson", team: "Brazil", position: "GK", age: 33, caps: 76, club: "Liverpool" },
  { rank: 65, name: "Pau Cubarsí", team: "Spain", position: "DF", age: 19, caps: 11, club: "Barcelona" },
  { rank: 66, name: "Marquinhos", team: "Brazil", position: "DF", age: 31, caps: 104, club: "Paris Saint-Germain" },
  { rank: 67, name: "William Saliba", team: "France", position: "DF", age: 25, caps: 31, club: "Arsenal" },
  { rank: 68, name: "João Pedro", team: "Brazil", position: "FW", age: 24, caps: 8, club: "Chelsea", unavailable: "Pedro will miss the World Cup after not being selected for Brazil's 26-man squad." },
  { rank: 69, name: "Mike Maignan", team: "France", position: "GK", age: 30, caps: 38, club: "AC Milan" },
  { rank: 70, name: "Ismaïla Sarr", team: "Senegal", position: "FW", age: 28, caps: 82, club: "Crystal Palace" },
  { rank: 71, name: "Rafael Leão", team: "Portugal", position: "FW", age: 26, caps: 43, club: "AC Milan" },
  { rank: 72, name: "Alexis Mac Allister", team: "Argentina", position: "MF", age: 27, caps: 44, club: "Liverpool" },
  { rank: 73, name: "Weston McKennie", team: "United States", position: "MF", age: 27, caps: 64, club: "Juventus" },
  { rank: 74, name: "Gabriel Martinelli", team: "Brazil", position: "FW", age: 24, caps: 22, club: "Arsenal" },
  { rank: 75, name: "João Cancelo", team: "Portugal", position: "DF", age: 31, caps: 66, club: "Barcelona (Spain), on loan from Al-Hilal", aliases: ["Joao Cancelo"] },
  { rank: 76, name: "Dani Olmo", team: "Spain", position: "FW", age: 27, caps: 48, club: "Barcelona" },
  { rank: 77, name: "Viktor Gyökeres", team: "Sweden", position: "FW", age: 27, caps: 32, club: "Arsenal" },
  { rank: 78, name: "Arda Güler", team: "Turkey", position: "FW", age: 21, caps: 28, club: "Real Madrid" },
  { rank: 79, name: "Christian Pulisic", team: "United States", position: "FW", age: 27, caps: 84, club: "AC Milan", aliases: ["Christian Pulisic"] },
  { rank: 80, name: "Jules Koundé", team: "France", position: "DF", age: 27, caps: 46, club: "Barcelona" },
  { rank: 81, name: "Son Heung-min", team: "South Korea", position: "FW", age: 33, caps: 143, club: "LAFC", aliases: ["Heung-min Son"] },
  { rank: 82, name: "Reece James", team: "England", position: "DF", age: 26, caps: 22, club: "Chelsea" },
  { rank: 83, name: "Jeremie Frimpong", team: "Netherlands", position: "DF", age: 25, caps: 15, club: "Liverpool" },
  { rank: 84, name: "Marc Guéhi", team: "England", position: "DF", age: 25, caps: 27, club: "Manchester City" },
  { rank: 85, name: "Fabián Ruiz", team: "Spain", position: "MF", age: 30, caps: 41, club: "Paris Saint-Germain" },
  { rank: 86, name: "Casemiro", team: "Brazil", position: "MF", age: 34, caps: 84, club: "Manchester United" },
  { rank: 87, name: "Mikel Merino", team: "Spain", position: "MF", age: 29, caps: 41, club: "Arsenal" },
  { rank: 88, name: "Eberechi Eze", team: "England", position: "FW", age: 27, caps: 16, club: "Arsenal" },
  { rank: 89, name: "Kenan Yıldız", team: "Turkey", position: "FW", age: 20, caps: 28, club: "Juventus" },
  { rank: 90, name: "Raúl Jiménez", team: "Mexico", position: "FW", age: 34, caps: 125, club: "Fulham" },
  { rank: 91, name: "Gonçalo Ramos", team: "Portugal", position: "FW", age: 24, caps: 24, club: "Paris Saint-Germain" },
  { rank: 92, name: "Mikel Oyarzabal", team: "Spain", position: "FW", age: 29, caps: 52, club: "Real Sociedad" },
  { rank: 93, name: "Marcus Thuram", team: "France", position: "FW", age: 28, caps: 33, club: "Inter Milan", aliases: ["Marcus Thuram"] },
  { rank: 94, name: "Kaoru Mitoma", team: "Japan", position: "FW", age: 28, caps: 31, club: "Brighton", unavailable: "Mitoma will miss the World Cup due to a hamstring injury on May 9." },
  { rank: 95, name: "Phil Foden", team: "England", position: "FW", age: 25, caps: 49, club: "Manchester City", unavailable: "Foden will miss the World Cup after not being selected for England's 26-man squad." },
  { rank: 96, name: "Lisandro Martínez", team: "Argentina", position: "DF", age: 28, caps: 26, club: "Manchester United" },
  { rank: 97, name: "Bradley Barcola", team: "France", position: "FW", age: 23, caps: 18, club: "Paris Saint-Germain" },
  { rank: 98, name: "Kim Min-jae", team: "South Korea", position: "DF", age: 29, caps: 77, club: "Bayern Munich" },
  { rank: 99, name: "Alexander Isak", team: "Sweden", position: "FW", age: 26, caps: 56, club: "Liverpool" },
  { rank: 100, name: "Pervis Estupiñán", team: "Ecuador", position: "DF", age: 28, caps: 52, club: "AC Milan" },
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

const PLAYER_LOOKUP = new Map<string, FoxTop100Player>()

for (const player of FOX_TOP_100_PLAYERS) {
  const names = [player.name, ...(player.aliases ?? [])]
  for (const n of names) {
    PLAYER_LOOKUP.set(`${player.team}|${normalizePlayerName(n)}`, player)
    PLAYER_LOOKUP.set(normalizePlayerName(n), player)
  }
}

export function getFoxTop100Player(name: string, team: string): FoxTop100Player | undefined {
  return (
    PLAYER_LOOKUP.get(`${team}|${normalizePlayerName(name)}`) ??
    PLAYER_LOOKUP.get(normalizePlayerName(name))
  )
}

export function getFoxTop100Meta(
  playerName: string,
  team: string
): {
  foxRank?: number
  foxCaps?: number
  foxUnavailable?: string
  scoutNote?: string
  scoutSource?: string
} {
  const hit = getFoxTop100Player(playerName, team)
  if (!hit || hit.team !== team) return {}

  const parts = [
    `#${hit.rank} in FOX Top 100`,
    hit.position,
    hit.club,
    hit.caps > 0 ? `${hit.caps} caps` : undefined,
    hit.age ? `age ${hit.age}` : undefined,
    hit.unavailable,
  ].filter(Boolean)

  return {
    foxRank: hit.rank,
    foxCaps: hit.caps > 0 ? hit.caps : undefined,
    ...(hit.unavailable ? { foxUnavailable: hit.unavailable } : {}),
    scoutNote: parts.join(' · '),
    scoutSource: 'FOX Sports Top 100 (Jun 2026)',
  }
}

export function listFoxTop100ForTeam(team: string): FoxTop100Player[] {
  return FOX_TOP_100_PLAYERS.filter((p) => p.team === team).sort((a, b) => a.rank - b.rank)
}

export function getFoxTop100Leaderboard(limit = 25): FoxTop100Player[] {
  return [...FOX_TOP_100_PLAYERS].sort((a, b) => a.rank - b.rank).slice(0, limit)
}
