'use client'

import { IconExclamationCircle, IconLoader, IconNote } from '@tabler/icons-react'
import { NOTES } from '@zentro/constants/notes'
import type { ComponentProps } from 'react'
import { NoteItem } from '@/components/notes/note-item'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useNotes } from '@/lib/hooks/use-notes'
import { authClient } from '@/lib/services/auth-client'
import { cn } from '@/lib/utils/theme'

export const Notes = ({ className, ...props }: ComponentProps<'div'>) => {
  const session = authClient.useSession()
  const { notes, isPending, error } = useNotes()

  if (!session.data) {
    return null
  }

  if (isPending) {
    return (
      <div className='pointer-events-none flex h-full items-center justify-center select-none'>
        <IconLoader className='text-primary repeat-infinite size-8 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <Empty className='h-full select-none'>
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
    <div
      className={cn(
        'animate-in wrapper fade-in zoom-in-98 grid max-w-7xl grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 py-24 duration-300 ease-in-out',
        className
      )}
      {...props}>
      {notes.map((note, index) => (
        <NoteItem key={note.id} note={note} index={index} />
      ))}
    </div>
  )
}
