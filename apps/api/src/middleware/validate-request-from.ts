import { AppError } from '@zentro/utils/errors'
import { createMiddleware } from 'hono/factory'
import { ERRORS } from '@/constants/errors'

// Browser-initiated navigations, not API calls
const DISALLOWED_DEST = new Set(['embed', 'object', 'iframe'])

/**
 * Validates that the request is not from a disallowed destination
 */
export const validateRequestFrom = createMiddleware(async (c, next) => {
  const dest = c.req.header('Sec-Fetch-Dest')

  // absence of the header is fine, non-browser clients don't send it
  if (dest && DISALLOWED_DEST.has(dest)) {
    throw new AppError(ERRORS.api.dest.statusCode, {
      message: ERRORS.api.dest.message,
      type: ERRORS.api.dest.type,
    })
  }

  await next()
})
