import { MongoClient } from 'mongodb'
import { applyDnsFix } from './dns-fix'

applyDnsFix()

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoUri(): string | undefined {
  // Prefer standard mongodb:// URI if set (bypasses SRV DNS issues on Windows)
  return process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI
}

export function isMongoConfigured(): boolean {
  const uri = getMongoUri()
  return Boolean(uri && !uri.includes('username:password'))
}

async function connectMongo(): Promise<MongoClient> {
  const uri = getMongoUri()
  if (!uri || uri.includes('username:password')) {
    throw new Error('MongoDB is not configured')
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 })
  await client.connect()
  return client
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectMongo().catch((err) => {
      global._mongoClientPromise = undefined
      throw err
    })
  }
  return global._mongoClientPromise
}

export default getMongoClient

export async function queryCollection(
  collection: string,
  pipeline: Record<string, unknown>[]
) {
  const client = await getMongoClient()
  const db = client.db('matchmind')
  return db.collection(collection).aggregate(pipeline).toArray()
}