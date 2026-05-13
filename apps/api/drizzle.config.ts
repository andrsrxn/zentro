import { defineConfig } from 'drizzle-kit'
import { env } from '@/config/env'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: './migrations',
  schema: './src/db/schema.ts',
  verbose: true,
  strict: true,
  casing: 'snake_case',
})
