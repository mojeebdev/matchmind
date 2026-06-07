import { NextResponse } from 'next/server'
import { consumePasswordResetToken, updateUserPassword } from '@/lib/users'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const token = typeof body.token === 'string' ? body.token : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const user = await consumePasswordResetToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    await updateUserPassword(String(user._id), password)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Unable to reset password' }, { status: 500 })
  }
}