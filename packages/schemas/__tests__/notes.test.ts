import { NOTES } from '@zentro/constants'
import { describe, expect, it } from 'vitest'
import { createNoteSchema, updateNoteOrderSchema, updateNoteSchema } from '../src/notes'

describe('createNoteSchema', () => {
  it('should validate a correct note', () => {
    const validNote = {
      title: 'My Note',
      content: 'This is a note content',
      color: NOTES.defaultNoteColor.background, // yellow default
      positionX: 100,
      positionY: 200,
    }
    const result = createNoteSchema.safeParse(validNote)
    expect(result.success).toBe(true)
  })

  it('should invalidate note without title', () => {
    const invalidNote = {
      content: 'No title',
      color: NOTES.defaultNoteColor.background,
      positionX: 100,
      positionY: 200,
    }
    const result = createNoteSchema.safeParse(invalidNote)
    expect(result.success).toBe(false)
  })

  it('should invalidate note with empty title', () => {
    const invalidNote = {
      title: '   ',
      color: NOTES.defaultNoteColor.background,
      positionX: 100,
      positionY: 200,
    }
    const result = createNoteSchema.safeParse(invalidNote)
    expect(result.success).toBe(false)

    expect(result.error?.issues[0]?.message).toBe('Add the note title')
  })

  it('should validate note without content', () => {
    const validNote = {
      title: 'My Note',
      color: NOTES.defaultNoteColor.background,
      positionX: 100,
      positionY: 200,
    }
    const result = createNoteSchema.safeParse(validNote)
    expect(result.success).toBe(true)
  })

  it('should invalidate title longer than 100 characters', () => {
    const invalidNote = {
      title: 'a'.repeat(101),
      color: NOTES.defaultNoteColor.background,
      positionX: 100,
      positionY: 200,
    }
    const result = createNoteSchema.safeParse(invalidNote)
    expect(result.success).toBe(false)

    expect(result.error?.issues[0]?.message).toBe('Max of 100 characters')
  })

  it('should invalidate content longer than 500 characters', () => {
    const invalidNote = {
      title: 'My Note',
      content: 'a'.repeat(501),
      color: NOTES.defaultNoteColor.background,
      positionX: 100,
      positionY: 200,
    }
    const result = createNoteSchema.safeParse(invalidNote)
    expect(result.success).toBe(false)

    expect(result.error?.issues[0]?.message).toBe('Max of 500 characters')
  })

  it('should invalidate invalid color', () => {
    const invalidNote = {
      title: 'My Note',
      color: '#FF0000', // not in noteBackgroundColors
      positionX: 100,
      positionY: 200,
    }
    const result = createNoteSchema.safeParse(invalidNote)
    expect(result.success).toBe(false)

    expect(result.error?.issues[0]?.message).toBe('Invalid note color')
  })

  it('should invalidate missing position', () => {
    const invalidNote = {
      title: 'My Note',
      color: NOTES.defaultNoteColor.background,
    }
    const result = createNoteSchema.safeParse(invalidNote)
    expect(result.success).toBe(false)
  })
})

describe('updateNoteSchema', () => {
  it('should validate partial update', () => {
    const validUpdate = {
      title: 'New Title',
    }
    const result = updateNoteSchema.safeParse(validUpdate)
    expect(result.success).toBe(true)
  })

  it('should validate empty update', () => {
    const result = updateNoteSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should invalidate incorrect type in partial update', () => {
    const invalidUpdate = {
      positionX: '100', // should be number
    }
    const result = updateNoteSchema.safeParse(invalidUpdate)
    expect(result.success).toBe(false)
  })
})

describe('updateNoteOrderSchema', () => {
  it('should validate non-negative toIndex', () => {
    const result = updateNoteOrderSchema.safeParse({ toIndex: 5 })
    expect(result.success).toBe(true)
  })

  it('should validate zero toIndex', () => {
    const result = updateNoteOrderSchema.safeParse({ toIndex: 0 })
    expect(result.success).toBe(true)
  })

  it('should invalidate negative toIndex', () => {
    const result = updateNoteOrderSchema.safeParse({ toIndex: -1 })
    expect(result.success).toBe(false)

    expect(result.error?.issues[0]?.message).toBe('Invalid order number')
  })

  it('should invalidate missing toIndex', () => {
    const result = updateNoteOrderSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
