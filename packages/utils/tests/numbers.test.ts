import { describe, expect, it } from 'vitest'
import {
  formatCompact,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRange,
  formatUnit,
} from '../src/numbers'

const DECIMAL_NUMBER = 1234.56
const PERCENT_VALUE = 75
const PERCENT_VALUE_DECIMAL = 0.75
const SHORT_VALUE = 2000
const LONG_VALUE = 1_500_000
const RANGE_START = 10
const RANGE_END = 20

describe('numbers', () => {
  describe('formatNumber', () => {
    it('formats a decimal number correctly', () => {
      expect(formatNumber(DECIMAL_NUMBER, { locale: 'en-US' })).toBe('1,234.56')
      expect(formatNumber(DECIMAL_NUMBER, { locale: 'de-DE' })).toMatch(/1\.234,56|1.234,56/)
    })

    it('handles invalid numbers by treating them as 0', () => {
      expect(formatNumber(Number.NaN, { locale: 'en-US' })).toBe('0')
      expect(formatNumber(Number.POSITIVE_INFINITY, { locale: 'en-US' })).toBe('0')
    })
  })

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(DECIMAL_NUMBER, { currency: 'USD', locale: 'en-US' })).toBe('$1,234.56')
    })
  })

  describe('formatPercent', () => {
    it('formats percentage correctly (scale false by default)', () => {
      // 75 -> 75%
      expect(formatPercent(PERCENT_VALUE, { locale: 'en-US' })).toBe('75%')
    })

    it('formats percentage correctly with scale true', () => {
      expect(formatPercent(PERCENT_VALUE, { locale: 'en-US' })).toBe('75%')
      // 0.75 -> 0.75% (in Intl it multiplies by 100 so 0.0075 -> 0.75%)
      expect(formatPercent(PERCENT_VALUE_DECIMAL, { locale: 'en-US' })).toBe('0.75%')
    })
  })

  describe('formatUnit', () => {
    it('formats unit correctly', () => {
      expect(formatUnit(10, { unit: 'liter', locale: 'en-US' })).toBe('10 L')
    })
  })

  describe('formatCompact', () => {
    it('formats compact number correctly', () => {
      expect(formatCompact(SHORT_VALUE, { locale: 'en-US' })).toBe('2K')
      expect(formatCompact(LONG_VALUE, { locale: 'en-US' })).toBe('1.5M')
    })
  })

  describe('formatRange', () => {
    it('formats a range of numbers correctly', () => {
      expect(formatRange(RANGE_START, RANGE_END, { locale: 'en-US' })).toBe('10–20')
    })
  })
})
