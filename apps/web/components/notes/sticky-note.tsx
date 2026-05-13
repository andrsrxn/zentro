import type { TimeZone } from '@zentro/constants/countries'
import { NOTES, type Note } from '@zentro/constants/notes'
import { formatDate } from '@zentro/utils/dates'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/theme'

export const StickyNote = ({
  color,
  id,
  children,
  className,
  ...props
}: ComponentProps<'div'> & Pick<Note, 'color' | 'id'>) => {
  const fgColor = Object.entries(NOTES.colors).find(([_, value]) => value.background === color)?.[1]
    .foreground

  return (
    <div
      id={id}
      {...props}
      className={cn(
        'animate-in fade-in zoom-in-95 flex flex-col rounded-lg p-4 shadow-md duration-300 ease-in-out',
        className
      )}
      style={{ backgroundColor: color, color: fgColor }}>
      {children}
    </div>
  )
}

export const StickyNoteTitle = ({ children, className, color }: ComponentProps<'h3'>) => {
  return (
    <h3 className={cn('text-xl', className)} style={{ color }}>
      {children}
    </h3>
  )
}

export const StickyNoteContent = ({ children, className }: ComponentProps<'p'>) => {
  return <p className={cn('block flex-1 opacity-80', className)}>{children}</p>
}

export const StickyNoteFooter = ({
  children,
  createdAt,
  timeZone,
  className,
}: ComponentProps<'div'> & Pick<Note, 'createdAt'> & { timeZone?: TimeZone }) => {
  const date = formatDate({ date: createdAt, timeZone })
  return (
    <div className={cn('border-t p-2 opacity-60', className)}>
      {children}
      <time dateTime={createdAt.toISOString()}>{date}</time>
    </div>
  )
}
