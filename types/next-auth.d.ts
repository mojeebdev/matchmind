import type { DefaultSession } from 'next-auth'

type UserProfileSession = {
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

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      profile: UserProfileSession
    } & DefaultSession['user']
  }

  interface User {
    profile?: UserProfileSession
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    profile?: UserProfileSession
  }
}