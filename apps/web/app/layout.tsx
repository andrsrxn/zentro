import { Figtree, Geist_Mono, Shadows_Into_Light_Two } from 'next/font/google'
import type { ReactNode } from 'react'
import { baseMetadata, baseViewport } from '@/lib/constants/metadata'
import { cn } from '@/lib/utils/theme'
import './globals.css'
import { preconnect } from 'react-dom'
import { AppProviders } from '@/components/providers/providers'
import { HotKeys } from '@/components/shared/hot-keys'
import { Toaster } from '@/components/ui/sonner'
import { envClient } from '@/lib/config/env-client'

const fontSans = Figtree({
  subsets: ['latin'],
  display: 'swap',
  style: 'normal',
  weight: 'variable',
  variable: '--font-sans',
})

const fontHandwritten = Shadows_Into_Light_Two({
  subsets: ['latin'],
  display: 'swap',
  style: 'normal',
  weight: '400',
  variable: '--font-handwritten',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  style: 'normal',
  variable: '--font-mono',
})

export const metadata = baseMetadata
export const viewport = baseViewport

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  preconnect(envClient.NEXT_PUBLIC_API_URL, {
    crossOrigin: 'use-credentials',
  })

  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(fontMono.variable, fontHandwritten.variable, fontSans.variable)}>
      <body>
        <AppProviders>
          <main className='flex w-full'>{children}</main>
          <HotKeys />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  )
}
