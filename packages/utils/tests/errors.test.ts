import { HTTP_ERRORS } from '@zentro/constants/errors'
import { describe, expect, it } from 'vitest'
import { normalizeCause } from '../src/errors'

describe('errors', () => {
  describe('normalizeCause', () => {
    it('returns undefined for falsy values', () => {
      expect(normalizeCause(undefined)).toBeUndefined()
      expect(normalizeCause(null)).toBeUndefined()
      expect(normalizeCause('')).toBeUndefined()
    })

    it('normalizes an Error instance', () => {
      const error = new Error('Test error message')
      const result = normalizeCause(error)
      expect(result).toEqual(
        `Name: ${error.name}. Message: ${error.message}. Cause: ${error.cause}`
      )
    })

    it('normalizes a string cause', () => {
      const result = normalizeCause('String error message')
      expect(result).toEqual('String error message')
    })

    it('normalizes an object cause', () => {
      const obj = { custom: 'error', code: 500 }
      const result = normalizeCause(obj)
      expect(result).toEqual(JSON.stringify(obj))
    })

    it('normalizes other types (like numbers)', () => {
      const result = normalizeCause(HTTP_ERRORS.notFound.statusCode)
      expect(result).toEqual('404')
    })
  })
})
