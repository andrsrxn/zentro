import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/theme'

export const Panel = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('bg-dotted flex min-h-dvh w-full items-center justify-center', className)}
      {...props}>
      {children}
    </div>
  )
}
