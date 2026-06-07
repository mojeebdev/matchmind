import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { clientPromise } from '@/lib/mongodb-client'
import { findUserById, serializeProfile, verifyCredentials } from '@/lib/users'

const defaultProfile = {
  username: '',
  displayName: '',
  supportedCountry: '',
  favoritePlayer: '',
  onboardingComplete: false,
  founderWelcomeSent: false,
  emailAlerts: true,
  alertFavoritePlayer: true,
  alertSupportedCountry: true,
}

const sharedCookieDomain = process.env.AUTH_COOKIE_DOMAIN

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
  },
  ...(sharedCookieDomain
    ? {
        cookies: {
          sessionToken: { options: { domain: sharedCookieDomain } },
          callbackUrl: { options: { domain: sharedCookieDomain } },
          csrfToken: { options: { domain: sharedCookieDomain } },
          pkceCodeVerifier: { options: { domain: sharedCookieDomain } },
          state: { options: { domain: sharedCookieDomain } },
        },
      }
    : {}),
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password
        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
          return null
        }

        const user = await verifyCredentials(email, password)
        if (!user) return null

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          image: user.image,
          profile: serializeProfile(user),
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.id = user.id
        token.profile = user.profile ?? defaultProfile
      }

      if (trigger === 'update' && session?.profile) {
        token.profile = session.profile
      }

      if (typeof token.id === 'string' && (trigger === 'update' || !token.profile)) {
        const dbUser = await findUserById(token.id)
        if (dbUser) {
          token.profile = serializeProfile(dbUser)
          token.name = dbUser.name ?? token.name
          token.email = dbUser.email ?? token.email
          token.picture = dbUser.image ?? token.picture
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === 'string') {
        session.user.id = token.id
        session.user.profile = token.profile ?? defaultProfile
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id || !user.email) return
      const { ObjectId } = await import('mongodb')
      const { getDb } = await import('@/lib/mongodb-client')
      const { sendWelcomeEmail } = await import('@/lib/emails')
      const db = await getDb()
      await db.collection('users').updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            profile: defaultProfile,
            updatedAt: new Date(),
          },
        }
      )

      sendWelcomeEmail(user.email, user.name || 'there').catch((error) => {
        console.error('OAuth welcome email failed:', error)
      })
    },
  },
})