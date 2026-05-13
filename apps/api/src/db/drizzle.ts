import { isProductionEnv } from '@zentro/utils/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import Pg from 'pg'
import { env } from '@/config/env'
import { API } from '@/constants/api'
import { logger } from '@/utils/logger'

export const dbClient = new Pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: isProductionEnv(env.NODE_ENV),
  application_name: API.name,
  max: 25,
  idleTimeoutMillis: 30_000,
})

dbClient.on('error', err => {
  logger.error('Idle DB pool client error')
  throw err
})

export const db = drizzle({
  client: dbClient,
  logger: !isProductionEnv(env.NODE_ENV),
  casing: 'snake_case',
})
