import { NOTES } from '@zentro/constants/notes'
import { apiClient, rpc } from '@/lib/services/api-client'

export const getNotes = () => {
  return rpc({
    request: apiClient.notes.$get(),
    error: NOTES.errors.getAllFailed,
  })
}

export const getNoteById = ({ id }: { id: string }) => {
  return rpc({
    request: apiClient.notes[':id'].$get({ param: { id } }),
    error: NOTES.errors.getByIdFailed,
  })
}
