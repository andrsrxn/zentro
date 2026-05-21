'use client'

import { useHotkey } from '@tanstack/react-hotkeys'
import { useTheme } from '@teispace/next-themes'
import { COMPANY } from '@zentro/constants/company'
import confetti from 'canvas-confetti'
import { useNotesStore } from '@/lib/store/notes'
import { useSharedStore } from '@/lib/store/shared'
import { useUserStore } from '@/lib/store/user'

export const HotKeys = () => {
  const setOpenCreateForm = useNotesStore(state => state.setOpenCreateForm)
  const setShortcutsDialogOpen = useSharedStore(state => state.setShortcutsDialogOpen)
  const setAccountDialogOpen = useUserStore(state => state.setAccountDialogOpen)

  const { resolvedTheme, setTheme } = useTheme()

  useHotkey('C', () => {
    setShortcutsDialogOpen(false)
    setAccountDialogOpen(false)

    setOpenCreateForm(true)
  })

  useHotkey('K', () => {
    setOpenCreateForm(false)
    setAccountDialogOpen(false)

    setShortcutsDialogOpen(true)
  })

  useHotkey('A', () => {
    setOpenCreateForm(false)
    setShortcutsDialogOpen(false)

    setAccountDialogOpen(true)
  })

  useHotkey('D', () => {
    console.log({ resolvedTheme })

    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  })

  const confettiOptions: confetti.Options = {
    colors: [COMPANY.brand.primaryColor, COMPANY.brand.backgroundColor],
    startVelocity: 20,
    particleCount: 100,
    spread: 200,
  }

  useHotkey('Control+P', () => {
    confetti({
      ...confettiOptions,
      angle: 120,
      origin: { y: 0.8, x: 0.95 },
    })
    confetti({
      ...confettiOptions,
      angle: 60,
      origin: { y: 0.8, x: 0.05 },
    })
  })

  return null
}
