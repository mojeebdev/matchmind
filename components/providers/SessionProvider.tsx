'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { urls } from '@/lib/urls'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider baseUrl={urls.auth}>{children}</NextAuthSessionProvider>
}