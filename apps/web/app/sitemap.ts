import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.baseUrl,
      lastModified: new Date('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
