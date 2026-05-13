import { HEADERS } from '@zentro/constants/headers'
import { NOTES } from '@zentro/constants/notes'
import type { CreateNoteInput, UpdateNoteInput } from '@zentro/schemas/notes'
import { apiClient, rpc } from '@/lib/services/api-client'
import { getCsrfToken } from '@/lib/utils/csrf'

export const createNote = ({ input }: { input: CreateNoteInput }) => {
  const csrfToken = getCsrfToken()

  return rpc({
    request: apiClient.notes.$post(
      { json: input },
      { headers: { [HEADERS.csrf]: csrfToken ?? '' } }
    ),
    error: NOTES.errors.createFailed,
  })
}

export const updateNote = ({ id, input }: { id: string; input: UpdateNoteInput }) => {
  const csrfToken = getCsrfToken()

  return rpc({
    request: apiClient.notes[':id'].$patch(
      { param: { id }, json: input },
      { headers: { [HEADERS.csrf]: csrfToken ?? '' } }
    ),
    error: NOTES.errors.updateFailed,
  })
}

export const deleteNote = ({ id }: { id: string }) => {
  const csrfToken = getCsrfToken()

  return rpc({
    request: apiClient.notes[':id'].$delete(
      { param: { id } },
      { headers: { [HEADERS.csrf]: csrfToken ?? '' } }
    ),
    error: NOTES.errors.deleteFailed,
  })
}
