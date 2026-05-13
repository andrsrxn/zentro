import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/theme'

export const NotesHeader = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <header className={cn('flex w-full items-center justify-between', className)} {...props}>
      {children}
    </header>
  )
}
