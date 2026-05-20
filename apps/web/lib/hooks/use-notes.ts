/** biome-ignore-all lint/style/noMagicNumbers: minutes are constants */

import { useQuery } from '@tanstack/react-query'
import { NOTES } from '@zentro/constants/notes'
import { getNoteById, getNotes } from '@/lib/data/notes'

const staleTime = 1000 * 60 * NOTES.cacheTime.minutes
const gcTime = 1000 * 60 * NOTES.cacheTime.minutes

export const useNotes = () => {
  const query = useQuery({
    queryKey: NOTES.tags.all(),
    queryFn: getNotes,

    staleTime,
    gcTime,
  })

  return {
    notes: query.data ?? [],
    error: query.error,
    isPending: query.isPending,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  } as const
}

export const useNote = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: NOTES.tags.single(id),
    queryFn: () => getNoteById({ id }),

    staleTime,
    gcTime,
  })

  return {
    notes: query.data ?? [],
    error: query.error,
    isPending: query.isPending,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  } as const
}
