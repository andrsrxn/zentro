'use client'

import {
  IconDots,
  IconExclamationCircle,
  IconLoader,
  IconNote,
  IconPalette,
  IconTrash,
} from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TimeZone } from '@zentro/constants/countries'
import { NOTES, type Note } from '@zentro/constants/notes'
import type { UpdateNoteInput } from '@zentro/schemas/notes'
import { type ComponentProps, useRef } from 'react'
import { toast } from 'sonner'
import {
  StickyNote,
  StickyNoteContent,
  StickyNoteFooter,
  StickyNoteTitle,
} from '@/components/notes/sticky-note'
import { AlertDialogConfirm } from '@/components/ui/alert-dialog-confirm'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useConfirm } from '@/lib/hooks/use-confirm'
import { useNotes } from '@/lib/hooks/use-notes'
import { deleteNote, updateNote } from '@/lib/mutations/notes'
import { authClient } from '@/lib/services/auth-client'
import { capitalizeFirstLetter } from '@/lib/utils/strings'
import { cn } from '@/lib/utils/theme'

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: temporal
export const Notes = ({ className, ...props }: ComponentProps<'div'>) => {
  const session = authClient.useSession()
  const { notes, isPending, error } = useNotes()
  const [isConfirmOpen, confirm, handleConfirm, handleCancel] = useConfirm()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const queryClient = useQueryClient()

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (noteId: string) => deleteNote({ id: noteId }),

    onMutate: async noteId => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: NOTES.tags.all() }),
        queryClient.cancelQueries({ queryKey: NOTES.tags.single(noteId) }),
      ])

      const previousNotes = queryClient.getQueryData<Note[]>(NOTES.tags.all())
      const previousNote = queryClient.getQueryData<Note>(NOTES.tags.single(noteId))

      queryClient.setQueryData<Note[]>(NOTES.tags.all(), old =>
        old?.filter(note => note.id !== noteId)
      )

      queryClient.removeQueries({
        queryKey: NOTES.tags.single(noteId),
        exact: true,
      })

      return { previousNotes, previousNote }
    },

    onSuccess: () => {
      toast.success(NOTES.success.deleted.message)
    },

    onError: (error, noteId, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(NOTES.tags.all(), context.previousNotes)
      }

      if (context?.previousNote) {
        queryClient.setQueryData(NOTES.tags.single(noteId), context.previousNote)
      }

      toast.error(error.message)
    },
  })

  const { mutate: updateMutate } = useMutation({
    mutationFn: ({ noteId, input }: { noteId: string; input: UpdateNoteInput }) =>
      updateNote({ id: noteId, input }),
    onMutate: async ({ noteId, input: newNoteInput }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: NOTES.tags.all() }),
        queryClient.cancelQueries({ queryKey: NOTES.tags.single(noteId) }),
      ])

      const previousNotes = queryClient.getQueryData<Note[]>(NOTES.tags.all())
      const previousNote = queryClient.getQueryData<Note>(NOTES.tags.single(noteId))

      queryClient.setQueryData<Note[]>(NOTES.tags.all(), old => {
        return old
          ? old.map(note => (note.id === noteId ? { ...note, ...newNoteInput } : note))
          : old
      })

      queryClient.setQueryData<Note>(NOTES.tags.single(noteId), old => {
        return old ? { ...old, ...newNoteInput } : old
      })

      return { previousNotes, previousNote }
    },

    onSuccess: (updatedNote, { noteId }) => {
      // reconcile with real server data instead of invalidate and refetch
      if (!updatedNote) {
        return
      }

      queryClient.setQueryData<Note>(NOTES.tags.single(noteId), {
        ...updatedNote,
        createdAt: new Date(updatedNote.createdAt),
        updatedAt: new Date(updatedNote.updatedAt),
      })

      queryClient.setQueryData<Note[]>(NOTES.tags.all(), old => {
        if (!old) {
          return old
        }

        return old.map(note =>
          note.id === noteId
            ? {
                ...updatedNote,
                createdAt: new Date(updatedNote.createdAt),
                updatedAt: new Date(updatedNote.updatedAt),
              }
            : note
        )
      })

      toast.success(NOTES.success.updated.message)
    },
    onError: (error, { noteId }, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(NOTES.tags.all(), context.previousNotes)
      }
      if (context?.previousNote) {
        queryClient.setQueryData(NOTES.tags.single(noteId), context.previousNote)
      }
      toast.error(error.message)
    },
  })

  if (!session.data) {
    return null
  }

  const timeZone = session.data.user.timeZone as unknown as TimeZone

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
    <>
      <div
        className={cn(
          'animate-in wrapper fade-in zoom-in-98 grid max-w-7xl grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 py-24 duration-300 ease-in-out',
          className
        )}
        {...props}>
        {notes.map((note, index) => (
          <StickyNote
            group='notes'
            index={index}
            onDoubleClick={e => e.stopPropagation()}
            className={cn('min-h-28')}
            color={note.color}
            id={note.id}
            key={note.id}>
            <StickyNoteTitle color={note.color} noteId={note.id}>
              {note.title}
            </StickyNoteTitle>
            <StickyNoteContent color={note.color} noteId={note.id}>
              {note.content}
            </StickyNoteContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onFocusCapture={e => {
                    // To restore the focus to the trigger when the alert dialog closes
                    triggerRef.current = e.currentTarget
                  }}
                  className={cn(
                    'absolute top-2 right-2 hover:bg-black/10 dark:hover:bg-white/10',
                    note.color === NOTES.colors.black.background &&
                      'hover:bg-white/20! hover:text-white!'
                  )}
                  variant='ghost'
                  size='icon'>
                  <IconDots />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onCloseAutoFocus={e => {
                  if (isConfirmOpen) {
                    e.preventDefault()
                  }
                }}
                className='w-20'
                align='end'
                side='bottom'>
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IconPalette />
                      Color
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {Object.entries(NOTES.colors).map(([key, value]) => (
                          <DropdownMenuItem
                            key={key}
                            aria-label={capitalizeFirstLetter(key)}
                            className={cn(
                              value.background === note.color && 'bg-primary/10 focus:bg-primary/15'
                            )}
                            onSelect={() => {
                              if (value.background === note.color) {
                                return
                              }
                              updateMutate({ noteId: note.id, input: { color: value.background } })
                            }}>
                            <div
                              className='h-5 w-full rounded-sm border'
                              style={{ backgroundColor: value.background }}
                            />
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                    onSelect={async () => {
                      const confirmed = await confirm()
                      if (confirmed) {
                        deleteMutate(note.id)
                      }
                    }}
                    variant='destructive'>
                    <IconTrash />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <StickyNoteFooter
              color={note.color}
              createdAt={new Date(note.createdAt)}
              timeZone={timeZone}
            />
          </StickyNote>
        ))}
      </div>
      <AlertDialogConfirm
        open={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title='Delete Note'
        message='Are you sure you want to delete this note? This action cannot be undone.'
        confirmButton='Delete'
        returnFocusRef={triggerRef}
      />
    </>
  )
}
