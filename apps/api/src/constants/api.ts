import { COMPANY } from '@zentro/constants/company'
import { env } from '@/config/env'

export const API = {
  name: `${COMPANY.name} API`,
  baseUrl: env.BASE_URL,
  domain: new URL(env.BASE_URL).hostname,
} as const
