import { siteFaqs } from '@/lib/aeo'
import { absoluteUrl, siteConfig } from '@/lib/site'

export function homePageJsonLd() {
  const websiteId = `${absoluteUrl('/')}#website`
  const organizationId = `${absoluteUrl('/')}#organization`
  const appId = `${absoluteUrl('/')}#application`
  const faqId = `${absoluteUrl('/')}#faq`
  const webpageId = `${absoluteUrl('/')}#webpage`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: absoluteUrl('/'),
        name: siteConfig.name,
        description: siteConfig.shortDescription,
        inLanguage: 'en-US',
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: absoluteUrl('/'),
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: { '@id': websiteId },
        inLanguage: 'en-US',
        about: { '@id': appId },
        mainEntity: { '@id': faqId },
      },
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: siteConfig.organization.name,
        url: siteConfig.organization.url,
        founder: {
          '@type': 'Person',
          name: siteConfig.creator.name,
          url: siteConfig.creator.url,
          sameAs: [siteConfig.creator.url, siteConfig.github],
        },
        sameAs: [siteConfig.github, siteConfig.creator.url, siteConfig.organization.url],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': appId,
        name: siteConfig.name,
        url: absoluteUrl('/'),
        applicationCategory: 'SportsApplication',
        operatingSystem: 'Web',
        description: siteConfig.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'World Cup 2026 football stats and standings',
          'AI match predictions and tactical analysis',
          'Fantasy lineup suggestions',
          'Head-to-head history queries',
          'Optional user accounts with saved agent history',
        ],
        author: {
          '@type': 'Person',
          name: siteConfig.creator.name,
          url: siteConfig.creator.url,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': faqId,
        url: absoluteUrl('/#faq'),
        inLanguage: 'en-US',
        mainEntity: siteFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  }
}