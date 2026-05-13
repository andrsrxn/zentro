'use client'

import { IconExclamationCircle } from '@tabler/icons-react'
import { Figtree, Geist_Mono } from 'next/font/google'
import { useEffect } from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { TooltipProvider } from '@/components/ui/tooltip'
import { baseMetadata, baseViewport } from '@/lib/constants/metadata'
import { cn } from '@/lib/utils/theme'
import './globals.css'

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

export default function ErrorPage({ error, retry }: { error: Error; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang='en' suppressHydrationWarning className={cn(fontMono.variable, fontSans.variable)}>
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <main className='size-full'>
              <div className='flex h-[calc(100dvh-2.75rem)] w-full items-center justify-center'>
                <Empty className='h-full'>
                  <EmptyHeader>
                    <EmptyMedia variant='icon'>
                      <IconExclamationCircle className='text-destructive' />
                    </EmptyMedia>
                    <EmptyTitle>Something went wrong</EmptyTitle>
                    <EmptyDescription className='max-w-xs text-pretty'>
                      We're sorry, but something went wrong. Please try again later.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button onClick={retry}>Try again</Button>
                  </EmptyContent>
                </Empty>
              </div>
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
