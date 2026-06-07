import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sendFounderWelcomeEmail } from '@/lib/emails'
import { findUserById, updateUserProfile } from '@/lib/users'
import { validateUsername } from '@/lib/username'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await findUserById(session.user.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    email: user.email,
    name: user.name,
    profile: user.profile,
  })
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const username = typeof body.username === 'string' ? body.username.trim() : undefined
  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : undefined
  const supportedCountry =
    typeof body.supportedCountry === 'string' ? body.supportedCountry.trim() : undefined
  const favoritePlayer =
    typeof body.favoritePlayer === 'string' ? body.favoritePlayer.trim() : undefined
  const onboardingComplete =
    typeof body.onboardingComplete === 'boolean' ? body.onboardingComplete : undefined
  const emailAlerts = typeof body.emailAlerts === 'boolean' ? body.emailAlerts : undefined
  const alertFavoritePlayer =
    typeof body.alertFavoritePlayer === 'boolean' ? body.alertFavoritePlayer : undefined
  const alertSupportedCountry =
    typeof body.alertSupportedCountry === 'boolean' ? body.alertSupportedCountry : undefined

  if (username !== undefined) {
    const usernameError = validateUsername(username)
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 })
    }
  }

  const existingUser = await findUserById(session.user.id)
  const wasOnboardingComplete = existingUser?.profile?.onboardingComplete ?? false

  try {
    await updateUserProfile(session.user.id, {
      ...(username !== undefined ? { username } : {}),
      ...(displayName !== undefined ? { displayName } : {}),
      ...(supportedCountry !== undefined ? { supportedCountry } : {}),
      ...(favoritePlayer !== undefined ? { favoritePlayer } : {}),
      ...(onboardingComplete !== undefined ? { onboardingComplete } : {}),
      ...(emailAlerts !== undefined ? { emailAlerts } : {}),
      ...(alertFavoritePlayer !== undefined ? { alertFavoritePlayer } : {}),
      ...(alertSupportedCountry !== undefined ? { alertSupportedCountry } : {}),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save profile'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const user = await findUserById(session.user.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const justCompletedOnboarding = onboardingComplete === true && !wasOnboardingComplete

  if (
    justCompletedOnboarding &&
    user.profile.username &&
    user.profile.supportedCountry &&
    !user.profile.founderWelcomeSent
  ) {
    try {
      await sendFounderWelcomeEmail({
        to: user.email,
        username: user.profile.username,
        supportedCountry: user.profile.supportedCountry,
        favoritePlayer: user.profile.favoritePlayer,
      })
      await updateUserProfile(session.user.id, { founderWelcomeSent: true })
      user.profile.founderWelcomeSent = true
    } catch (error) {
      console.error('Founder welcome email failed:', error)
    }
  }

  return NextResponse.json({ profile: user.profile })
}