/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: necessary for editing */
'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TimeZone } from '@zentro/constants/countries'
import { NOTES, type Note, type NoteBackgroundColor } from '@zentro/constants/notes'
import { type UpdateNoteInput, updateNoteSchema } from '@zentro/schemas/notes'
import { formatDate } from '@zentro/utils/dates'
import { type ComponentProps, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { updateNote } from '@/lib/mutations/notes'
import { getNoteForegroundColor } from '@/lib/utils/notes'
import { cn } from '@/lib/utils/theme'

export const StickyNote = ({
  color,
  id,
  children,
  className,
  index,
  group,
  ...props
}: Omit<ComponentProps<'div'>, 'color'> &
  Pick<Note, 'color' | 'id'> & { index: number; group: string }) => {
  const fgColor = getNoteForegroundColor(color)
  const { ref, isDragging } = useSortable({
    accept: ['sticky-note', 'floating-bar'],
    type: 'sticky-note',
    id,
    index,
    group,
  })

  return (
    <div
      {...props}
      data-slot='sticky-note'
      ref={ref}
      className={cn(
        'group focus-visible:ring-ring/50 relative flex h-fit min-h-36 cursor-grab flex-col gap-2 rounded-xs border p-4 shadow-md duration-300 ease-in-out focus-visible:ring-3 focus-visible:outline-0',
        isDragging && 'opacity-60',
        className
      )}
      style={{ backgroundColor: color, color: fgColor }}>
      {children}
    </div>
  )
}

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: temporal
export const StickyNoteTitle = ({
  children,
  className,
  color,
  noteId,
}: ComponentProps<'h3'> & {
  isEditing?: boolean
  color: NoteBackgroundColor
  onEditingChange?: (isEditing: boolean) => void
  children: string
  noteId: string
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(children)
  const initialValueRef = useRef(children)
  const fgColor = getNoteForegroundColor(color)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (input: UpdateNoteInput) => updateNote({ id: noteId, input }),
    onMutate: async newNoteInput => {
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

    onSuccess: updatedNote => {
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

      initialValueRef.current = updatedNote.title
      toast.success(NOTES.success.updated.message)
    },
    onError: (error, _newNoteInput, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(NOTES.tags.all(), context.previousNotes)
      }
      if (context?.previousNote) {
        queryClient.setQueryData(NOTES.tags.single(noteId), context.previousNote)
      }
      const prevTitle =
        context?.previousNote?.title || context?.previousNotes?.find(n => n.id === noteId)?.title

      setValue(prevTitle || children)
      setIsEditing(false)
      toast.error(error.message)
    },
  })

  const handleOnStopEditing = () => {
    setIsEditing(false)
    if (value === children) {
      return
    }

    const result = updateNoteSchema.safeParse({ title: value })

    if (!result.success) {
      toast.error(
        result.error.issues.map(issue => issue.message)[0] ?? NOTES.errors.updateFailed.message
      )
      setValue(initialValueRef.current)
      return
    }

    mutate({ title: value })
  }

  if (isEditing) {
    return (
      <Input
        type='text'
        value={value}
        autoFocus={isEditing}
        disabled={isPending}
        onBlur={handleOnStopEditing}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') {
            handleOnStopEditing()
          }
        }}
        style={{
          color: fgColor,
          backgroundColor: color === NOTES.colors.black.background ? '#FFFFFF20' : '#00000010',
        }}
        onChange={e => setValue(e.target.value)}
        className={cn(
          'font-handwritten w-10/12 cursor-text rounded-none border-none! p-0 text-xl ring-0! outline-none! placeholder:text-current placeholder:opacity-60 md:text-2xl',
          className
        )}
      />
    )
  }

  return (
    <h3
      tabIndex={0}
      onFocus={() => setIsEditing(true)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsEditing(true)
        }
      }}
      onClick={() => setIsEditing(true)}
      className={cn(
        'font-handwritten line-clamp-2 w-10/12 cursor-text text-xl md:text-2xl',
        isPending && 'pointer-events-none opacity-50',
        className
      )}>
      {value}
    </h3>
  )
}

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: temporal
export const StickyNoteContent = ({
  children,
  className,
  color,
  noteId,
}: ComponentProps<'p'> & {
  isEditing?: boolean
  onEditingChange?: (isEditing: boolean) => void
  children?: string
  color: NoteBackgroundColor
  noteId: string
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(children)
  const initialValueRef = useRef(children)
  const fgColor = getNoteForegroundColor(color)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (input: UpdateNoteInput) => updateNote({ id: noteId, input }),
    onMutate: async newNoteInput => {
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

    onSuccess: updatedNote => {
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

      initialValueRef.current = updatedNote.content
      toast.success(NOTES.success.updated.message)
    },
    onError: (error, _newNoteInput, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(NOTES.tags.all(), context.previousNotes)
      }
      if (context?.previousNote) {
        queryClient.setQueryData(NOTES.tags.single(noteId), context.previousNote)
      }
      const prevContent =
        context?.previousNote?.content ||
        context?.previousNotes?.find(n => n.id === noteId)?.content

      setValue(prevContent || children)
      setIsEditing(false)
      toast.error(error.message)
    },
  })

  const handleOnStopEditing = () => {
    setIsEditing(false)
    if (value === children) {
      return
    }

    const result = updateNoteSchema.safeParse({ content: value })
    if (!result.success) {
      toast.error(
        result.error.issues.map(issue => issue.message)[0] ?? NOTES.errors.updateFailed.message
      )
      setValue(initialValueRef.current)
      return
    }

    mutate({ content: value })
  }

  if (isEditing) {
    return (
      <div className='h-full flex-1'>
        <Input
          type='text'
          value={value}
          autoFocus={isEditing}
          disabled={isPending}
          placeholder='Add details...'
          onBlur={handleOnStopEditing}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              handleOnStopEditing()
            }
          }}
          style={{
            color: fgColor,
            backgroundColor: color === NOTES.colors.black.background ? '#FFFFFF20' : '#00000010',
          }}
          onChange={e => setValue(e.target.value)}
          className={cn(
            'leading-auto h-auto! cursor-text rounded-none border-none! p-0 text-xs opacity-80 ring-0! outline-none! placeholder:text-current placeholder:opacity-60 md:text-sm',
            className
          )}
        />
      </div>
    )
  }

  return (
    <div className='h-full flex-1'>
      <p
        tabIndex={0}
        onFocus={() => setIsEditing(true)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsEditing(true)
          }
        }}
        onClick={() => setIsEditing(true)}
        className={cn(
          'block w-full cursor-text py-0.5 text-xs opacity-80 md:text-sm',
          isPending && 'pointer-events-none opacity-50',
          (!value || value === '') && 'opacity-0 transition-opacity group-hover:opacity-50',
          className
        )}>
        {value && value !== '' ? value : 'Add details...'}
      </p>
    </div>
  )
}

export const StickyNoteFooter = ({
  children,
  createdAt,
  color,
  timeZone,
  className,
}: Omit<ComponentProps<'div'>, 'color'> &
  Pick<Note, 'color' | 'createdAt'> & { timeZone?: TimeZone }) => {
  const fgColor = getNoteForegroundColor(color)
  const date = formatDate({ date: createdAt, timeZone })
  return (
    <div className={cn('flex flex-col gap-2 pt-1 opacity-60', className)}>
      <Separator className='opacity-30' style={{ backgroundColor: fgColor }} />
      {children}
      <time className='text-xs leading-none md:text-sm' dateTime={createdAt.toISOString()}>
        {date}
      </time>
    </div>
  )
}
