import { getMongoUri, getSharedMongoClient, isMongoUriConfigured } from './mongo-connection'

export function isMongoConfigured(): boolean {
  return isMongoUriConfigured()
}

export async function getMongoClient() {
  return getSharedMongoClient()
}

export default getMongoClient

export async function queryCollection(
  collection: string,
  pipeline: Record<string, unknown>[]
) {
  const client = await getSharedMongoClient()
  const db = client.db('matchmind')
  return db.collection(collection).aggregate(pipeline).toArray()
}

export { getMongoUri }