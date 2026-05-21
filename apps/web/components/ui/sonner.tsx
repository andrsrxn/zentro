'use client'

import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconLoader,
} from '@tabler/icons-react'
import { useTheme } from '@teispace/next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { cn } from '@/lib/utils/theme'

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className={cn('toaster group pointer-events-auto', className)}
      icons={{
        success: <IconCircleCheck className='size-4' />,
        info: <IconInfoCircle className='size-4' />,
        warning: <IconAlertTriangle className='size-4' />,
        error: <IconAlertOctagon className='size-4' />,
        loading: <IconLoader className='size-4 animate-spin' />,
      }}
      richColors
      duration={3500}
      closeButton
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
