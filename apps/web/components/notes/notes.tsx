'use client'

import { IconExclamationCircle, IconLoader, IconNote } from '@tabler/icons-react'
import type { TimeZone } from '@zentro/constants/countries'
import { NOTES } from '@zentro/constants/notes'
import {
  StickyNote,
  StickyNoteContent,
  StickyNoteFooter,
  StickyNoteTitle,
} from '@/components/notes/sticky-note'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useNotes } from '@/lib/hooks/use-notes'
import { authClient } from '@/lib/services/auth-client'

export const Notes = () => {
  const { notes, isPending, error } = useNotes()
  const session = authClient.useSession()

  if (!session.data) {
    return null
  }

  const timeZone = session.data.user.timeZone as unknown as TimeZone

  if (isPending) {
    return (
      <div className='flex h-full items-center justify-center'>
        <IconLoader className='text-primary repeat-infinite size-8 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <Empty className='h-full'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <IconExclamationCircle className='text-destructive' />
          </EmptyMedia>
          <EmptyTitle>{NOTES.errors.default.message}</EmptyTitle>
          <EmptyDescription className='max-w-xs text-pretty'>
            {error.message} {error.details}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <Empty className='h-full select-none'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <IconNote className='text-primary' />
          </EmptyMedia>
          <EmptyTitle>No Notes Yet</EmptyTitle>
          <EmptyDescription className='max-w-xs text-pretty'>
            Double click anywhere in the panel or press the button below to add your first note.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-6'>
      {notes.map(note => (
        <StickyNote className='min-h-28' color={note.color} id={note.id} key={note.id}>
          <StickyNoteTitle>{note.title}</StickyNoteTitle>
          <StickyNoteContent>{note.content}</StickyNoteContent>
          <StickyNoteFooter createdAt={new Date(note.createdAt)} timeZone={timeZone} />
        </StickyNote>
      ))}
    </div>
  )
}
