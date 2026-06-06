export function isAdminConfigured(): boolean {
  const secret = process.env.ADMIN_SECRET
  return Boolean(secret && secret.length >= 8 && secret !== 'change_me')
}

export function verifyAdminKey(provided: string | null | undefined): boolean {
  if (!isAdminConfigured()) return false
  const secret = process.env.ADMIN_SECRET!
  return typeof provided === 'string' && provided.length > 0 && provided === secret
}