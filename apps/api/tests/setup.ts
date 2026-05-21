import { config } from 'dotenv'
import { afterAll, beforeAll } from 'vitest'
import { env } from '@/config/env'
import { db } from '@/db/drizzle'

config()

beforeAll(() => {
  process.env.DATABASE_URL = env.DATABASE_URL_TEST ?? env.DATABASE_URL
})

afterAll(async () => {
  await db.$client.end()
})
