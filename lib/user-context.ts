import { getRecentInteractions } from '@/lib/interactions'
import type { UserProfile } from '@/lib/users'

export type AgentUserContext = {
  username?: string
  displayName?: string
  supportedCountry?: string
  favoritePlayer?: string
  recentQuestions: string[]
}

export async function buildAgentUserContext(
  userId: string,
  profile: UserProfile
): Promise<AgentUserContext> {
  const recent = await getRecentInteractions(userId, 5)

  return {
    username: profile.username || undefined,
    displayName: profile.displayName || undefined,
    supportedCountry: profile.supportedCountry || undefined,
    favoritePlayer: profile.favoritePlayer || undefined,
    recentQuestions: recent.map((item) => item.question),
  }
}

export function formatUserContextBlock(context?: AgentUserContext): string {
  if (!context) return ''

  const lines: string[] = []

  if (context.username) lines.push(`Username: ${context.username}`)
  if (context.displayName) lines.push(`Fan name: ${context.displayName}`)
  if (context.supportedCountry) {
    lines.push(`Supported country/team: ${context.supportedCountry}`)
  }
  if (context.favoritePlayer) lines.push(`Favorite player: ${context.favoritePlayer}`)
  if (context.recentQuestions.length > 0) {
    lines.push(`Recent questions: ${context.recentQuestions.join(' | ')}`)
  }

  if (lines.length === 0) return ''

  return `Fan profile context (personalize tone and examples, do not invent unsupported preferences):\n${lines.map((line) => `- ${line}`).join('\n')}\n\n`
}