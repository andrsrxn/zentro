import { describe, expect, it } from 'vitest'
import { timingSafeEqual } from '@/utils/strings'

describe('timingSafeEqual', () => {
  it('returns true for identical strings', () => {
    expect(timingSafeEqual('secret_token', 'secret_token')).toBe(true)
  })

  it('returns false for different strings of the same length', () => {
    expect(timingSafeEqual('secret_token', 'secr3t_token')).toBe(false)
  })

  it('returns false for strings of different lengths', () => {
    expect(timingSafeEqual('short', 'longer_string')).toBe(false)
  })
})
