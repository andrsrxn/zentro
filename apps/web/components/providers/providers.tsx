'use client'

import { type ReactNode, useEffect, useRef } from 'react'
import { QueryClientProvider } from '@/components/providers/query-client'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ensureCsrfToken } from '@/lib/utils/csrf'

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) {
      return
    }
    initialized.current = true
    // biome-ignore lint/nursery/noFloatingPromises: on use effect
    ensureCsrfToken()
  }, [])

  return (
    <QueryClientProvider>
      <ThemeProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
