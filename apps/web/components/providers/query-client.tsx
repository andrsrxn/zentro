'use client'

import {
  environmentManager,
  QueryClient,
  QueryClientProvider as QueryClientProviderRQ,
} from '@tanstack/react-query'
import type { AppError } from '@zentro/utils/errors'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AppError
  }
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // biome-ignore lint/style/noMagicNumbers: default time
        staleTime: 5 * 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProviderRQ client={queryClient}>
      {children}
      {/* <ReactQueryDevtools /> */}
    </QueryClientProviderRQ>
  )
}
