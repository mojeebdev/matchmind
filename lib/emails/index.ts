import {
  countryMatchResultEmail,
  favoritePlayerScoredEmail,
  founderWelcomeEmail,
  resetPasswordEmail,
  welcomeEmail,
} from '@/lib/emails/templates'
import { getFounderFromAddress, getSystemFromAddress, isEmailConfigured, sendEmail } from '@/lib/email'

export async function sendWelcomeEmail(to: string, name: string) {
  if (!isEmailConfigured() && process.env.NODE_ENV !== 'development') return
  const content = welcomeEmail(name)
  await sendEmail({
    to,
    from: getSystemFromAddress(),
    ...content,
  })
}

export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  if (!isEmailConfigured() && process.env.NODE_ENV !== 'development') return
  const content = resetPasswordEmail(resetUrl)
  await sendEmail({
    to,
    from: getSystemFromAddress(),
    ...content,
  })
}

export async function sendFounderWelcomeEmail(input: {
  to: string
  username: string
  supportedCountry: string
  favoritePlayer: string
}) {
  if (!isEmailConfigured() && process.env.NODE_ENV !== 'development') return
  const content = founderWelcomeEmail(input)
  await sendEmail({
    to: input.to,
    from: getFounderFromAddress(),
    replyTo: process.env.EMAIL_FOUNDER_REPLY_TO ?? 'mojeebeth@gmail.com',
    ...content,
  })
}

export async function sendCountryMatchAlert(input: {
  to: string
  username: string
  team: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
}) {
  if (!isEmailConfigured() && process.env.NODE_ENV !== 'development') return
  const content = countryMatchResultEmail(input)
  await sendEmail({
    to: input.to,
    from: getSystemFromAddress(),
    ...content,
  })
}

export async function sendFavoritePlayerAlert(input: {
  to: string
  username: string
  playerName: string
  team: string
  goals: number
  goalsAdded: number
}) {
  if (!isEmailConfigured() && process.env.NODE_ENV !== 'development') return
  const content = favoritePlayerScoredEmail(input)
  await sendEmail({
    to: input.to,
    from: getSystemFromAddress(),
    ...content,
  })
}