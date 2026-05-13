'use client'

import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { useNotesStore } from '@/lib/store/notes'

export const FloatingBar = () => {
  const openCreateNoteModal = useNotesStore(state => state.setOpenCreateForm)

  return (
    <div className='fixed bottom-4 left-1/2 -translate-x-1/2'>
      <div className='fade-in animate-in slide-in-from-bottom-20 bg-card z-100 flex h-11 w-fit max-w-full items-center justify-center gap-4 rounded-full border pr-2 pl-4 shadow-xl/5 transition duration-500 ease-in-out'>
        <span className='flex items-center gap-1.5 text-sm font-medium'>
          <span className='inline-block size-1 shrink-0 rounded-full bg-green-400' /> Actions
        </span>
        <div className='flex items-center gap-4'>
          <Button className='rounded-full' onClick={() => openCreateNoteModal(true)}>
            <IconPlus /> Create Note <Kbd className='text-primary-foreground bg-black/30'>c</Kbd>
          </Button>
        </div>
      </div>
    </div>
  )
}
