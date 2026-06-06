import { HeroSection } from '@/components/hero/HeroSection'
import { FeaturesSection } from '@/components/features/FeaturesSection'
import { CtaSection } from '@/components/home/CtaSection'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />

        <CtaSection />
      </main>
      <Footer />
    </>
  )
}