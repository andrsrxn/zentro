/** biome-ignore-all lint/correctness/noProcessGlobal: shutting down */
/** biome-ignore-all lint/style/noMagicNumbers: server port */

import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import {
  type ApiResponseError,
  type ContentfulStatusCode,
  TIMEOUT_REQUEST,
} from '@zentro/constants/api'
import { NODE_ENV } from '@zentro/constants/env'
import { HTTP_ERRORS } from '@zentro/constants/errors'
import { isDevelopmentEnv, isProductionEnv } from '@zentro/utils/env'
import { AppError } from '@zentro/utils/errors'
import { Hono } from 'hono'
import type { ApplyGlobalResponse } from 'hono/client'
import { hc } from 'hono/client'
import { compress } from 'hono/compress'
import { logger as requestLogger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { timeout } from 'hono/timeout'
import { env } from '@/config/env'
import { ERRORS } from '@/constants/errors'
import { ALLOWED_ORIGINS } from '@/constants/hosts'
import { customCors } from '@/middleware/cors'
import { customCsrf } from '@/middleware/csrf'
import { errorHandler } from '@/middleware/error-handler'
import { validateRequestFrom } from '@/middleware/validate-request-from'
import v1Routes from '@/routes/v1/index'
import { gracefulShutdown } from '@/utils/errors'
import { logger } from '@/utils/logger'

const app = new Hono({
  strict: false,
})
  .basePath('/')
  .use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }))
  .use(
    customCors({
      origin: ALLOWED_ORIGINS,
      allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization'],
      exposeHeaders: ['Content-Length', 'X-Request-Id'],
      credentials: true,
      maxAge: 600,
    })
  )
  .use(compress())
  .use(validateRequestFrom)
  .use(
    customCsrf({
      origin: (origin, c) => {
        if (origin === new URL(c.req.url).origin) {
          return true
        }
        return ALLOWED_ORIGINS.includes(origin)
      },
      secFetchSite: ['same-site', 'same-origin'],
    })
  )
  .use(
    secureHeaders({
      referrerPolicy: 'strict-origin-when-cross-origin',
      xDnsPrefetchControl: 'on',
      xPermittedCrossDomainPolicies: 'none',
      originAgentCluster: isProductionEnv(env.NODE_ENV) ? '?1' : undefined,
      xDownloadOptions: 'noopen',
      xContentTypeOptions: 'nosniff',
      xXssProtection: '1; mode=block',
      strictTransportSecurity: isProductionEnv(env.NODE_ENV)
        ? 'max-age=15552000; includeSubDomains; preload'
        : undefined,
      xFrameOptions: 'DENY',
      contentSecurityPolicy: {
        connectSrc: [
          "'self'",
          isDevelopmentEnv(env.NODE_ENV) ? 'https://api.scalar.com https://cdn.jsdelivr.net' : '',
        ],
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        childSrc: ["'self'"],
        fontSrc: ["'self'", isDevelopmentEnv(env.NODE_ENV) ? 'https://fonts.scalar.com' : ''],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        frameSrc: ["'self'"],
        imgSrc: ["'self'", isDevelopmentEnv(env.NODE_ENV) ? 'data:' : ''],
        manifestSrc: ["'self'"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        reportTo: 'endpoint-1',
        sandbox: ['allow-same-origin', 'allow-scripts'],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        scriptSrcElem: [
          "'self'",
          isDevelopmentEnv(env.NODE_ENV)
            ? "'unsafe-inline' https://cdn.jsdelivr.net/npm/@scalar/api-reference"
            : '',
        ],
        styleSrc: ["'self'", 'https:', isDevelopmentEnv(env.NODE_ENV) ? "'unsafe-inline'" : ''],
        styleSrcElem: ["'self'", isDevelopmentEnv(env.NODE_ENV) ? "'unsafe-inline'" : ''],
        workerSrc: ["'self'"],
        ...(isProductionEnv(env.NODE_ENV) && { upgradeInsecureRequests: [] }),
      },
    })
  )
  .use(
    timeout(TIMEOUT_REQUEST, () => {
      throw new AppError(ERRORS.api.timeout.statusCode, {
        message: ERRORS.api.timeout.message,
        type: ERRORS.api.timeout.type,
      })
    })
  )
  .use(requestLogger())

const routes = app
  .route('/v1', v1Routes)
  .notFound(() => {
    throw new AppError(HTTP_ERRORS.notFound.statusCode, {
      message: HTTP_ERRORS.notFound.message,
      type: HTTP_ERRORS.notFound.type,
    })
  })
  .onError(errorHandler)

// start server
const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  info => {
    logger.info(
      `Server is running on ${env.NODE_ENV === NODE_ENV.dev ? env.BASE_URL : `${info.address}:${info.port}`}`
    )
  }
)

// graceful shutdown
process.on('SIGINT', async err => {
  await gracefulShutdown(server, err)
})
process.on('SIGTERM', async err => {
  await gracefulShutdown(server, err)
})
process.on('uncaughtException', async error => {
  await gracefulShutdown(server, `Uncaught Exception: ${String(error)}`)
})
process.on('unhandledRejection', async error => {
  await gracefulShutdown(server, `Unhandled Rejection: ${String(error)}`)
})

// RPC to consumers
export type AppType = typeof routes
export type AppWithErrors = ApplyGlobalResponse<
  typeof routes,
  {
    [Key in ContentfulStatusCode]: { json: ApiResponseError }
  }
>

export type Client = ReturnType<typeof hc<AppWithErrors>>

export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<AppWithErrors>(...args)
