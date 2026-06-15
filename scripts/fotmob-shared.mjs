import { FIFA_TEAM_NAME_MAP } from '../lib/fifa-sync.ts'

export const FOTMOB_HEADERS = {
  'User-Agent': 'Mozilla/5.0',
  Accept: 'application/json',
  Referer: 'https://www.fotmob.com/',
}

export const FOTMOB_TEAM_TO_MATCHMIND = {
  USA: 'United States',
  Czechia: 'Czech Republic',
  'Bosnia-Herzegovina': 'Bosnia and Herzegovina',
  'Bosnia and Herzegovina': 'Bosnia and Herzegovina',
  'Congo DR': 'DR Congo',
  "Côte d'Ivoire": 'Ivory Coast',
  "Cote d'Ivoire": 'Ivory Coast',
  'Ivory Coast': 'Ivory Coast',
  CIV: 'Ivory Coast',
  Curacao: 'Curaçao',
  'IR Iran': 'Iran',
  Türkiye: 'Turkey',
  Turkiye: 'Turkey',
  'Korea Republic': 'South Korea',
  'South Korea': 'South Korea',
  'Cabo Verde': 'Cape Verde',
  ...Object.fromEntries(Object.entries(FIFA_TEAM_NAME_MAP).map(([k, v]) => [k, v])),
}

export const NAME_ALIASES = {
  'giovanni reyna': 'Gio Reyna',
  'gio reyna': 'Gio Reyna',
  'vinicius junior': 'Vinícius Júnior',
  'vinícius junior': 'Vinícius Júnior',
  'hwang in-beom': 'Hwang In-beom',
  'in-beom hwang': 'Hwang In-beom',
  'hwang hee-chan': 'Hwang Hee-chan',
  'hee-chan hwang': 'Hwang Hee-chan',
  'lee kang-in': 'Lee Kang-in',
  'kang-in lee': 'Lee Kang-in',
  'oh hyeon-gyu': 'Oh Hyeon-gyu',
  'hyun-gyu oh': 'Oh Hyeon-gyu',
  'julian quinones': 'Julián Quiñones',
  'raul jimenez': 'Raúl Jiménez',
  'erik lira': 'Érik Lira',
  'ismael kone': 'Ismaël Koné',
  'cyrienco summerville': 'Crysencio Summerville',
  'matthias svanberg': 'Mattias Svanberg',
  'jovo lukic': 'Jovo Lukic',
  'vladimir coufal': 'Vladimir Coufal',
  'ladislav krejci': 'Ladislav Krejci',
  'wilfried singo': 'Wilfried Singo',
  'amad diallo': 'Amad Diallo',
  'viktor gyokeres': 'Viktor Gyökeres',
  'mauricio': 'Maurício',
  'sead kolasinac': 'Sead Kolasinac',
  'alisson becker': 'Alisson',
  gabriel: 'Gabriel Magalhães',
  "aiden o'neill": "Aiden O\u2019Neill",
  'gi-hyuk lee': 'Lee Ki-hyuk',
  'han-beom lee': 'Lee Han-beom',
  'min-jae kim': 'Kim Min-jae',
  'seung-gyu kim': 'Kim Seung-gyu',
  'young-woo seol': 'Seol Young-woo',
  'seung-ho paik': 'Paik Seung-ho',
  'tae-seok lee': 'Lee Tae-seok',
  'jae-sung lee': 'Lee Jae-sung',
  'heung-min son': 'Son Heung-min',
  'juan caceres': 'Juan Cáceres',
}

