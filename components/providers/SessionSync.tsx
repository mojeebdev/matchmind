'use client'

import { getSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Re-fetch session after OAuth redirects, route changes, and tab focus. */
export function SessionSync() {
  const pathname = usePathname()

  useEffect(() => {
    void getSession()
  }, [pathname])

  useEffect(() => {
    const refresh = () => void getSession()

    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refresh()
    })

    return () => {
      window.removeEventListener('focus', refresh)
    }
  }, [])

  return null
}