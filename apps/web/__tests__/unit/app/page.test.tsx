import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Home from '@/app/page'
import { getSession } from '@/lib/data/auth'

vi.mock('@/lib/data/auth', () => ({
  getSession: vi.fn(),
}))

// Mocking children components to simplify the tree rendering
vi.mock('@/components/auth/sign-in-form', () => ({
  SignInForm: () => <div data-testid='sign-in-form'>SignInForm</div>,
}))

vi.mock('@/components/notes/showcase-notes', () => ({
  ShowcaseNotes: () => <div data-testid='showcase-notes'>ShowcaseNotes</div>,
}))

vi.mock('@/components/notes/notes', () => ({
  Notes: () => <div data-testid='notes'>Notes</div>,
}))

vi.mock('@/components/notes/panel', () => ({
  NotesPanel: ({ children }: { children: ReactNode }) => (
    <div data-testid='notes-panel'>{children}</div>
  ),
}))

vi.mock('@/components/user/account-dropdown', () => ({
  AccountDropdown: () => <div data-testid='account-dropdown'>AccountDropdown</div>,
}))

vi.mock('@/components/shared/panel', () => ({
  Panel: ({ children }: { children: ReactNode }) => (
    <div data-testid='shared-panel'>{children}</div>
  ),
}))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href} data-testid='next-link'>
      {children}
    </a>
  ),
}))

describe('Home Page (app/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Approach 1: Awaiting Home() directly', () => {
    it('returns unauthenticated view when there is no session', async () => {
      vi.mocked(getSession).mockResolvedValue({ data: null, error: null })

      const result = await Home()

      // We can inspect the returned JSX element properties
      expect(result.type).toBeDefined()
      // In a Node environment without rendering, we can assert on the object structure
      // But since we mock Panel, we can just verify it is returned
      expect(result.props.children).toBeDefined()
    })

    it('returns authenticated view when there is a session', async () => {
      vi.mocked(getSession).mockResolvedValue({
        data: {
          user: {
            name: 'Test User',
            createdAt: new Date(),
            id: 'test-user-id',
            email: 'test-user@example.com',
            emailVerified: true,
            updatedAt: new Date(),
            isAnonymous: false,
            timeZone: 'UTC',
            countryCode: 'US',
          },
          session: {
            token: 'test-token',
            createdAt: new Date(),
            id: 'test-session-id',
            updatedAt: new Date(),
            userId: 'test-user-id',
            expiresAt: new Date(),
          },
        },
        error: null,
      })

      const result = await Home()

      expect(result.type).toBe('section')
      expect(result.props.className).toContain('min-h-dvh')
    })
  })

  describe('Approach 2: Rendering the RSC tree (awaited)', () => {
    it('renders unauthenticated view properly', async () => {
      vi.mocked(getSession).mockResolvedValue({ data: null, error: null })

      // Render the awaited async component
      render(await Home())

      expect(screen.getByTestId('shared-panel')).toBeInTheDocument()
      expect(screen.getByTestId('sign-in-form')).toBeInTheDocument()
      expect(screen.getByTestId('showcase-notes')).toBeInTheDocument()
      expect(screen.queryByTestId('notes-panel')).not.toBeInTheDocument()
    })

    it('renders authenticated view properly', async () => {
      vi.mocked(getSession).mockResolvedValue({
        data: {
          user: {
            name: 'Test User',
            createdAt: new Date(),
            id: 'test-user-id',
            email: 'test-user@example.com',
            emailVerified: true,
            updatedAt: new Date(),
            isAnonymous: false,
            timeZone: 'UTC',
            countryCode: 'US',
          },
          session: {
            token: 'test-token',
            createdAt: new Date(),
            id: 'test-session-id',
            updatedAt: new Date(),
            userId: 'test-user-id',
            expiresAt: new Date(),
          },
        },
        error: null,
      })

      render(await Home())

      expect(screen.getByTestId('notes-panel')).toBeInTheDocument()
      expect(screen.getByTestId('notes')).toBeInTheDocument()
      expect(screen.getByTestId('account-dropdown')).toBeInTheDocument()
      expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument()
    })
  })
})
