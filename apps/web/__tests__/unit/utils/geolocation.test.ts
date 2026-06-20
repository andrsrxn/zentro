import { describe, expect, it } from 'vitest'
import { getCountryName } from '@/lib/utils/geolocation'

describe('getCountryName', () => {
  it('returns country name and native name for a valid country code', () => {
    const result = getCountryName('US')
    expect(result).toEqual({
      name: 'United States',
      nativeName: 'United States',
    })

    const resultEs = getCountryName('ES')
    expect(resultEs).toEqual({
      name: 'Spain',
      nativeName: 'España',
    })
  })

  it('returns null for an invalid country code', () => {
    // @ts-expect-error
    expect(getCountryName('XX')).toBeNull()
  })
})
