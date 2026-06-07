import type { Metadata } from 'next'
import { HeroSection } from '@/components/hero/HeroSection'
import { FeaturesSection } from '@/components/features/FeaturesSection'
import { CtaSection } from '@/components/home/CtaSection'
import { FaqSection } from '@/components/home/FaqSection'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { absoluteUrl, siteConfig } from '@/lib/site'
import { homePageJsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl('/'),
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={homePageJsonLd()} />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}