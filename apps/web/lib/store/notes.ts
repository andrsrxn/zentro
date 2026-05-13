import { create } from 'zustand'

interface NotesStore {
  openCreateForm: boolean
  setOpenCreateForm: (open: boolean) => void
}

export const useNotesStore = create<NotesStore>()(set => ({
  openCreateForm: false,
  setOpenCreateForm: open => set(() => ({ openCreateForm: open })),
}))
