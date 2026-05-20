'use client'

import { formatForDisplay } from '@tanstack/react-hotkeys'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Kbd } from '@/components/ui/kbd'
import { useSharedStore } from '@/lib/store/shared'

export const ShortcutsDialog = () => {
  const shortcutsDialogOpen = useSharedStore(state => state.shortcutsDialogOpen)
  const setShortcutsDialogOpen = useSharedStore(state => state.setShortcutsDialogOpen)

  return (
    <Dialog open={shortcutsDialogOpen} onOpenChange={setShortcutsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shortcuts</DialogTitle>
          <DialogDescription>
            Use this list to navigate and interact with your Zentro board using only your keyboard.
          </DialogDescription>
        </DialogHeader>
        <div className='grid'>
          <div className='flex items-center justify-between border-b py-2'>
            <span>Toggle Dark Mode</span>
            <div className='flex items-center gap-1'>
              <Kbd>D</Kbd>
            </div>
          </div>
          <div className='flex items-center justify-between border-b py-2'>
            <span>Create Note</span>
            <div className='flex items-center gap-1'>
              <Kbd>C</Kbd>
            </div>
          </div>
          <div className='flex items-center justify-between border-b py-2'>
            <span>Open Shortcuts Menu</span>
            <div className='flex items-center gap-1'>
              <Kbd>K</Kbd>
            </div>
          </div>
          <div className='flex items-center justify-between border-b py-2'>
            <span>Open Account Dialog</span>
            <div className='flex items-center gap-1'>
              <Kbd>A</Kbd>
            </div>
          </div>
          <div className='flex items-center justify-between border-b py-2'>
            <span>Close Dialogs</span>
            <div className='flex items-center gap-1'>
              <Kbd>ESC</Kbd>
            </div>
          </div>
          <div className='flex items-center justify-between pt-2'>
            <span>A Surprise!</span>
            <div className='flex items-center gap-1'>
              <Kbd>{formatForDisplay('Control+P')}</Kbd>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
