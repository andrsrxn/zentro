import { HTTP_ERRORS, type ResponseError } from '@zentro/constants/errors'
import { AppError } from '@zentro/utils/errors'
import { hc } from 'hono/client'
import { envClient } from '@/lib/config/env-client'
import type { AppWithErrors } from '../../../api/src/index'

export const apiClient = hc<AppWithErrors>(envClient.NEXT_PUBLIC_API_URL, {
  init: {
    credentials: 'include',
    referrerPolicy: 'strict-origin-when-cross-origin',
  },
}).v1

type ExtractApiData<T> = T extends {
  data: infer Data
}
  ? Data
  : never

type InferJson<T> = T extends Promise<Response> ? Awaited<ReturnType<Awaited<T>['json']>> : never

type InferRpcData<T> = ExtractApiData<Awaited<InferJson<T>>>

/**
 * Infers the return type of the RPC request.
 * Throws AppError with the provided error if the request fails or doesn't return data.
 */
export async function rpc<T extends Promise<Response>>({
  request,
  error,
}: {
  request: T
  error: ResponseError
}): Promise<InferRpcData<T>> {
  try {
    // biome-ignore lint/nursery/useAwaitThenable: request is a Promise
    const response = await request
    const parsed = await response.json()

    if (parsed.error) {
      throw new AppError(parsed.error.statusCode, {
        message: parsed.error.message,

        type: parsed.error.type,
      })
    }

    if (!parsed.data) {
      throw new AppError(error.statusCode, {
        message: error.message,
        type: error.type,
      })
    }

    return parsed.data
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    const wrapped = AppError.from(error, {
      statusCode: HTTP_ERRORS.internalError.statusCode,
      type: HTTP_ERRORS.internalError.type,
      message: HTTP_ERRORS.internalError.message,
      critical: true,
      cause: error,
    })

    throw wrapped
  }
}
