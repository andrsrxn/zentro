/** biome-ignore-all lint/style/noMagicNumbers: minutes are constants */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NOTES } from '@zentro/constants/notes'
import type { CreateNoteInput, UpdateNoteInput } from '@zentro/schemas/notes'
import { getNoteById, getNotes } from '@/lib/data/notes'
import { createNote, deleteNote, updateNote } from '@/lib/mutations/notes'

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

export const useCreateNote = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input: CreateNoteInput) => createNote({ input }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTES.tags.all(),
      })
    },
  })

  return {
    createNote: mutation.mutate,
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  } as const
}

export const useUpdateNote = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNoteInput }) =>
      updateNote({ id, input }),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: NOTES.tags.all() }),
        queryClient.invalidateQueries({ queryKey: NOTES.tags.single(variables.id) }),
      ])
    },
  })

  return {
    createNote: mutation.mutate,
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  } as const
}

export const useDeleteNote = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteNote({ id }),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: NOTES.tags.all() }),
        queryClient.invalidateQueries({ queryKey: NOTES.tags.single(variables.id) }),
      ])
    },
  })

  return {
    createNote: mutation.mutate,
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  } as const
}
