import { NODE_ENV } from '@zentro/constants/env'
import 'server-only'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(Object.values(NODE_ENV)),
})

export const env = envSchema.parse(process.env)
