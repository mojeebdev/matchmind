import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/mongodb-client'
import { normalizeUsername, validateUsername } from '@/lib/username'

export type UserProfile = {
  username: string
  displayName: string
  supportedCountry: string
  favoritePlayer: string
  onboardingComplete: boolean
  founderWelcomeSent: boolean
  emailAlerts: boolean
  alertFavoritePlayer: boolean
  alertSupportedCountry: boolean
}

export type AppUser = {
  _id: ObjectId
  email: string
  name?: string | null
  image?: string | null
  passwordHash?: string | null
  profile: UserProfile
  createdAt: Date
  updatedAt: Date
}

const defaultProfile = (): UserProfile => ({
  username: '',
  displayName: '',
  supportedCountry: '',
  favoritePlayer: '',
  onboardingComplete: false,
  founderWelcomeSent: false,
  emailAlerts: true,
  alertFavoritePlayer: true,
  alertSupportedCountry: true,
})

let usernameIndexEnsured = false

export async function ensureUsernameIndex() {
  if (usernameIndexEnsured) return
  const db = await getDb()
  await db.collection('users').createIndex(
    { 'profile.username': 1 },
    {
      unique: true,
      sparse: true,
      name: 'profile_username_unique',
    }
  )
  usernameIndexEnsured = true
}

export async function findUserByEmail(email: string) {
  const db = await getDb()
  return db.collection<AppUser>('users').findOne({ email: email.toLowerCase() })
}

export async function findUserById(id: string) {
  const db = await getDb()
  if (!ObjectId.isValid(id)) return null
  return db.collection<AppUser>('users').findOne({ _id: new ObjectId(id) })
}

export async function isUsernameAvailable(username: string, excludeUserId?: string) {
  await ensureUsernameIndex()
  const normalized = normalizeUsername(username)
  const validationError = validateUsername(normalized)
  if (validationError) return { available: false, error: validationError }

  const db = await getDb()
  const existing = await db.collection<AppUser>('users').findOne({
    'profile.username': normalized,
    ...(excludeUserId && ObjectId.isValid(excludeUserId)
      ? { _id: { $ne: new ObjectId(excludeUserId) } }
      : {}),
  })

  if (existing) {
    return { available: false, error: 'Username is already taken' }
  }

  return { available: true, username: normalized }
}

export async function createCredentialsUser(input: {
  email: string
  password: string
  name?: string
}) {
  await ensureUsernameIndex()
  const db = await getDb()
  const email = input.email.toLowerCase().trim()
  const existing = await findUserByEmail(email)
  if (existing) {
    throw new Error('An account with this email already exists')
  }

  const now = new Date()
  const passwordHash = await bcrypt.hash(input.password, 12)
  const result = await db.collection('users').insertOne({
    email,
    name: input.name?.trim() || email.split('@')[0],
    emailVerified: null,
    image: null,
    passwordHash,
    profile: defaultProfile(),
    createdAt: now,
    updatedAt: now,
  })

  return { userId: String(result.insertedId), email, name: input.name?.trim() || email.split('@')[0] }
}

export async function verifyCredentials(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user?.passwordHash) return null
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null
  return user
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  if (profile.username !== undefined) {
    const availability = await isUsernameAvailable(profile.username, userId)
    if (!availability.available) {
      throw new Error(availability.error ?? 'Username is not available')
    }
    profile.username = availability.username
  }

  const db = await getDb()
  const now = new Date()
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        ...Object.fromEntries(
          Object.entries(profile).map(([key, value]) => [`profile.${key}`, value])
        ),
        updatedAt: now,
      },
    }
  )
}

export async function updateUserPassword(userId: string, password: string) {
  const db = await getDb()
  const passwordHash = await bcrypt.hash(password, 12)
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { passwordHash, updatedAt: new Date() } }
  )
}

export async function createPasswordResetToken(email: string) {
  const db = await getDb()
  const user = await findUserByEmail(email)
  if (!user?.passwordHash) return null

  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 60 * 60 * 1000)

  await db.collection('passwordResetTokens').deleteMany({ email: user.email })
  await db.collection('passwordResetTokens').insertOne({
    email: user.email,
    token,
    expires,
    createdAt: new Date(),
  })

  return { token, email: user.email }
}

export async function consumePasswordResetToken(token: string) {
  const db = await getDb()
  const record = await db.collection('passwordResetTokens').findOne({ token })
  if (!record || new Date(record.expires) < new Date()) return null

  const user = await findUserByEmail(record.email)
  if (!user) return null

  await db.collection('passwordResetTokens').deleteMany({ email: record.email })
  return user
}

export function serializeProfile(user: AppUser | null): UserProfile {
  return {
    ...defaultProfile(),
    ...(user?.profile ?? {}),
  }
}