import { describe, expect, it } from 'vitest'
import { formatUserAgent } from '@/lib/utils/device'

describe('formatUserAgent', () => {
  it('parses Chrome on Windows correctly', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    const result = formatUserAgent(ua)

    expect(result).toEqual({
      browser: 'Chrome 118',
      os: 'Windows 10',
      deviceType: undefined,
      deviceVendor: undefined,
    })
  })

  it('parses Safari on iOS correctly', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    const result = formatUserAgent(ua)

    expect(result).toEqual({
      browser: 'Mobile Safari 16',
      os: 'iOS 16',
      deviceType: 'mobile',
      deviceVendor: 'Apple',
    })
  })

  it('handles unknown or empty user agents gracefully', () => {
    const result = formatUserAgent('unknown')

    expect(result.browser).toBe('undefined')
    expect(result.os).toBe('undefined')
  })
})
