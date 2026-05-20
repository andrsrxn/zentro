'use client'

import { NOTES, type NoteBackgroundColor } from '@zentro/constants/notes'
import { useState } from 'react'
import { CreateNoteForm } from '@/components/notes/create-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useNotesStore } from '@/lib/store/notes'
import { getNoteForegroundColor } from '@/lib/utils/notes'

export const CreateNoteFormDialog = () => {
  const [color, setColor] = useState<NoteBackgroundColor>(NOTES.defaultNoteColor.background)
  const openCreateForm = useNotesStore(state => state.openCreateForm)
  const setOpenCreateForm = useNotesStore(state => state.setOpenCreateForm)

  return (
    <Dialog
      open={openCreateForm}
      onOpenChange={open => {
        if (!open) {
          setColor(NOTES.defaultNoteColor.background)
        }
        setOpenCreateForm(open)
      }}>
      <DialogContent className='rounded-xs pt-3 sm:max-w-sm' style={{ backgroundColor: color }}>
        <DialogHeader>
          <DialogTitle className='sr-only' style={{ color: getNoteForegroundColor(color) }}>
            Create Note
          </DialogTitle>
          <DialogDescription className='sr-only'>
            Select a color and enter the note content
          </DialogDescription>
        </DialogHeader>
        <CreateNoteForm
          onSuccess={() => {
            setColor(NOTES.defaultNoteColor.background)
            setOpenCreateForm(false)
          }}
          onCancel={() => {
            setColor(NOTES.defaultNoteColor.background)
            setOpenCreateForm(false)
          }}
          onColorChange={setColor}
        />
      </DialogContent>
    </Dialog>
  )
}
