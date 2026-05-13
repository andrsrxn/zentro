import { describe, expect, it } from 'vitest'
import { capitalizeAllWords, capitalizeFirstLetter } from '../src/strings'

describe('strings', () => {
  describe('capitalizeFirstLetter', () => {
    it('capitalizes the first letter of a lowercase string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello')
    })

    it('keeps the first letter capitalized if already uppercase', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello')
    })

    it('handles empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('')
    })

    it('handles single character', () => {
      expect(capitalizeFirstLetter('a')).toBe('A')
    })
  })

  describe('capitalizeAllWords', () => {
    it('capitalizes all words in a phrase', () => {
      expect(capitalizeAllWords('hello world from vitest')).toBe('Hello World From Vitest')
    })

    it('handles multiple spaces properly (if simple split is used)', () => {
      expect(capitalizeAllWords('hello  world')).toBe('Hello  World')
    })

    it('handles empty string', () => {
      expect(capitalizeAllWords('')).toBe('')
    })
  })
})
