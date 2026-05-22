/** biome-ignore-all lint/performance/noNamespaceImport: one single object */

import { COOKIE_OPTIONS } from '@zentro/constants/cookies'
import { isProductionEnv } from '@zentro/utils/env'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth/minimal'
import { lastLoginMethod, openAPI } from 'better-auth/plugins'
import { env } from '@/config/env'
import { API } from '@/constants/api'
import { ALLOWED_ORIGINS } from '@/constants/hosts'
import { db } from '@/db/drizzle'
import * as schema from '@/db/schema'
import { getGeolocation } from '@/utils/geolocation'
import { getIP } from '@/utils/headers'

const CACHE_MINUTES = 5

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    transaction: true,
    usePlural: true,
    schema,
  }),
  advanced: {
    crossSubDomainCookies: {
      enabled: isProductionEnv(env.NODE_ENV),
      domain: COOKIE_OPTIONS.domain,
    },
  },
  // TODO: hacer una lista de al menos 8 notas, crear imagenes, descripcion del proyecto, añadir url a github
  plugins: [openAPI(), lastLoginMethod()],
  appName: API.name,
  basePath: '/v1/auth',
  baseURL: env.BETTER_AUTH_URL,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: CACHE_MINUTES * 60,
    },
  },

  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      countryCode: {
        type: 'string',
        required: false,
        input: true,
        defaultValue: 'US',
      },
      timeZone: {
        type: 'string',
        required: false,
        input: true,
        default: 'UTC',
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const ip = getIP(ctx?.getHeader)
          let countryCode = 'US'
          let timeZone = 'UTC'

          if (ip) {
            const geolocation = await getGeolocation({ ip })
            if (geolocation.error) {
              return { data: { ...user, countryCode, timeZone } }
            }

            countryCode = geolocation.data.location.country_code.toUpperCase()
            timeZone = geolocation.data.location.timezone
          }

          return { data: { ...user, countryCode, timeZone } }
        },
      },
    },
  },
  logger: {
    disabled: false,
  },
  telemetry: {
    enabled: false,
  },
  trustedOrigins: ALLOWED_ORIGINS,
  socialProviders: {
    github: {
      prompt: 'select_account',
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      scope: ['user:email'],
    },
    google: {
      prompt: 'select_account',
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      scope: ['profile', 'email'],
    },
  },
}) as unknown as ReturnType<typeof betterAuth>
