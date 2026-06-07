import { ObjectId } from 'mongodb'
import type { AgentResponse } from '@/lib/types'
import { getDb } from '@/lib/mongodb-client'

export type InteractionRecord = {
  _id: ObjectId
  userId: ObjectId
  question: string
  response: AgentResponse
  createdAt: Date
}

export async function saveInteraction(
  userId: string,
  question: string,
  response: AgentResponse
) {
  const db = await getDb()
  await db.collection('interactions').insertOne({
    userId: new ObjectId(userId),
    question,
    response,
    createdAt: new Date(),
  })
}

export async function getRecentInteractions(userId: string, limit = 8) {
  const db = await getDb()
  return db
    .collection<InteractionRecord>('interactions')
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
}

export async function getInteractionHistory(userId: string, limit = 50) {
  const db = await getDb()
  return db
    .collection<InteractionRecord>('interactions')
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
}