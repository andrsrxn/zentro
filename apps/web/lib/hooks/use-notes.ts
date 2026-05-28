/** biome-ignore-all lint/style/noMagicNumbers: minutes are constants */

import type { QueryClient } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NOTES, type Note } from '@zentro/constants/notes'
import type { CreateNoteInput, UpdateNoteInput, UpdateNoteOrderInput } from '@zentro/schemas/notes'
import { toast } from 'sonner'
import { getNoteById, getNotes } from '@/lib/data/notes'
import { createNote, deleteNote, updateNote, updateNoteOrder } from '@/lib/mutations/notes'
import { authClient } from '@/lib/services/auth-client'

// Shared logic

export const snapshotNotes = (qc: QueryClient) => ({
  all: qc.getQueryData<Note[]>(NOTES.tags.all()),
  single: (id: string) => qc.getQueryData<Note>(NOTES.tags.single(id)),
})

export const cancelNoteQueries = (qc: QueryClient, id?: string) =>
  Promise.all([
    qc.cancelQueries({ queryKey: NOTES.tags.all() }),
    ...(id ? [qc.cancelQueries({ queryKey: NOTES.tags.single(id) })] : []),
  ])

export const rollbackNotes = (
  qc: QueryClient,
  snapshot: { all?: Note[]; note?: Note },
  id?: string
) => {
  if (snapshot.all) {
    qc.setQueryData<Note[]>(
      NOTES.tags.all(),
      snapshot.all.toSorted((a, b) => a.order - b.order)
    )
  }
  if (snapshot.note && id) {
    qc.setQueryData(NOTES.tags.single(id), snapshot.note)
  }
}

export const normalizeNote = (
  note: Omit<Note, 'createdAt' | 'updatedAt'> & {
    createdAt: string | Date
    updatedAt: string | Date
  }
): Note => ({
  ...note,
  createdAt: new Date(note.createdAt),
  updatedAt: new Date(note.updatedAt),
})

export const setNoteInList = (qc: QueryClient, id: string, note: Note) =>
  qc.setQueryData<Note[]>(
    NOTES.tags.all(),
    old => old?.map(n => (n.id === id ? note : n)) ?? [note]
  )

export const setSingleNote = (qc: QueryClient, id: string, note: Note) =>
  qc.setQueryData<Note>(NOTES.tags.single(id), note)

export const addNoteToList = (qc: QueryClient, note: Note) =>
  qc.setQueryData<Note[]>(NOTES.tags.all(), old => (old ? [...old, note] : [note]))

export const removeNoteFromList = (qc: QueryClient, id: string) =>
  qc.setQueryData<Note[]>(NOTES.tags.all(), old => old?.filter(n => n.id !== id))

export const reconcileNote = (qc: QueryClient, id: string, serverNote: Note) => {
  const normalized = normalizeNote(serverNote)
  setNoteInList(qc, id, normalized)
  setSingleNote(qc, id, normalized)
}

// Hooks

