import { COMPANY } from '@zentro/constants/company'
import { IMAGES } from '@zentro/constants/media'
import type { Metadata, Viewport } from 'next'
import { SITE } from '@/lib/constants/site'

export const baseViewport: Viewport = {
  themeColor: COMPANY.brand.backgroundColor,
}

export const baseMetadata: Metadata = {
  metadataBase: SITE.baseUrl,
  title: {
    template: `%s | ${COMPANY.name}`,
    default: `${COMPANY.fullName}`,
  },
  alternates: {
    canonical: '/',
  },
  keywords: [
    'notes',
    'notes app',
    'notes manager',
    'notes organization',
    'notes taking',
    'productivity',
    'tasks',
    'saas',
  ],
  authors: [
    {
      name: COMPANY.author.name,
      url: COMPANY.author.url,
    },
  ],
  publisher: COMPANY.author.name,
  creator: COMPANY.author.name,
  applicationName: COMPANY.name,
  referrer: 'strict-origin-when-cross-origin',
  description: COMPANY.description,
  openGraph: {
    title: COMPANY.name,
    description: COMPANY.description,
    siteName: COMPANY.name,
    url: '/',
    images: [
      {
        url: IMAGES.brand.bannerOg.png,
        width: 1200,
        height: 630,
        alt: `Homepage of ${COMPANY.name} on laptop`,
      },
    ],
    locale: 'en',
    countryName: 'GT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: COMPANY.name,
    description: COMPANY.description,
    images: [IMAGES.brand.bannerOg.png],
  },
  category: 'productivity',
  classification: 'Business Application',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: COMPANY.name,
  },

  icons: {
    icon: [
      {
        url: IMAGES.brand.favicon.ico,
        type: 'image/x-icon',
        rel: 'icon',
      },
    ],
    apple: { url: IMAGES.brand.appleTouchIcon.png, sizes: '180x180', type: 'image/png' },
  },
}
