'use client'

import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import type { ComponentProps, MouseEvent } from 'react'
import { CreateNoteFormDialog } from '@/components/notes/create-form-dialog'
import { FloatingBar } from '@/components/notes/floating-bar'
import { Panel } from '@/components/shared/panel'
import { useUpdateNoteOrder } from '@/lib/hooks/use-notes'
import { useNotesStore } from '@/lib/store/notes'
import { cn } from '@/lib/utils/theme'

export const NotesPanel = ({ children, className, ...props }: ComponentProps<'div'>) => {
  const setOpenCreateForm = useNotesStore(state => state.setOpenCreateForm)

  const { mutate: reorder } = useUpdateNoteOrder()

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

          const { source, target } = event.operation

          if (!source?.id) {
            return
          }

          if (target?.id === 'floating-bar' || target?.type === 'floating-bar') {
            return
          }

          if (isSortable(source)) {
            const { initialIndex, index } = source

            if (initialIndex !== index) {
              reorder({ id: source.id.toString(), toIndex: index })
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
