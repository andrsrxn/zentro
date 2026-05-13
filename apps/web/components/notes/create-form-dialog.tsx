'use client'

import { CreateNoteForm } from '@/components/notes/create-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useNotesStore } from '@/lib/store/notes'

export const CreateNoteFormDialog = () => {
  const openCreateForm = useNotesStore(state => state.openCreateForm)
  const setOpenCreateForm = useNotesStore(state => state.setOpenCreateForm)

  return (
    <Dialog open={openCreateForm} onOpenChange={setOpenCreateForm}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription className='sr-only'>
            Select a color and enter the note content
          </DialogDescription>
        </DialogHeader>
        <CreateNoteForm
          onSuccess={() => setOpenCreateForm(false)}
          onCancel={() => setOpenCreateForm(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
