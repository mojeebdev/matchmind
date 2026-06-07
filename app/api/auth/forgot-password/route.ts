import { NextResponse } from 'next/server'
import { sendResetPasswordEmail } from '@/lib/emails'
import { absoluteAuthUrl } from '@/lib/site'
import { isEmailConfigured } from '@/lib/email'
import { createPasswordResetToken } from '@/lib/users'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const reset = await createPasswordResetToken(email)

    if (reset) {
      const resetUrl = `${absoluteAuthUrl('/reset-password')}?token=${reset.token}`

      if (isEmailConfigured() || process.env.NODE_ENV === 'development') {
        await sendResetPasswordEmail(reset.email, resetUrl)
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'If that email exists, a reset link has been sent.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
  }
}