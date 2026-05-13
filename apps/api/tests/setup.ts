// apps/api/src/tests/setup.ts
import { afterAll, beforeAll } from 'vitest'
import { env } from '@/config/env'
import { db } from '@/db/drizzle'

beforeAll(() => {
  process.env.DATABASE_URL = env.DATABASE_URL_TEST
})

afterAll(async () => {
  await db.$client.end()
})
