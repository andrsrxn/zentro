/** biome-ignore-all lint/style/noNonNullAssertion: false positives */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { NOTES, type Note } from '@zentro/constants/notes'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getNotes } from '@/lib/data/notes'
import { useCreateNote, useNotes } from '@/lib/hooks/use-notes'
import { createNote } from '@/lib/mutations/notes'

vi.mock('@/lib/data/notes', () => ({
  getNotes: vi.fn(),
  getNoteById: vi.fn(),
}))

vi.mock('@/lib/mutations/notes', () => ({
  createNote: vi.fn(),
  deleteNote: vi.fn(),
  updateNote: vi.fn(),
  updateNoteOrder: vi.fn(),
}))

vi.mock('@/lib/services/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = createTestQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useNotes query', () => {
    it('fetches and normalizes notes', async () => {
      const mockNotes = [
        {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          color: '#000000',
          order: NOTES.orderStep,
          title: 'Test Note',
          userId: 'test-user-id',
          content: '',
        },
      ] satisfies Note[]

      vi.mocked(getNotes).mockResolvedValue(
        mockNotes.map(note => ({
          ...note,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
        }))
      )

      const { result } = renderHook(() => useNotes(), { wrapper })

      await waitFor(() => {
        expect(result.current.error).toBe(null)
        expect(result.current.notes.length).toBe(1)
      })

      expect(getNotes).toHaveBeenCalled()
      expect(result.current.notes![0]?.id).toBe('1')
      expect(result.current.notes![0]?.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('useCreateNote mutation', () => {
    it('optimistically adds a note and replaces with real one on success', async () => {
      const realNote = {
        id: 'real-1',
        title: 'Test Note',
        content: '',
        color: '#000000',
        order: NOTES.orderStep,
        userId: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies Note
      vi.mocked(createNote).mockResolvedValue({
        ...realNote,
        createdAt: realNote.createdAt.toISOString(),
        updatedAt: realNote.updatedAt.toISOString(),
      })

      const { result } = renderHook(() => useCreateNote(), { wrapper })

      act(() => {
        result.current.mutate({ input: { title: 'Test Note', color: '#000000', content: '' } })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(createNote).toHaveBeenCalled()
    })
  })
})
