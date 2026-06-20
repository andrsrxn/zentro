import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDeleteAccount, useDeleteAnonymousAccount, useSignOut } from '@/lib/hooks/use-auth'
import { deleteAccount, signOut } from '@/lib/mutations/auth'
import { authClient } from '@/lib/services/auth-client'
import { deleteCsrfToken } from '@/lib/utils/csrf'

vi.mock('@/lib/mutations/auth', () => ({
  signOut: vi.fn(),
  deleteAccount: vi.fn(),
}))

vi.mock('@/lib/services/auth-client', () => ({
  authClient: {
    clearLastUsedLoginMethod: vi.fn(),
    deleteAnonymousUser: vi.fn(),
  },
}))

vi.mock('@/lib/utils/csrf', () => ({
  deleteCsrfToken: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = createTestQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('Auth Hooks', () => {
  const mockRefresh = vi.fn()
  const mockBack = vi.fn()
  const mockForward = vi.fn()
  const mockPush = vi.fn()
  const mockReplace = vi.fn()
  const mockPrefetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      refresh: mockRefresh,
      back: mockBack,
      forward: mockForward,
      push: mockPush,
      replace: mockReplace,
      prefetch: mockPrefetch,
    })
  })

  describe('useSignOut', () => {
    it('signs out successfully, clears cache, deletes CSRF, and refreshes', async () => {
      vi.mocked(signOut).mockResolvedValue({ data: { success: true }, error: null })

      const { result } = renderHook(() => useSignOut(), { wrapper })

      await act(async () => {
        await result.current.signOut()
      })

      expect(signOut).toHaveBeenCalled()
      expect(deleteCsrfToken).toHaveBeenCalled()
      expect(mockRefresh).toHaveBeenCalled()
    })

    it('shows toast error when sign out fails', async () => {
      vi.mocked(signOut).mockRejectedValue(new Error('Failed'))

      const { result } = renderHook(() => useSignOut(), { wrapper })

      await act(async () => {
        await result.current.signOut()
      })

      expect(toast.error).toHaveBeenCalled()
      expect(deleteCsrfToken).not.toHaveBeenCalled()
      expect(mockRefresh).not.toHaveBeenCalled()
    })
  })

  describe('useDeleteAccount', () => {
    it('deletes account successfully', async () => {
      vi.mocked(deleteAccount).mockResolvedValue({
        data: { message: 'Account deleted', success: true },
        error: null,
      })

      const { result } = renderHook(() => useDeleteAccount(), { wrapper })

      await act(async () => {
        await result.current.deleteAccount()
      })

      expect(deleteAccount).toHaveBeenCalled()
      expect(authClient.clearLastUsedLoginMethod).toHaveBeenCalled()
      expect(deleteCsrfToken).toHaveBeenCalled()
      expect(mockRefresh).toHaveBeenCalled()
    })

    it('shows toast error if session expired', async () => {
      vi.mocked(deleteAccount).mockResolvedValue({
        error: { code: 'SESSION_EXPIRED', status: 401, statusText: '' },
        data: null,
      })

      const { result } = renderHook(() => useDeleteAccount(), { wrapper })

      await act(async () => {
        await result.current.deleteAccount()
      })

      expect(toast.error).toHaveBeenCalledWith(
        'Session expired, please log in again to delete your account'
      )
      expect(deleteCsrfToken).not.toHaveBeenCalled()
    })
  })

  describe('useDeleteAnonymousAccount', () => {
    it('deletes anonymous account successfully', async () => {
      vi.mocked(authClient.deleteAnonymousUser).mockResolvedValue({ data: {} })

      const { result } = renderHook(() => useDeleteAnonymousAccount(), { wrapper })

      await act(async () => {
        await result.current.deleteAnonymousAccount()
      })

      expect(authClient.deleteAnonymousUser).toHaveBeenCalled()
      expect(deleteCsrfToken).toHaveBeenCalled()
      expect(mockRefresh).toHaveBeenCalled()
    })
  })
})
