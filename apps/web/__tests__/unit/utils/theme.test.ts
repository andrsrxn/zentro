import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils/theme'

describe('cn', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
    expect(cn('p-4 text-red-500', 'text-blue-500')).toBe('p-4 text-blue-500')
  })

  it('handles conditional classes', () => {
    expect(cn('p-4', 'text-red-500', false)).toBe('p-4 text-red-500')
  })

  it('handles arrays and objects', () => {
    expect(cn(['p-4', 'text-red-500'])).toBe('p-4 text-red-500')
    expect(cn({ 'p-4': true, 'text-red-500': false })).toBe('p-4')
  })
})
