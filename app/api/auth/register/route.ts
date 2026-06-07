import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/emails'
import { createCredentialsUser } from '@/lib/users'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const created = await createCredentialsUser({ email, password, name })

    sendWelcomeEmail(created.email, created.name || 'there').catch((error) => {
      console.error('Welcome email failed:', error)
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}