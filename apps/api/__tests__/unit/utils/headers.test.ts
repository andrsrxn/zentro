import { NODE_ENV } from '@zentro/constants/env'
import { describe, expect, it } from 'vitest'
import { env } from '@/config/env'
import { getIP } from '@/utils/headers'

describe('getIP', () => {
  it('returns DEV_IP in development environment', () => {
    // Save original env values
    const originalEnv = env.NODE_ENV
    const originalDevIp = env.DEV_IP

    try {
      env.NODE_ENV = NODE_ENV.dev

      env.DEV_IP = '127.0.0.1'

      expect(getIP()).toBe('127.0.0.1')
    } finally {
      env.NODE_ENV = originalEnv

      env.DEV_IP = originalDevIp
    }
  })

  it('throws an error in development if DEV_IP is not set', () => {
    const originalEnv = env.NODE_ENV
    const originalDevIp = env.DEV_IP

    try {
      env.NODE_ENV = NODE_ENV.dev

      // @ts-expect-error
      env.DEV_IP = undefined

      expect(() => getIP()).toThrow('DEV_IP is not defined')
    } finally {
      env.NODE_ENV = originalEnv

      env.DEV_IP = originalDevIp
    }
  })

  it('returns null if fn is not provided in non-dev env', () => {
    const originalEnv = env.NODE_ENV
    try {
      env.NODE_ENV = NODE_ENV.prod

      expect(getIP()).toBeNull()
    } finally {
      env.NODE_ENV = originalEnv
    }
  })

  it('extracts IP from cf-connecting-ip', () => {
    const fn = (key: string) => (key === 'cf-connecting-ip' ? '192.168.1.1' : null)
    expect(getIP(fn)).toBe('192.168.1.1')
  })

  it('extracts IP from x-forwarded-for', () => {
    const fn = (key: string) => (key === 'x-forwarded-for' ? '10.0.0.1, 10.0.0.2' : null)
    expect(getIP(fn)).toBe('10.0.0.1')
  })

  it('extracts IP from forwarded header with ipv4', () => {
    const fn = (key: string) =>
      key === 'forwarded' ? 'for="192.0.2.60";proto=http;by=203.0.113.43' : null
    expect(getIP(fn)).toBe('192.0.2.60')
  })

  it('extracts IP from forwarded header with ipv6', () => {
    const fn = (key: string) =>
      key === 'forwarded' ? 'for="[2001:db8:cafe::17]";proto=http' : null
    expect(getIP(fn)).toBe('2001:db8:cafe::17')
  })
})
