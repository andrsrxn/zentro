'use client'

import {
  environmentManager,
  QueryClient,
  QueryClientProvider as QueryClientProviderRQ,
} from '@tanstack/react-query'
import { HTTP_ERRORS } from '@zentro/constants/errors'
import type { AppError } from '@zentro/utils/errors'
import { QUERIES } from '@/lib/constants/queries'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AppError
  }
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERIES.staleTime,
        retry: (failureCount, error) => {
          if (error.statusCode === HTTP_ERRORS.notFound.statusCode) {
            return false
          }
          return failureCount < QUERIES.maxRetries
        },
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
