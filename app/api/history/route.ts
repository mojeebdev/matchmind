import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getInteractionHistory } from '@/lib/interactions'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const history = await getInteractionHistory(session.user.id)
  return NextResponse.json({
    items: history.map((item) => ({
      id: String(item._id),
      question: item.question,
      response: item.response,
      createdAt: item.createdAt.toISOString(),
    })),
  })
}