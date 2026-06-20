import { describe, expect, it } from 'vitest'
import { logger } from '@/utils/logger'

describe('logger', () => {
  it('is defined as a pino instance', () => {
    expect(logger).toBeDefined()
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.debug).toBe('function')
  })

  it('is set to silent level in test environment', () => {
    expect(logger.level).toBe('silent')
  })
})
