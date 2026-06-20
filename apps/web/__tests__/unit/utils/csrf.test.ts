/** biome-ignore-all lint/suspicious/noDocumentCookie: allowed */

import { COOKIES } from '@zentro/constants/cookies'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/services/api-client'
import { deleteCsrfToken, ensureCsrfToken, getCsrfToken } from '@/lib/utils/csrf'

vi.mock('@/lib/services/api-client', () => ({
  apiClient: {
    csrf: {
      // biome-ignore lint/style/useNamingConvention: RPC
      $get: vi.fn(),
    },
  },
}))

const CSRF_COOKIE = COOKIES.csrf.name
describe('csrf utils', () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.cookie = ''
  })

  describe('getCsrfToken', () => {
    it('returns null if cookie is not set', () => {
      expect(getCsrfToken()).toBeNull()
    })

    it('returns the token if cookie is set', () => {
      document.cookie = `${CSRF_COOKIE}=test-token-123; path=/`
      expect(getCsrfToken()).toBe('test-token-123')
    })

    it('returns the token even with other cookies present', () => {
      document.cookie = `other_cookie=value123; ${CSRF_COOKIE}=test-token-456; another=test`
      expect(getCsrfToken()).toBe('test-token-456')
    })
  })

  describe('deleteCsrfToken', () => {
    it('deletes the csrf cookie by setting its expiration to the past', () => {
      document.cookie = `${CSRF_COOKIE}=test-token-123; path=/`

      deleteCsrfToken()

      // JSDOM might not actually delete it but update it, however for testing
      // cookie deletion logic via document.cookie assignment, we just verify the string.
      // A more robust way is to spy on document.cookie setter, but let's check if it clears it or updates it.
      // In JSDOM, setting a past date might clear it.
      expect(document.cookie).not.toContain('test-token-123')
    })
  })

  describe('ensureCsrfToken', () => {
    it('does not call api if token already exists', async () => {
      document.cookie = `${CSRF_COOKIE}=test-token-123; path=/`
      await ensureCsrfToken()
      expect(apiClient.csrf.$get).not.toHaveBeenCalled()
    })

    it('calls api if token does not exist', async () => {
      await ensureCsrfToken()
      expect(apiClient.csrf.$get).toHaveBeenCalled()
    })

    it('handles api errors gracefully', async () => {
      vi.mocked(apiClient.csrf.$get).mockRejectedValueOnce(new Error('Network error'))
      // Should not throw
      await expect(ensureCsrfToken()).resolves.not.toThrow()
    })
  })
})
