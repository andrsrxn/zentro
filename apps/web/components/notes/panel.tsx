'use client'

import type { ComponentProps } from 'react'
import { CreateNoteFormDialog } from '@/components/notes/create-form-dialog'
import { Panel } from '@/components/shared/panel'
import { useNotesStore } from '@/lib/store/notes'
import { cn } from '@/lib/utils/theme'

const DOUBLE_CLICK_DELAY = 200

export const NotesPanel = ({ children, className, ...props }: ComponentProps<'div'>) => {
  const setOpenCreateForm = useNotesStore(state => state.setOpenCreateForm)

  const handleDoubleClick = () => {
    // handle double click with a 200ms delay
    const lastClick = Date.now()
    if (lastClick - Date.now() < DOUBLE_CLICK_DELAY) {
      setOpenCreateForm(true)
    }
  }

  return (
    <Panel className={cn('relative size-full')} {...props} onDoubleClick={handleDoubleClick}>
      <div className='pointer-events-none fixed inset-0 z-50 flex size-full items-center justify-center select-none'>
        {children}
      </div>

      <CreateNoteFormDialog />
    </Panel>
  )
}
