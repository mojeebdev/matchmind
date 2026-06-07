import type { MetadataRoute } from 'next'
import { aiCrawlers } from '@/lib/aeo'
import { absoluteUrl, siteConfig } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const disallow = [...siteConfig.noIndexRoutes]
  const allowPublic = { allow: '/', disallow }

  return {
    rules: [
      { userAgent: '*', ...allowPublic },
      ...aiCrawlers.map((userAgent) => ({ userAgent, ...allowPublic })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: new URL(siteConfig.url).host,
  }
}