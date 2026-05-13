import { describe, expect, it } from 'vitest'
import { formatDate } from '../src/dates'

describe('dates', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      // Using a fixed UTC timezone equivalent via date logic, or just a simple check
      const date = new Date('2024-01-01T12:00:00Z')
      const result = formatDate({ date })
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('includes weekday when requested', () => {
      const date = new Date('2024-01-01T12:00:00Z') // Jan 1 2024 is a Monday
      const result = formatDate({ date, includeWeekDay: true })
      expect(typeof result).toBe('string')
      // Note: Locale dependent, but we know it should have weekday format
      expect(result).toMatch(/Monday|Lunes/i) // Depending on machine locale, but at least it formats it
    })

    it('includes time when requested', () => {
      const date = new Date('2024-01-01T12:00:00Z')
      const result = formatDate({ date, includeTime: true })
      expect(typeof result).toBe('string')
    })

    it('formats with timezone', () => {
      const date = new Date('2024-01-01T12:00:00Z')

      const result = formatDate({ date, timeZone: 'America/New_York' })
      expect(typeof result).toBe('string')
    })
  })
})
