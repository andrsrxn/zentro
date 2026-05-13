import type { ApiResponseError } from '@zentro/constants/api'
import { HTTP_ERRORS } from '@zentro/constants/errors'
import { isProductionEnv } from '@zentro/utils/env'
import { AppError, type AppErrorJSON } from '@zentro/utils/errors'
import type { Context } from 'hono'
import { env } from '@/config/env'
import { logger } from '@/utils/logger'

const logError = (err: AppErrorJSON) => {
  if (isProductionEnv(env.NODE_ENV)) {
    logger.error(err)
    return
  }

  console.log(err)
}

export const errorHandler = (err: Error | AppError, c: Context) => {
  if (AppError.is(err)) {
    if (err.critical || err.statusCode >= HTTP_ERRORS.internalError.statusCode) {
      logError(err.toJSON())
      // Sentry.captureException(err, { level: 'fatal' })
    }

    return c.json<ApiResponseError>(
      {
        data: null,
        error: {
          type: err.type,
          statusCode: err.statusCode,
          message: err.message,
          details: err.details,
          errors: err.errors,
        },
      },
      err.statusCode
    )
  }

  // Handle any other errors
  const wrapped = AppError.from(err, {
    statusCode: HTTP_ERRORS.internalError.statusCode,
    type: HTTP_ERRORS.internalError.type,
    message: HTTP_ERRORS.internalError.message,
    critical: true,
    cause: err,
  })

  logError(wrapped.toJSON())
  // Sentry.captureException(wrapped, { level: 'fatal' })

  return c.json<ApiResponseError>(
    {
      data: null,
      error: {
        type: wrapped.type,
        statusCode: wrapped.statusCode,
        message: wrapped.message,
        details: wrapped.details,
        errors: wrapped.errors,
      },
    },
    HTTP_ERRORS.internalError.statusCode
  )
}
