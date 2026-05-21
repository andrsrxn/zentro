/** biome-ignore-all lint/performance/noNamespaceImport: zod best approach */

import { NODE_ENV } from '@zentro/constants/env'
import { config } from 'dotenv'
import * as z from 'zod'

config()

const envSchema = z.object({
  PORT: z.coerce.number(),
  BASE_URL: z.url(),
  DEV_IP: z.ipv4(),
  DATABASE_URL: z.url(),
  WEB_URL: z.url(),
  NODE_ENV: z.enum(Object.values(NODE_ENV)),
  DATABASE_URL_TEST: z.url().optional(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