export const useNotes = () => {
  const query = useQuery({
    queryKey: NOTES.tags.all(),
    queryFn: getNotes,
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

interface CreateNoteVariables {
  input: CreateNoteInput
  onSuccess?: (note: Note) => void
}

export const useCreateNote = () => {
  const qc = useQueryClient()
  const session = authClient.useSession()

  return useMutation({
    mutationFn: ({ input }: CreateNoteVariables) => createNote({ input }),

    onMutate: async ({ input }) => {
      await cancelNoteQueries(qc)
      const snapshot = snapshotNotes(qc)

      const optimisticNote: Note = {
        id: `optimistic-${crypto.randomUUID()}`,
        userId: session.data?.user.id ?? '',
        order: ((snapshot.all?.length ?? 0) + 1) * NOTES.orderStep,
        positionX: 0,
        positionY: 0,
        title: input.title,
        content: input.content,
        color: input.color,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      addNoteToList(qc, optimisticNote)

      return { previousNotes: snapshot.all, optimisticId: optimisticNote.id }
    },

    onSuccess: (created, { onSuccess }, ctx) => {
      if (!(created && ctx)) {
        return
      }
      const normalized = normalizeNote(created)
      reconcileNote(qc, ctx.optimisticId, normalized)

      // replace optimistic entry with real id
      qc.setQueryData<Note[]>(NOTES.tags.all(), old =>
        old?.map(n => (n.id === ctx.optimisticId ? normalized : n))
      )

      document
        .querySelector(`#${created.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })

      toast.success(NOTES.success.created.message)
      onSuccess?.(normalized)
    },

    onError: (error, _, ctx) => {
      rollbackNotes(qc, { all: ctx?.previousNotes })
      toast.error(error.message)
    },
  })
}

export const useDeleteNote = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteNote({ id }),

    onMutate: async ({ id }) => {
      await cancelNoteQueries(qc, id)
      const snapshot = snapshotNotes(qc)

      removeNoteFromList(qc, id)
      qc.removeQueries({ queryKey: NOTES.tags.single(id), exact: true })

      return { previousNotes: snapshot.all, previousNote: snapshot.single(id) }
    },

    onSuccess: () => toast.success(NOTES.success.deleted.message),

    onError: (error, { id }, ctx) => {
      rollbackNotes(qc, { all: ctx?.previousNotes, note: ctx?.previousNote }, id)
      toast.error(error.message)
    },
  })
}

interface UpdateNoteVariables {
  id: string
  input: UpdateNoteInput
  // TODO: check use notes, search temporal
  onSuccess?: (note: Note) => void
  onError?: () => void
}

export const useUpdateNote = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: UpdateNoteVariables) => updateNote({ id, input }),

    onMutate: async ({ id, input }) => {
      await cancelNoteQueries(qc, id)
      const snapshot = snapshotNotes(qc)

      // apply optimistic update to both caches
      qc.setQueryData<Note[]>(NOTES.tags.all(), old =>
        old?.map(n => (n.id === id ? { ...n, ...input } : n))
      )
      qc.setQueryData<Note>(NOTES.tags.single(id), old => (old ? { ...old, ...input } : old))

      return { previousNotes: snapshot.all, previousNote: snapshot.single(id) }
    },

    onSuccess: (updated, { id, onSuccess }) => {
      if (!updated) {
        return
      }
      const normalized = normalizeNote(updated)
      reconcileNote(qc, id, normalized)
      onSuccess?.(normalized)
      toast.success(NOTES.success.updated.message)
    },

    onError: (error, { id, onError }, ctx) => {
      rollbackNotes(qc, { all: ctx?.previousNotes, note: ctx?.previousNote }, id)
      onError?.()
      toast.error(error.message)
    },
  })
}

interface UpdateOrderVariables extends UpdateNoteOrderInput {
  id: string
}

export const useUpdateNoteOrder = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateOrderVariables) => updateNoteOrder({ id, input }),

    onMutate: async ({ id, toIndex }) => {
      await cancelNoteQueries(qc, id)
      const snapshot = snapshotNotes(qc)

      // optimistically reorder the list
      qc.setQueryData<Note[]>(NOTES.tags.all(), old => {
        if (!old) {
          return old
        }
        const without = old.filter(n => n.id !== id)
        const note = old.find(n => n.id === id)
        if (!note || toIndex === undefined) {
          return old
        }
        without.splice(toIndex, 0, note)
        return without
      })

      qc.setQueryData<Note>(NOTES.tags.single(id), old => (old ? { ...old, toIndex } : old))

      return { previousNotes: snapshot.all, previousNote: snapshot.single(id), id }
    },

    onSuccess: (updated, { id }) => {
      if (!updated) {
        return
      }
      const normalized = normalizeNote(updated)
      reconcileNote(qc, id, normalized)

      qc.setQueryData<Note[]>(NOTES.tags.all(), old => old?.toSorted((a, b) => a.order - b.order))

      toast.success(NOTES.success.updated.message)
    },

    onError: (error, { id }, ctx) => {
      rollbackNotes(qc, { all: ctx?.previousNotes, note: ctx?.previousNote }, id)
      toast.error(error.message)
    },
  })
}
