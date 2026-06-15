import { MongoClient, type MongoClientOptions } from 'mongodb'
import { applyDnsFix } from './dns-fix'

applyDnsFix()

declare global {
  // eslint-disable-next-line no-var
  var _matchmindMongoClient: MongoClient | undefined
  // eslint-disable-next-line no-var
  var _matchmindMongoPromise: Promise<MongoClient> | undefined
}

/** Tuned for Vercel serverless — small pool, short idle TTL, retry on stale sockets. */
export const MONGO_CLIENT_OPTIONS: MongoClientOptions = {
  serverSelectionTimeoutMS: 10_000,
  connectTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 10_000,
  retryWrites: true,
  retryReads: true,
}

export function getMongoUri(): string | undefined {
  // SRV preferred on Vercel (Atlas rotates hosts); DIRECT kept for local Windows DNS issues.
  if (process.env.VERCEL) {
    return process.env.MONGODB_URI || process.env.MONGODB_URI_DIRECT
  }
  return process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI
}

export function isMongoUriConfigured(): boolean {
  const uri = getMongoUri()
  return Boolean(uri && !uri.includes('username:password'))
}

export function isMongoNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const err = error as {
    name?: string
    message?: string
    code?: string
    cause?: { code?: string; message?: string }
    errorLabels?: Set<string>
  }
  const name = err.name ?? ''
  const message = err.message ?? ''
  const code = err.code ?? err.cause?.code ?? ''
  return (
    name.includes('MongoNetwork') ||
    name.includes('MongoServerSelection') ||
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT' ||
    message.includes('ECONNRESET') ||
    message.includes('ETIMEDOUT') ||
    (message.includes('connection') && message.includes('closed')) ||
    err.errorLabels?.has('ResetPool') === true ||
    err.errorLabels?.has('HandshakeError') === true
  )
}

const RETRY_DELAY_MS = 750

function retryDelay(attempt: number) {
  return new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt))
}

/** Retry Atlas writes when Windows/long sync drops the socket (ECONNRESET). */
export async function withMongoRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (!isMongoNetworkError(error) || attempt === attempts) throw error
      console.warn(`[MatchMind] MongoDB retry ${attempt}/${attempts - 1} after network error`)
      resetMongoClient()
      await retryDelay(attempt)
    }
  }
  throw lastError
}

function attachPoolErrorHandler(client: MongoClient) {
  client.on('error', (error) => {
    console.error('[MatchMind] MongoDB pool error — resetting client:', error)
    resetMongoClient()
  })
}

function resetMongoClient() {
  const existing = global._matchmindMongoClient
  global._matchmindMongoClient = undefined
  global._matchmindMongoPromise = undefined
  if (existing) {
    void existing.close().catch(() => undefined)
  }
}

async function connectMongoClient(): Promise<MongoClient> {
  const uri = getMongoUri()
  if (!uri || uri.includes('username:password')) {
    throw new Error('MongoDB is not configured')
  }

  const client = new MongoClient(uri, MONGO_CLIENT_OPTIONS)
  attachPoolErrorHandler(client)
  await client.connect()
  await client.db('admin').command({ ping: 1 })
  global._matchmindMongoClient = client
  return client
}

function startMongoConnection(): Promise<MongoClient> {
  if (!global._matchmindMongoPromise) {
    global._matchmindMongoPromise = connectMongoClient().catch((error) => {
      resetMongoClient()
      throw error
    })
  }
  return global._matchmindMongoPromise
}

/**
 * Returns a live MongoClient, reconnecting if Atlas closed an idle serverless socket.
 */
export async function getSharedMongoClient(retry = true): Promise<MongoClient> {
  try {
    const client = await startMongoConnection()
    await client.db('admin').command({ ping: 1 })
    return client
  } catch (error) {
    if (retry && isMongoNetworkError(error)) {
      console.warn('[MatchMind] MongoDB ping failed — reconnecting once')
      resetMongoClient()
      return getSharedMongoClient(false)
    }
    throw error
  }
}

/** Used by Auth.js MongoDBAdapter — lazy promise that always resolves via getSharedMongoClient. */
export function createAuthClientPromise(): Promise<MongoClient> {
  return getSharedMongoClient()
}