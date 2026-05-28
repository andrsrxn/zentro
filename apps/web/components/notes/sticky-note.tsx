/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: necessary for editing */
'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import type { TimeZone } from '@zentro/constants/countries'
import { NOTES, type Note, type NoteBackgroundColor } from '@zentro/constants/notes'
import { updateNoteSchema } from '@zentro/schemas/notes'
import { formatDate } from '@zentro/utils/dates'
import { type ComponentProps, useRef } from 'react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { useUpdateNote } from '@/lib/hooks/use-notes'
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

export const StickyNoteTitle = ({
  children,
  className,
  color,
  noteId,
}: ComponentProps<'textarea'> & {
  color: NoteBackgroundColor
  children: string
  noteId: string
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initialValueRef = useRef(children.trim())
  const fgColor = getNoteForegroundColor(color)
  const { mutate: updateNote, isPending } = useUpdateNote()

  const handleSave = (value: string) => {
    const trimmed = value.trim()

    if (trimmed === initialValueRef.current) {
      if (inputRef.current) {
        inputRef.current.value = initialValueRef.current.trim()
      }
      return
    }

    const result = updateNoteSchema.safeParse({
      title: trimmed,
    })

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? NOTES.errors.updateFailed.message)

      return
    }

    updateNote({
      id: noteId,
      input: {
        title: trimmed,
      },

      onSuccess: updated => {
        initialValueRef.current = updated.title
      },
    })
  }

  return (
    <textarea
      rows={1}
      ref={inputRef}
      defaultValue={initialValueRef.current}
      maxLength={50}
      autoCorrect='off'
      spellCheck={false}
      autoCapitalize='off'
      disabled={isPending}
      id={`note-title-${noteId}`}
      onBlur={e => {
        handleSave(e.currentTarget.value)
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
          return
        }

        if (e.key === 'Escape') {
          e.currentTarget.value = initialValueRef.current
          e.currentTarget.blur()
        }
      }}
      style={{
        color: fgColor,
      }}
      className={cn(
        'font-handwritten block field-sizing-content min-h-lh w-10/12 cursor-text resize-none overflow-hidden bg-transparent text-xl transition duration-200 ease-in-out outline-none md:text-2xl',

        isPending && 'pointer-events-none opacity-50',
        className
      )}
    />
  )
}

export const StickyNoteContent = ({
  children,
  className,
  color,
  noteId,
}: ComponentProps<'textarea'> & {
  children?: string
  color: NoteBackgroundColor
  noteId: string
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initialValue = children?.trim() ?? ''
  const initialValueRef = useRef(initialValue)
  const fgColor = getNoteForegroundColor(color)
  const placeholder = 'Add details...'

  const { mutate: updateNote, isPending } = useUpdateNote()

  const handleSave = (value: string) => {
    const trimmed = value.trim()

    if (trimmed === initialValueRef.current) {
      if (inputRef.current) {
        inputRef.current.value = initialValueRef.current.trim()
      }
      return
    }

    const result = updateNoteSchema.safeParse({
      content: trimmed,
    })

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? NOTES.errors.updateFailed.message)

      return
    }

    updateNote({
      id: noteId,

      input: {
        content: trimmed,
      },

      onSuccess: updated => {
        const nextValue = updated.content ?? ''

        initialValueRef.current = nextValue
      },
    })
  }

  return (
    <textarea
      rows={1}
      ref={inputRef}
      defaultValue={initialValueRef.current}
      maxLength={500}
      placeholder={placeholder}
      autoCorrect='off'
      spellCheck={false}
      autoCapitalize='off'
      disabled={isPending}
      id={`note-content-${noteId}`}
      onBlur={e => {
        handleSave(e.currentTarget.value.trim())
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
          return
        }

        if (e.key === 'Escape') {
          e.currentTarget.value = initialValueRef.current.trim()
          e.currentTarget.blur()
        }
      }}
      style={{
        color: fgColor,
      }}
      className={cn(
        'block field-sizing-content min-h-lh w-full resize-none overflow-hidden bg-transparent text-sm opacity-80 transition duration-200 ease-in-out outline-none empty:opacity-0 group-hover:empty:opacity-80 focus:opacity-80',
        'border-none p-0 shadow-none ring-0',
        isPending && 'pointer-events-none opacity-50',
        className
      )}
    />
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
