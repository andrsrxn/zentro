import type { ComponentProps, RefObject } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface AlertDialogConfirmProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  cancelButton?: string
  confirmButton?: string
  returnFocusRef?: RefObject<HTMLElement | null>
}

export const AlertDialogConfirm = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  cancelButton = 'Cancel',
  confirmButton = 'Confirm',
  variant = 'destructive',
  returnFocusRef,
}: AlertDialogConfirmProps & Pick<ComponentProps<typeof Button>, 'variant'>) => (
  <AlertDialog
    open={open}
    onOpenChange={o => {
      if (!o) {
        onCancel()
      }
    }}>
    <AlertDialogContent
      onCloseAutoFocus={e => {
        if (returnFocusRef?.current) {
          e.preventDefault()
          returnFocusRef.current.focus()
        }
      }}>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>

        <AlertDialogDescription>{message}</AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button onClick={onCancel} variant='outline'>
            {cancelButton}
          </Button>
        </AlertDialogCancel>

        <AlertDialogAction asChild variant={variant}>
          <Button onClick={onConfirm} variant={variant}>
            {confirmButton}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
