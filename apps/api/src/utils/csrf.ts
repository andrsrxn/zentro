import { COOKIES } from '@zentro/constants/cookies'
import { HEADERS } from '@zentro/constants/headers'
import { isProductionEnv } from '@zentro/utils/env'
import type { Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { env } from '@/config/env'
import { timingSafeEqual } from '@/utils/strings'

const TOKEN_LENGTH = 32
const TOKEN_BYTE_LENGTH = 16

export const generateCsrfToken = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(TOKEN_LENGTH))
  return Array.from(bytes, b => b.toString(TOKEN_BYTE_LENGTH).padStart(2, '0')).join('')
}

/**
 * If a CSRF cookie already exists, it is returned; otherwise, a new one is generated and set.
 */
export const ensureCsrfCookie = (c: Context): string => {
  const existing = getCookie(c, COOKIES.csrf.name)

  if (existing) {
    return existing
  }

  const token = generateCsrfToken()
  setCookie(c, COOKIES.csrf.name, token, {
    httpOnly: false,
    secure: isProductionEnv(env.NODE_ENV),
    maxAge: COOKIES.csrf.maxAge,
    sameSite: 'Strict',
    path: '/',
  })

  return token
}

/**
 * Validates the CSRF token based on the double-submit-cookie pattern
 */
export const validateCsrfToken = (c: Context): boolean => {
  const cookie = getCookie(c, COOKIES.csrf.name)
  const header = c.req.header(HEADERS.csrf)
  if (!(cookie && header)) {
    return false
  }

  // Prevent timing attacks
  return timingSafeEqual(cookie, header)
}
