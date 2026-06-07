import { absoluteAgentUrl, absoluteUrl, siteConfig } from '@/lib/site'

const brand = {
  void: '#08090A',
  emerald: '#0D3B2E',
  gold: '#C9A84C',
  ink: '#F0EDE6',
  muted: '#9A9585',
}

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:${brand.void};font-family:Arial,sans-serif;color:${brand.ink};">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.void};padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:560px;background:#0F1012;border:1px solid #1E2022;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 8px;background:linear-gradient(135deg,${brand.void},${brand.emerald});">
                <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${brand.gold};">MatchMind</div>
                <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;color:${brand.ink};">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 32px;color:${brand.muted};font-size:15px;line-height:1.7;">
                ${body}
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:12px;color:#4A4740;">${siteConfig.tagline}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 20px;background:${brand.gold};color:${brand.void};text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;">${label}</a>`
}

export function welcomeEmail(name: string) {
  const agentUrl = absoluteAgentUrl('/')
  const title = 'Welcome to MatchMind'
  const html = layout(
    title,
    `<p>Hi ${name},</p>
     <p>Your account is live. MatchMind is your AI football analyst for World Cup 2026 — stats, predictions, fantasy, tactics, and history grounded in MongoDB intelligence.</p>
     <p>Next step: complete your fan profile so answers feel personal to the country and player you support.</p>
     ${button('Complete your profile', absoluteUrl('/onboarding'))}
     <p style="margin-top:24px;">Or jump straight in:</p>
     ${button('Ask the agent', agentUrl)}`
  )

  return {
    subject: 'Welcome to MatchMind',
    text: `Hi ${name},\n\nWelcome to MatchMind. Complete your profile: ${absoluteUrl('/onboarding')}\nAsk the agent: ${agentUrl}`,
    html,
  }
}

export function resetPasswordEmail(resetUrl: string) {
  const title = 'Reset your password'
  const html = layout(
    title,
    `<p>We received a request to reset your MatchMind password.</p>
     <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
     ${button('Reset password', resetUrl)}
     <p style="margin-top:24px;word-break:break-all;">${resetUrl}</p>`
  )

  return {
    subject: 'Reset your MatchMind password',
    text: `Reset your MatchMind password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    html,
  }
}

export function founderWelcomeEmail(input: {
  username: string
  supportedCountry: string
  favoritePlayer: string
}) {
  const title = `Welcome, ${input.username}`
  const html = layout(
    title,
    `<p>Hey ${input.username},</p>
     <p>I'm Mojeeb — I built MatchMind because football intelligence should feel like talking to a sharp analyst, not searching a spreadsheet.</p>
     <p>You're set up for <strong style="color:${brand.ink};">${input.supportedCountry}</strong>${input.favoritePlayer ? ` with <strong style="color:${brand.gold};">${input.favoritePlayer}</strong> as your player` : ''}. MatchMind will use that context when you ask questions.</p>
     <p>Know your game. Own every moment.</p>
     ${button('Ask your first question', absoluteAgentUrl('/'))}
     <p style="margin-top:28px;">— Mojeeb<br/>Founder, MatchMind</p>`
  )

  return {
    subject: `Welcome to the squad, ${input.username}`,
    text: `Hey ${input.username},\n\nI'm Mojeeb — founder of MatchMind. You're set up for ${input.supportedCountry}${input.favoritePlayer ? ` with ${input.favoritePlayer} as your player` : ''}.\n\nAsk your first question: ${absoluteAgentUrl('/')}\n\n— Mojeeb`,
    html,
  }
}

export function countryMatchResultEmail(input: {
  username: string
  team: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
}) {
  const title = `${input.team} result update`
  const html = layout(
    title,
    `<p>Hi ${input.username},</p>
     <p>Your supported team <strong style="color:${brand.gold};">${input.team}</strong> just finished a match:</p>
     <p style="font-size:20px;color:${brand.ink};"><strong>${input.homeTeam} ${input.homeScore} – ${input.awayScore} ${input.awayTeam}</strong></p>
     <p>Want analysis on what this means for the group or knockout path?</p>
     ${button('Ask MatchMind', absoluteAgentUrl('/'))}`
  )

  return {
    subject: `${input.team}: ${input.homeScore}-${input.awayScore} vs ${input.homeTeam === input.team ? input.awayTeam : input.homeTeam}`,
    text: `${input.team} result: ${input.homeTeam} ${input.homeScore}-${input.awayScore} ${input.awayTeam}. Ask MatchMind: ${absoluteAgentUrl('/')}`,
    html,
  }
}

export function favoritePlayerScoredEmail(input: {
  username: string
  playerName: string
  team: string
  goals: number
  goalsAdded: number
}) {
  const title = `${input.playerName} scored`
  const html = layout(
    title,
    `<p>Hi ${input.username},</p>
     <p>Your player <strong style="color:${brand.gold};">${input.playerName}</strong> (${input.team}) was updated in MatchMind intelligence.</p>
     <p style="font-size:20px;color:${brand.ink};"><strong>${input.goalsAdded > 0 ? `+${input.goalsAdded} goal${input.goalsAdded === 1 ? '' : 's'}` : 'Stats updated'} · ${input.goals} tournament goals</strong></p>
     <p>Ask the agent for form, matchup impact, or fantasy value.</p>
     ${button('Analyze now', absoluteAgentUrl('/'))}`
  )

  return {
    subject: `${input.playerName} update — ${input.goals} goals`,
    text: `${input.playerName} (${input.team}) now on ${input.goals} goals. Ask MatchMind: ${absoluteAgentUrl('/')}`,
    html,
  }
}