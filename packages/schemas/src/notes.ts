import { noteBackgroundColors } from '@zentro/constants/notes'
import { z } from 'zod'

const invalidType = 'Invalid type'

export const createNoteSchema = z.object({
  title: z
    .string(invalidType)
    .trim()
    .min(1, { error: 'Add the note title' })
    .max(100, { error: 'Max of 100 characters' }),
  content: z.string(invalidType).trim().max(500, { error: 'Max of 500 characters' }).optional(),
  color: z.enum(noteBackgroundColors, { error: 'Invalid note color' }),
  positionX: z.number(invalidType),
  positionY: z.number(invalidType),
})

export const updateNoteSchema = createNoteSchema.partial()
export const updateNoteOrderSchema = z.object({
  toIndex: z.number(invalidType).nonnegative({ error: 'Invalid order number' }),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
export type UpdateNoteOrderInput = z.infer<typeof updateNoteOrderSchema>
