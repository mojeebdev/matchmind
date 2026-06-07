'use client'

import { getSession } from 'next-auth/react'
import { useEffect } from 'react'

/** Re-fetch session after OAuth redirects and when the tab regains focus. */
export function SessionSync() {
  useEffect(() => {
    void getSession()
  }, [])

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