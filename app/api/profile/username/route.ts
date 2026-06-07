import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isUsernameAvailable } from '@/lib/users'

export async function GET(request: Request) {
  const session = await auth()
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username') ?? ''

  if (!username.trim()) {
    return NextResponse.json({ available: false, error: 'Username is required' }, { status: 400 })
  }

  const result = await isUsernameAvailable(username, session?.user?.id)
  return NextResponse.json(result, { status: result.available ? 200 : 409 })
}