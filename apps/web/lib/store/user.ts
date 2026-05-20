import { create } from 'zustand'

interface UserStore {
  accountDialogOpen: boolean
  setAccountDialogOpen: (open: boolean) => void
}

export const useUserStore = create<UserStore>()(set => ({
  accountDialogOpen: false,
  setAccountDialogOpen: open => set(() => ({ accountDialogOpen: open })),
}))
