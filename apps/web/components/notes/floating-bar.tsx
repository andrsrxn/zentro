'use client'

import { CollisionPriority } from '@dnd-kit/abstract'
import { useDragDropMonitor, useDroppable } from '@dnd-kit/react'
import { IconPlus } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { NOTES, type Note } from '@zentro/constants/notes'
import { useState } from 'react'
import { AlertDialogConfirm } from '@/components/ui/alert-dialog-confirm'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { useConfirm } from '@/lib/hooks/use-confirm'
import { useDeleteNote } from '@/lib/hooks/use-notes'
import { useNotesStore } from '@/lib/store/notes'
import { cn } from '@/lib/utils/theme'

export const FloatingBar = () => {
  const [isDraggingNote, setIsDraggingNote] = useState(false)
  const [isConfirmOpen, confirm, handleConfirm, handleCancel] = useConfirm()
  const openCreateNoteModal = useNotesStore(state => state.setOpenCreateForm)
  const { isDropTarget, ref } = useDroppable({
    id: 'floating-bar',
    accept: 'sticky-note',
    type: 'floating-bar',
    collisionPriority: CollisionPriority.Highest,
  })

  const queryClient = useQueryClient()
  const { mutate: deleteNote } = useDeleteNote()

  useDragDropMonitor({
    onDragStart: event => {
      const { source, activatorEvent } = event.operation

      const isKeyboardDrag =
        activatorEvent instanceof KeyboardEvent || activatorEvent?.type === 'keydown'

      // avoid it on keyboard drags
      if (source?.type === 'sticky-note' && !isKeyboardDrag) {
        setIsDraggingNote(true)
      }
    },

    onDragEnd: async event => {
      if (event.canceled) {
        setIsDraggingNote(false)
        return
      }

      const { source } = event.operation

      if (!source?.id) {
        return
      }
      const noteId = source.id.toString()

      const previousNotes = queryClient.getQueryData<Note[]>(NOTES.tags.all())
      const previousNote = queryClient.getQueryData<Note>(NOTES.tags.single(noteId))

      if (event.operation.target?.type === 'floating-bar') {
        queryClient.setQueryData<Note[]>(NOTES.tags.all(), old =>
          old?.filter(note => note.id !== noteId)
        )

        queryClient.removeQueries({
          queryKey: NOTES.tags.single(noteId),
          exact: true,
        })

        const confirmed = await confirm()
        if (confirmed) {
          deleteNote({ id: noteId })
        } else {
          queryClient.setQueryData<Note[]>(NOTES.tags.all(), () =>
            previousNotes?.toSorted((a, b) => a.order - b.order)
          )
          queryClient.setQueryData<Note>(NOTES.tags.single(noteId), previousNote)
        }
      }

      setIsDraggingNote(false)
    },
  })

  return (
    <div className='fixed bottom-4 z-50 w-max max-w-11/12'>
      <div className='fade-in animate-in slide-in-from-bottom-20 bg-card flex h-11 w-full max-w-full items-center justify-center gap-4 rounded-full border pr-2 pl-4 shadow-xl/5 transition duration-500 ease-in-out'>
        <span className='flex items-center gap-1.5 text-sm font-medium'>
          <span className='inline-block size-1 shrink-0 rounded-full bg-green-400' /> Actions
        </span>
        <div className='flex shrink-0 items-center gap-4' ref={ref}>
          {isDraggingNote ? (
            <span
              className={cn(
                'text-destructive border-destructive/30 bg-destructive/10 inline-flex items-center rounded-full border-2 border-dashed px-6 font-medium',
                isDropTarget && 'border-destructive'
              )}>
              Drop to delete
            </span>
          ) : (
            <Button className='rounded-full' onClick={() => openCreateNoteModal(true)}>
              <IconPlus /> Create Note <Kbd className='text-primary-foreground bg-black/30'>c</Kbd>
            </Button>
          )}
        </div>
      </div>

      <AlertDialogConfirm
        open={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title='Delete Note'
        message='Are you sure you want to delete this note? This action cannot be undone.'
        confirmButton='Delete'
      />
    </div>
  )
}
