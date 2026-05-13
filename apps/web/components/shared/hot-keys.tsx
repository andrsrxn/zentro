'use client'

import { useHotkey } from '@tanstack/react-hotkeys'
import { useTheme } from 'next-themes'
import { useNotesStore } from '@/lib/store/notes'

export const HotKeys = () => {
  const setOpenCreateForm = useNotesStore(state => state.setOpenCreateForm)
  const { resolvedTheme, setTheme } = useTheme()

  useHotkey('C', () => {
    setOpenCreateForm(true)
  })

  useHotkey('D', () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  })

  return null
}
