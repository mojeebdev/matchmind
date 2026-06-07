import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AuthShell } from '@/components/auth/AuthShell'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { Footer } from '@/components/ui/Footer'
import { Navbar } from '@/components/ui/Navbar'
import { agentPath, appPath, authPath } from '@/lib/urls'

export const metadata: Metadata = {
  title: 'Set up your fan profile',
  robots: { index: false, follow: false },
}

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user) {
    redirect(`${authPath('/signin')}?callbackUrl=${encodeURIComponent(appPath('/onboarding'))}`)
  }
  if (session.user.profile?.onboardingComplete) redirect(agentPath('/'))

  return (
    <>
      <Navbar />
      <AuthShell
        title="Build your fan profile"
        subtitle="Tell MatchMind who you support so answers feel personal — country, favorite player, and display name."
      >
        <ProfileForm onboarding />
      </AuthShell>
      <Footer />
    </>
  )
}