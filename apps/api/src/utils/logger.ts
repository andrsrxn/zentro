import { isDevelopmentEnv, isTestEnv } from '@zentro/utils/env'
import pino from 'pino'
import { env } from '@/config/env'
import { API } from '@/constants/api'

export const logger = pino({
  name: API.name,
  level: isDevelopmentEnv(env.NODE_ENV) ? 'debug' : 'info',

  redact: {
    paths: ['*.password', '*.token', '*.secret', '*.authorization', '*.cookie'],
    censor: '[REDACTED]',
  },

  transport: isDevelopmentEnv(env.NODE_ENV)
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat: '{msg} {context}',
        },
      }
    : undefined,

  // silent in tests
  ...(isTestEnv(env.NODE_ENV) && { level: 'silent' }),

  // base fields added to every log line
  base: {
    env: env.NODE_ENV,
    app: API.name,
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  serializers: {
    ...pino.stdSerializers,
    cause: (cause: unknown) => cause, // already normalized in AppError
  },
})
