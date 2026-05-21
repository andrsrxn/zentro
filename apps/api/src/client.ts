import type { ApiResponseError, ContentfulStatusCode } from '@zentro/constants/api'
import type { ApplyGlobalResponse } from 'hono/client'
import type { routes } from './index'

export type AppType = typeof routes
export type AppWithErrors = ApplyGlobalResponse<
  typeof routes,
  {
    [Key in ContentfulStatusCode]: { json: ApiResponseError }
  }
>
