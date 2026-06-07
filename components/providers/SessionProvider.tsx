'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { SessionSync } from '@/components/providers/SessionSync'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider refetchOnWindowFocus>
      <SessionSync />
      {children}
    </NextAuthSessionProvider>
  )
}