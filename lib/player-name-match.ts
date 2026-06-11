/**
 * Normalized player-name matching for roster ↔ editorial ↔ historical datasets.
 */

/** Repair common UTF-8 mojibake in legacy editorial strings before matching. */
export function repairMojibake(name: string): string {
  return name
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã¤/g, 'ä')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã£/g, 'ã')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã´/g, 'ô')
    .replace(/Ä‡/g, 'ć')
    .replace(/ÄŸ/g, 'ğ')
    .replace(/Å‚/g, 'ł')
    .replace(/Å¡/g, 'š')
    .replace(/Å¾/g, 'ž')
    .replace(/Ä/i, 'i')
    .replace(/â€"/g, '—')
    .replace(/â€"/g, '–')
}

export function normalizePlayerName(name: string): string {
  return repairMojibake(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function playerNameTokens(name: string): string[] {
  return normalizePlayerName(name).split(' ').filter(Boolean)
}

export function playerLastName(name: string): string {
  const tokens = playerNameTokens(name)
  return tokens[tokens.length - 1] ?? ''
}

/** True when names refer to the same person (accent/punctuation tolerant). */
export function playerNamesMatch(a: string, b: string): boolean {
  const na = normalizePlayerName(a)
  const nb = normalizePlayerName(b)
  if (!na || !nb) return false
  if (na === nb) return true
  if (na.includes(nb) || nb.includes(na)) return true

  const ta = playerNameTokens(a)
  const tb = playerNameTokens(b)
  if (ta.length < 2 || tb.length < 2) return false

  const lastA = ta[ta.length - 1]
  const lastB = tb[tb.length - 1]
  if (lastA !== lastB) return false

  const firstA = ta[0]
  const firstB = tb[0]
  if (firstA === firstB) return true

  const prefixLen = Math.min(3, firstA.length, firstB.length)
  if (prefixLen >= 3 && firstA.slice(0, prefixLen) === firstB.slice(0, prefixLen)) return true

  return false
}

export function playerLookupKey(name: string, team?: string): string {
  const norm = normalizePlayerName(name)
  return team ? `${team}|${norm}` : norm
}