import { HTTP_ERRORS } from '@zentro/constants/errors'
import { AppError } from '@zentro/utils/errors'
import type { Context } from 'hono'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'
import { ERRORS } from '@/constants/errors'

interface CORSOptions {
  origin:
    | string
    | string[]
    | ((
        origin: string,
        c: Context
      ) => Promise<string | undefined | null> | string | undefined | null)
  allowMethods?: string[] | ((origin: string, c: Context) => Promise<string[]> | string[])
  allowHeaders?: string[]
  maxAge?: number
  credentials?: boolean
  exposeHeaders?: string[]
}

export const customCors = (options: CORSOptions) => {
  const corsMiddleware = cors(options)

  return createMiddleware(async (c, next) => {
    try {
      return await corsMiddleware(c, next)
    } catch (e) {
      if (e instanceof AppError) {
        throw new AppError(ERRORS.api.cors.statusCode, {
          message: ERRORS.api.cors.message,
          type: ERRORS.api.cors.type,
          cause: e,
        })
      }

      throw AppError.from(e, {
        statusCode: HTTP_ERRORS.internalError.statusCode,
        type: HTTP_ERRORS.internalError.type,
        message: HTTP_ERRORS.internalError.message,
        critical: true,
        cause: e,
      })
    }
  })
}
