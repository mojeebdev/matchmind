import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { agentPath, appPath } from '@/lib/urls'
import SignUpPageClient from './SignUpPageClient'

export default async function SignUpPage() {
  const session = await auth()

  if (session?.user) {
    const destination = session.user.profile?.onboardingComplete ? agentPath('/') : appPath('/onboarding')
    redirect(destination)
  }

  return <SignUpPageClient />
}