import { NOTES } from '@zentro/constants/notes'
import { apiClient, rpc } from '@/lib/services/api-client'

export const getNotes = ({ signal }: { signal?: AbortSignal }) => {
  return rpc({
    request: apiClient.notes.$get(
      {},
      {
        init: { signal },
      }
    ),
    error: NOTES.errors.getAllFailed,
  })
}

export const getNoteById = ({ id, signal }: { id: string; signal?: AbortSignal }) => {
  return rpc({
    request: apiClient.notes[':id'].$get(
      { param: { id } },
      {
        init: { signal },
      }
    ),
    error: NOTES.errors.getByIdFailed,
  })
}
