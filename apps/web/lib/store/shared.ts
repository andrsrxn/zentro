import { create } from 'zustand'

interface SharedStore {
  shortcutsDialogOpen: boolean
  setShortcutsDialogOpen: (open: boolean) => void
}

export const useSharedStore = create<SharedStore>()(set => ({
  shortcutsDialogOpen: false,
  setShortcutsDialogOpen: open => set(() => ({ shortcutsDialogOpen: open })),
}))
