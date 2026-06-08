import type { MetadataRoute } from 'next'
import { absoluteAboutUrl, absoluteAgentUrl, absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteAgentUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteAboutUrl('/'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/docs'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: absoluteUrl('/docs/architecture'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/privacy'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/terms'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}