export function norm(s) {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[''`´]/g, "'")
    .toLowerCase()
    .trim()
}

export function flippedNameCandidates(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length !== 2) return []
  const [given, family] = parts
  if (!given.includes('-')) return []
  const title = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  const givenParts = given.split('-').map(title)
  return [`${title(family)} ${givenParts.join('-')}`, `${title(family)} ${givenParts.join(' ')}`]
}

export function buildRosterIndex(names) {
  const byNorm = new Map()
  for (const name of names) {
    byNorm.set(norm(name), name)
  }
  return byNorm
}

export function resolvePlayerName(fotmobName, rosterIndex) {
  const alias = NAME_ALIASES[norm(fotmobName)]
  if (alias && rosterIndex.has(norm(alias))) return alias

  const direct = rosterIndex.get(norm(fotmobName))
  if (direct) return direct

  for (const candidate of flippedNameCandidates(fotmobName)) {
    const hit = rosterIndex.get(norm(candidate))
    if (hit) return hit
  }

  const parts = norm(fotmobName).split(/\s+/)
  const last = parts[parts.length - 1]
  const matches = [...rosterIndex.entries()].filter(([k]) => k.split(/\s+/).pop() === last)
  if (matches.length === 1) return matches[0][1]

  return null
}

export function mapFotmobTeamName(fotmobName) {
  return FOTMOB_TEAM_TO_MATCHMIND[fotmobName] ?? fotmobName
}

export async function fetchFotmobTeamIds(rosterTeamNames) {
  const league = process.env.FOTMOB_LEAGUE ?? '77'
  const season = process.env.FOTMOB_SEASON ?? '24254'
  const url = `https://www.fotmob.com/api/data/leagues?id=${league}&season=${season}&tab=fixtures`
  const data = await fetch(url, { headers: FOTMOB_HEADERS }).then((r) => {
    if (!r.ok) throw new Error(`FotMob fixtures: ${r.status}`)
    return r.json()
  })

  const rosterSet = new Set(rosterTeamNames)
  const byMatchMind = new Map()

  for (const m of data.fixtures?.allMatches ?? []) {
    for (const side of [m.home, m.away]) {
      if (!side?.id || !side?.name) continue
      const matchMindName = mapFotmobTeamName(side.name)
      if (!rosterSet.has(matchMindName)) continue
      byMatchMind.set(matchMindName, Number(side.id))
    }
  }

  return byMatchMind
}

export async function fetchTeamSquad(fotmobTeamId) {
  const url = `https://www.fotmob.com/api/data/teams?id=${fotmobTeamId}&tab=squad`
  const data = await fetch(url, { headers: FOTMOB_HEADERS }).then((r) => {
    if (!r.ok) throw new Error(`FotMob squad ${fotmobTeamId}: ${r.status}`)
    return r.json()
  })
  const groups = data.squad?.squad ?? []
  return groups
    .flatMap((g) => g.members ?? [])
    .filter((m) => m.id && m.name && m.role?.key !== 'coach')
}

export async function fetchPlayerData(fotmobId) {
  const url = `https://www.fotmob.com/api/data/playerData?id=${fotmobId}`
  const r = await fetch(url, { headers: FOTMOB_HEADERS })
  if (!r.ok) throw new Error(`FotMob playerData ${fotmobId}: ${r.status}`)
  return r.json()
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatMatchResult(m) {
  const home = m.homeScore ?? 0
  const away = m.awayScore ?? 0
  const teamScore = m.isHomeTeam ? home : away
  const oppScore = m.isHomeTeam ? away : home
  const suffix = teamScore > oppScore ? 'W' : teamScore < oppScore ? 'L' : 'D'
  return `${teamScore}-${oppScore} ${suffix}`
}

export function toClubMatch(m) {
  return {
    date: m.matchDate?.utcTime?.slice(0, 10) ?? '',
    opponent: m.opponentTeamName ?? '',
    competition: m.leagueName ?? '',
    result: formatMatchResult(m),
    goals: m.goals ?? 0,
    assists: m.assists ?? 0,
    minutes: m.minutesPlayed ?? 0,
    rating: m.ratingProps?.rating ? Number(m.ratingProps.rating) : undefined,
  }
}

export function parsePlayerEnrichment(data, wcLeagueId = 77) {
  const stats = data.mainLeague?.stats ?? []
  const stat = (id) => stats.find((s) => s.localizedTitleId === id)?.value ?? 0

  const recentMatches = data.recentMatches ?? []
  const clubRaw = recentMatches.filter((m) => m.leagueId !== wcLeagueId)
  const wcRaw = recentMatches.filter((m) => m.leagueId === wcLeagueId)

  const recentClubMatches = clubRaw.slice(0, 5).map(toClubMatch)
  const recentTournamentMatches = wcRaw.map(toClubMatch)

  const lastFive = recentClubMatches.map((m) => m.result.split(' ').pop() ?? 'D')

  const clubForm = {
    lastFive: lastFive.length ? lastFive : ['D', 'D', 'D', 'D', 'D'],
    seasonGoals: Number(stat('goals')) || 0,
    seasonAssists: Number(stat('assists')) || 0,
    avgRating: Number(stat('rating')) || 0,
  }

  let wcGoals = 0
  let wcAssists = 0
  let wcMinutes = 0
  let wcRatingSum = 0
  let wcRatingCount = 0

  for (const m of wcRaw) {
    wcGoals += m.goals ?? 0
    wcAssists += m.assists ?? 0
    wcMinutes += m.minutesPlayed ?? 0
    if (m.ratingProps?.rating) {
      wcRatingSum += Number(m.ratingProps.rating)
      wcRatingCount++
    }
  }

  return {
    clubForm,
    clubFormSource: 'fotmob',
    recentClubMatches,
    recentTournamentMatches,
    tournament: {
      goals: wcGoals,
      assists: wcAssists,
      minutes: wcMinutes,
      rating: wcRatingCount ? Math.round((wcRatingSum / wcRatingCount) * 100) / 100 : null,
    },
  }
}