/** biome-ignore-all lint/correctness/noProcessGlobal: to shut down */

import type { ServerType } from '@hono/node-server'
import { HTTP_ERRORS } from '@zentro/constants/errors'
import { AppError } from '@zentro/utils/errors'
import type { $ZodError } from 'zod/v4/core'
import { db } from '@/db/drizzle'
import { logger } from '@/utils/logger'

export const gracefulShutdown = async (server: ServerType, err: Error | string) => {
  logger.error(`Server Error: ${err.toString()}`)
  try {
    await db.$client.end()
  } catch (closeErr) {
    logger.error(`Error closing DB pool: ${closeErr}`)
  } finally {
    server.close(e => process.exit(e ? 1 : 0))
  }
}

export function sendFieldValidationErrors({ errors }: { errors: $ZodError }) {
  const filteredErrors = errors.issues.map(issue => ({
    field: issue.path[0]?.toString() ?? '',
    message: issue.message,
  }))

  throw new AppError(HTTP_ERRORS.badRequest.statusCode, {
    message: HTTP_ERRORS.badRequest.message,
    type: HTTP_ERRORS.badRequest.type,
    errors: filteredErrors,
  })
}
