import { HTTP_ERRORS } from '@zentro/constants/errors'
import { AppError } from '@zentro/utils/errors'
import type { Context } from 'hono'
import { csrf } from 'hono/csrf'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { ERRORS } from '@/constants/errors'
import { ensureCsrfCookie, validateCsrfToken } from '@/utils/csrf'

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

type IsAllowedOriginHandler = (origin: string, context: Context) => boolean | Promise<boolean>
declare const secFetchSiteValues: readonly ['same-origin', 'same-site', 'none', 'cross-site']
type SecFetchSite = (typeof secFetchSiteValues)[number]
type IsAllowedSecFetchSiteHandler = (
  secFetchSite: SecFetchSite,
  context: Context
) => boolean | Promise<boolean>

interface CSRFOptions {
  origin?: string | string[] | IsAllowedOriginHandler
  secFetchSite?: SecFetchSite | SecFetchSite[] | IsAllowedSecFetchSiteHandler
}

export const customCsrf = (options: CSRFOptions) => {
  const csrfMiddleware = csrf(options)
  return createMiddleware(async (c, next) => {
    try {
      return await csrfMiddleware(c, next)
    } catch (e) {
      if (e instanceof HTTPException) {
        throw new AppError(ERRORS.api.csrfOrigin.statusCode, {
          message: ERRORS.api.csrfOrigin.message,
          type: ERRORS.api.csrfOrigin.type,
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

export const csrfIssuer = createMiddleware(async (c, next) => {
  ensureCsrfCookie(c)
  await next()
})

/**
 * Validate the token on any mutating request based on double-submit-cookie pattern
 */
export const csrfValidator = createMiddleware(async (c, next) => {
  if (SAFE_METHODS.includes(c.req.method)) {
    await next()
    return
  }

  if (!validateCsrfToken(c)) {
    throw new AppError(ERRORS.api.csrfToken.statusCode, {
      message: ERRORS.api.csrfToken.message,
      type: ERRORS.api.csrfToken.type,
    })
  }

  await next()
})
