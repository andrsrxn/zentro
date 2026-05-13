import { zValidator } from '@hono/zod-validator'
import { createNoteSchema, updateNoteSchema } from '@zentro/schemas/notes'
import { sendFieldValidationErrors } from '@/utils/errors'

export const validateNoteCreationData = zValidator('json', createNoteSchema, result => {
  if (!result.success) {
    sendFieldValidationErrors({ errors: result.error })
  }
})

export const validateNoteUpdateData = zValidator('json', updateNoteSchema, result => {
  if (!result.success) {
    sendFieldValidationErrors({ errors: result.error })
  }
})
