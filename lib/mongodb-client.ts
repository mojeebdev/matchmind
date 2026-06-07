import { MongoClient } from 'mongodb'
import { applyDnsFix } from './dns-fix'

applyDnsFix()

function getMongoUri(): string | undefined {
  return process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI
}

declare global {
  // eslint-disable-next-line no-var
  var _authMongoClientPromise: Promise<MongoClient> | undefined
}

function createClientPromise(): Promise<MongoClient> {
  const uri = getMongoUri()
  if (!uri || uri.includes('username:password')) {
    return Promise.reject(new Error('MongoDB is not configured'))
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 })
  return client.connect()
}

export const clientPromise: Promise<MongoClient> =
  global._authMongoClientPromise ?? createClientPromise()

if (process.env.NODE_ENV !== 'production') {
  global._authMongoClientPromise = clientPromise
}

export async function getDb() {
  const client = await clientPromise
  return client.db('matchmind')
}