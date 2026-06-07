import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { agentPath, resolveCallbackUrl } from '@/lib/urls'
import SignInPageClient from './SignInPageClient'

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth()
  const params = await searchParams

  if (session?.user) {
    const destination = params.callbackUrl ? resolveCallbackUrl(params.callbackUrl) : agentPath('/')
    redirect(destination)
  }

  return <SignInPageClient />
}