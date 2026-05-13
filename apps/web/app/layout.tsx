import { Figtree, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { baseMetadata, baseViewport } from '@/lib/constants/metadata'
import { cn } from '@/lib/utils/theme'
import './globals.css'
import { AppProviders } from '@/components/providers/providers'
import { HotKeys } from '@/components/shared/hot-keys'
import { Toaster } from '@/components/ui/sonner'

const fontSans = Figtree({
  subsets: ['latin'],
  display: 'swap',
  style: 'normal',
  weight: 'variable',
  variable: '--font-sans',
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
  return (
    <html lang='en' suppressHydrationWarning className={cn(fontMono.variable, fontSans.variable)}>
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
