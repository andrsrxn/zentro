'use client'

import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NOTES, type Note } from '@zentro/constants/notes'
import type { UpdateNoteOrderInput } from '@zentro/schemas/notes'
import type { ComponentProps, MouseEvent } from 'react'
import { toast } from 'sonner'
import { CreateNoteFormDialog } from '@/components/notes/create-form-dialog'
import { FloatingBar } from '@/components/notes/floating-bar'
import { Panel } from '@/components/shared/panel'
import { updateNoteOrder } from '@/lib/mutations/notes'
import { useNotesStore } from '@/lib/store/notes'
import { cn } from '@/lib/utils/theme'

export const NotesPanel = ({ children, className, ...props }: ComponentProps<'div'>) => {
  const setOpenCreateForm = useNotesStore(state => state.setOpenCreateForm)
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: ({ id, ...input }: { id: string } & UpdateNoteOrderInput) =>
      updateNoteOrder({ id, input }),
    onMutate: async ({ id, ...newNoteInput }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: NOTES.tags.all() }),
        queryClient.cancelQueries({ queryKey: NOTES.tags.single(id) }),
      ])

      const previousNotes = queryClient.getQueryData<Note[]>(NOTES.tags.all())
      const previousNote = queryClient.getQueryData<Note>(NOTES.tags.single(id))

      queryClient.setQueryData<Note[]>(NOTES.tags.all(), old => {
        if (!old) {
          return old
        }

        // Optimistically move the item in the array
        const newNotes = old.filter(n => n.id !== id)
        const noteToMove = old.find(n => n.id === id)
        if (noteToMove && newNoteInput.toIndex !== undefined) {
          newNotes.splice(newNoteInput.toIndex, 0, noteToMove)
        }
        return newNotes
      })

      queryClient.setQueryData<Note>(NOTES.tags.single(id), old => {
        return old ? { ...old, ...newNoteInput } : old
      })

      return { previousNotes, previousNote, id }
    },

    onSuccess: (updatedNote, { id }) => {
      // reconcile with real server data instead of invalidate and refetch
      if (!updatedNote) {
        return
      }

      queryClient.setQueryData<Note>(NOTES.tags.single(id), {
        ...updatedNote,
        createdAt: new Date(updatedNote.createdAt),
        updatedAt: new Date(updatedNote.updatedAt),
      })

      queryClient.setQueryData<Note[]>(NOTES.tags.all(), old => {
        if (!old) {
          return old
        }

        return old
          .map(note =>
            note.id === id
              ? {
                  ...updatedNote,
                  createdAt: new Date(updatedNote.createdAt),
                  updatedAt: new Date(updatedNote.updatedAt),
                }
              : note
          )
          .toSorted((a, b) => a.order - b.order)
      })

      toast.success(NOTES.success.updated.message)
    },
    onError: (error, _variables, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData<Note[]>(NOTES.tags.all(), () =>
          context?.previousNotes?.toSorted((a, b) => a.order - b.order)
        )
      }
      if (context?.previousNote && context.id) {
        queryClient.setQueryData(NOTES.tags.single(context.id), context.previousNote)
      }

      toast.error(error.message)
    },
  })

  const handleDoubleClick = (e: MouseEvent) => {
    if (e.target instanceof Element && e.target.closest('[data-slot="sticky-note"]')) {
      return
    }
    setOpenCreateForm(true)
  }

  return (
    <Panel className={cn('relative size-full')} {...props} onDoubleClick={handleDoubleClick}>
      <DragDropProvider
        onDragEnd={event => {
          if (event.canceled) {
            return
          }

          const { source } = event.operation

          if (!source?.id) {
            return
          }

          if (isSortable(source)) {
            const { initialIndex, index } = source

            if (initialIndex !== index) {
              const toIndex = index

              mutate({
                id: source.id.toString(),
                toIndex,
              })
            }
          }
        }}>
        {children}

        <FloatingBar />
        <CreateNoteFormDialog />
      </DragDropProvider>
    </Panel>
  )
}
