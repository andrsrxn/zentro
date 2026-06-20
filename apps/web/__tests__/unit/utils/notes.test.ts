import { NOTES } from '@zentro/constants/notes'
import { describe, expect, it } from 'vitest'
import { getNoteForegroundColor } from '@/lib/utils/notes'

describe('getNoteForegroundColor', () => {
  it('returns the correct foreground color for a given background color', () => {
    // Test with the default color
    const defaultColor = NOTES.defaultNoteColor.background
    const expectedForeground = NOTES.defaultNoteColor.foreground

    expect(getNoteForegroundColor(defaultColor)).toBe(expectedForeground)
  })

  it('returns undefined for an invalid color', () => {
    // @ts-expect-error
    expect(getNoteForegroundColor('#invalid')).toBeUndefined()
  })
})
