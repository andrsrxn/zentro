import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { env } from '@/config/env'
import { db } from '@/db/drizzle'

export const server = setupServer()

beforeAll(() => {
  process.env.DATABASE_URL = env.DATABASE_URL_TEST ?? env.DATABASE_URL
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(async () => {
  server.close()
  await db.$client.end()
})
