const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/^@+/, '')
}

export function validateUsername(value: string): string | null {
  const username = normalizeUsername(value)
  if (!username) return 'Username is required'
  if (!USERNAME_PATTERN.test(username)) {
    return 'Username must be 3–20 characters: lowercase letters, numbers, underscore only'
  }
  return null
}