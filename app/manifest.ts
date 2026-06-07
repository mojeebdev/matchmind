import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.shortDescription,
    start_url: '/',
    display: 'standalone',
    background_color: siteConfig.backgroundColor,
    theme_color: siteConfig.themeColor,
    lang: 'en',
    categories: ['sports', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}