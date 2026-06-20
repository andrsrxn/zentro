import { COOKIES } from '@zentro/constants/cookies'
import { HEADERS } from '@zentro/constants/headers'
import type { Context } from 'hono'
import { describe, expect, it } from 'vitest'
import { ensureCsrfCookie, generateCsrfToken, validateCsrfToken } from '@/utils/csrf'

describe('csrf utils', () => {
  describe('generateCsrfToken', () => {
    it('generates a 32 byte hex string', () => {
      const token = generateCsrfToken()
      expect(typeof token).toBe('string')
      expect(token.length).toBe(64) // 32 bytes = 64 hex characters
    })

    it('generates unique tokens', () => {
      const token1 = generateCsrfToken()
      const token2 = generateCsrfToken()
      expect(token1).not.toBe(token2)
    })
  })

  describe('ensureCsrfCookie', () => {
    it('returns existing cookie if present', () => {
      const mockContext = {
        req: {
          header: (name: string) =>
            name === 'Cookie' ? `${COOKIES.csrf.name}=existing-token` : null,
        },
        header: () => {},
      } as unknown as Context

      const token = ensureCsrfCookie(mockContext)
      expect(token).toBe('existing-token')
    })

    it('generates and sets new cookie if not present', () => {
      let setCookieHeader: string | undefined

      const mockContext = {
        req: {
          header: () => null,
        },
        header: (name: string, value: string) => {
          if (name.toLowerCase() === 'set-cookie') {
            setCookieHeader = value
          }
        },
      } as unknown as Context

      const token = ensureCsrfCookie(mockContext)
      expect(token.length).toBe(64)
      expect(setCookieHeader).toContain(`${COOKIES.csrf.name}=${token}`)
    })
  })

  describe('validateCsrfToken', () => {
    it('returns true when cookie and header match', () => {
      const token = generateCsrfToken()
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name.toLowerCase() === 'cookie') {
              return `${COOKIES.csrf.name}=${token}`
            }
            if (name.toLowerCase() === HEADERS.csrf.toLowerCase()) {
              return token
            }
            return null
          },
        },
      } as unknown as Context

      expect(validateCsrfToken(mockContext)).toBe(true)
    })

    it('returns false when cookie is missing', () => {
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name.toLowerCase() === HEADERS.csrf.toLowerCase()) {
              return 'some-token'
            }
            return null
          },
        },
      } as unknown as Context

      expect(validateCsrfToken(mockContext)).toBe(false)
    })

    it('returns false when header is missing', () => {
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name.toLowerCase() === 'cookie') {
              return `${COOKIES.csrf.name}=some-token`
            }
            return null
          },
        },
      } as unknown as Context

      expect(validateCsrfToken(mockContext)).toBe(false)
    })

    it('returns false when they do not match', () => {
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name.toLowerCase() === 'cookie') {
              return `${COOKIES.csrf.name}=token-1`
            }
            if (name.toLowerCase() === HEADERS.csrf.toLowerCase()) {
              return 'token-2'
            }
            return null
          },
        },
      } as unknown as Context

      expect(validateCsrfToken(mockContext)).toBe(false)
    })
  })
})
