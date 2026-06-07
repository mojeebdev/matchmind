import { createAuthClientPromise, getSharedMongoClient } from './mongo-connection'

export const clientPromise = createAuthClientPromise()

export async function getDb() {
  const client = await getSharedMongoClient()
  return client.db('matchmind')
}