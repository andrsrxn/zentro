import { useState } from 'react'

/**
 * Manages a confirmation dialog flow using Promises.
 *
 * Allows asynchronous confirmation logic (e.g., awaiting user approval before proceeding).
 *
 * Returns a tuple with:
 * - `isOpen`: Whether the confirmation dialog should be visible.
 * - `confirm`: A function that opens the dialog and returns a Promise resolved with `true` or `false`.
 * - `handleConfirm`: Resolves the Promise with `true` and closes the dialog.
 * - `handleCancel`: Resolves the Promise with `false` and closes the dialog.
 *
 * @example
 * ```tsx
 * const [isOpen, confirm, handleConfirm, handleCancel] = useConfirm()
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm()
 *   if (confirmed) {
 *     deleteItem()
 *   }
 * }
 * ```
 */
export const useConfirm = (): [boolean, () => Promise<boolean>, () => void, () => void] => {
  // Promise state to handle resolve logic
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void // Removes the reject if not necessary
  } | null>(null)

  const confirm = async () =>
    new Promise<boolean>(resolve => {
      setPromise({ resolve })
    })

  const handleClose = () => {
    setPromise(null)
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  // Boolean to control the visibility of the dialog
  const isOpen = promise !== null

  return [isOpen, confirm, handleConfirm, handleCancel]
}
