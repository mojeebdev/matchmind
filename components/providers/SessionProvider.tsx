'use client'

import type { Session } from 'next-auth'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { SessionSync } from '@/components/providers/SessionSync'

type SessionProviderProps = {
  children: React.ReactNode
  session: Session | null
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session} refetchOnWindowFocus>
      <SessionSync />
      {children}
    </NextAuthSessionProvider>
  )
}