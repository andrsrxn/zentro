import { describe, expect, it, vi } from 'vitest'
import { isDevelopmentEnv, isProductionEnv, isTestEnv } from '../src/env'

// Mock the environment constants
vi.mock('@zentro/constants/env', () => ({
  NODE_ENV: {
    prod: 'production',
    dev: 'development',
    test: 'test',
  },
}))

describe('env', () => {
  describe('isProductionEnv', () => {
    it('returns true for production', () => {
      expect(isProductionEnv('production')).toBe(true)
    })
    it('returns false for others', () => {
      expect(isProductionEnv('development')).toBe(false)
      expect(isProductionEnv('test')).toBe(false)
    })
  })

  describe('isDevelopmentEnv', () => {
    it('returns true for development', () => {
      expect(isDevelopmentEnv('development')).toBe(true)
    })
    it('returns false for others', () => {
      expect(isDevelopmentEnv('production')).toBe(false)
      expect(isDevelopmentEnv('test')).toBe(false)
    })
  })

  describe('isTestEnv', () => {
    it('returns true for test', () => {
      expect(isTestEnv('test')).toBe(true)
    })
    it('returns false for others', () => {
      expect(isTestEnv('production')).toBe(false)
      expect(isDevelopmentEnv('test')).toBe(false)
    })
  })
})
