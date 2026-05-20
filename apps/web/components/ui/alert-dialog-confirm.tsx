import type { ComponentProps, RefObject } from 'react'
import {
  AlertDialog,
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
      autoFocus
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
        <Button onClick={onCancel} autoFocus variant='outline'>
          {cancelButton}
        </Button>

        <Button onClick={onConfirm} variant={variant}>
          {confirmButton}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
