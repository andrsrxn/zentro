import { describe, expect, it, vi, beforeEach } from 'vitest'
import { gracefulShutdown, sendFieldValidationErrors } from '@/utils/errors'
import { logger } from '@/utils/logger'
import { db } from '@/db/drizzle'
import type { ServerType } from '@hono/node-server'
import { HTTP_ERRORS } from '@zentro/constants/errors'
import { AppError } from '@zentro/utils/errors'
import type { $ZodError } from 'zod/v4/core'

// Mock dependencies
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

vi.mock('@/db/drizzle', () => ({
  db: {
    $client: {
      end: vi.fn().mockResolvedValue(undefined),
    },
  },
}))

describe('errors utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('gracefulShutdown', () => {
    it('logs the error and closes db and server', async () => {
      const mockServerClose = vi.fn((cb) => cb && cb(undefined))
      const mockServer = {
        close: mockServerClose,
      } as unknown as ServerType

      // We don't want the test process to actually exit
      const mockExit = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any)

      await gracefulShutdown(mockServer, new Error('Test error'))

      expect(logger.error).toHaveBeenCalledWith('Server Error: Error: Test error')
      expect(db.$client.end).toHaveBeenCalled()
      expect(mockServer.close).toHaveBeenCalled()
      expect(mockExit).toHaveBeenCalledWith(0)

      mockExit.mockRestore()
    })

    it('exits with 1 if server.close passes an error', async () => {
      const mockServerClose = vi.fn((cb) => cb && cb(new Error('Close error')))
      const mockServer = {
        close: mockServerClose,
      } as unknown as ServerType

      const mockExit = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any)

      await gracefulShutdown(mockServer, 'String error')

      expect(logger.error).toHaveBeenCalledWith('Server Error: String error')
      expect(mockExit).toHaveBeenCalledWith(1)

      mockExit.mockRestore()
    })

    it('logs db close error but still exits', async () => {
      vi.mocked(db.$client.end).mockRejectedValueOnce(new Error('DB error'))
      const mockServerClose = vi.fn((cb) => cb && cb(undefined))
      const mockServer = {
        close: mockServerClose,
      } as unknown as ServerType

      const mockExit = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any)

      await gracefulShutdown(mockServer, 'error')

      expect(logger.error).toHaveBeenCalledWith('Error closing DB pool: Error: DB error')
      expect(mockServer.close).toHaveBeenCalled()

      mockExit.mockRestore()
    })
  })

  describe('sendFieldValidationErrors', () => {
    it('throws an AppError with formatted validation errors', () => {
      const mockZodError = {
        issues: [
          { path: ['email'], message: 'Invalid email' },
          { path: ['password'], message: 'Too short' },
          { path: [], message: 'General issue' },
        ],
      } as unknown as $ZodError

      try {
        sendFieldValidationErrors({ errors: mockZodError })
        expect.fail('Should have thrown AppError')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        const appError = error as AppError
        expect(appError.statusCode).toBe(HTTP_ERRORS.badRequest.statusCode)
        expect(appError.type).toBe(HTTP_ERRORS.badRequest.type)
        expect(appError.errors).toEqual([
          { field: 'email', message: 'Invalid email' },
          { field: 'password', message: 'Too short' },
          { field: '', message: 'General issue' },
        ])
      }
    })
  })
})
