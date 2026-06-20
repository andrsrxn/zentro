import type { AppError } from '@zentro/utils/errors'
import { Hono } from 'hono'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ERRORS } from '@/constants/errors'
import { requireAuth } from '@/middleware/require-auth'
import { auth } from '@/utils/auth'

vi.mock('@/utils/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws AppError if no session is found', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const app = new Hono()
    app.onError((err, c) => {
      return c.json({ type: (err as AppError).type }, (err as AppError).statusCode)
    })
    app.use('*', requireAuth)
    app.get('/', c => c.text('ok'))

    const res = await app.request('/')
    expect(res.status).toBe(ERRORS.api.requireAuth.statusCode)
    const json = (await res.json()) as { type: string }
    expect(json.type).toBe(ERRORS.api.requireAuth.type)
  })

  it('sets user and session in context if session exists', async () => {
    const mockSession = {
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: 'session-1',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(),
        token: 'token',
      },
    }
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession)

    let contextUser: typeof mockSession.user | undefined
    let contextSession: typeof mockSession.session | undefined

    const app = new Hono()

    app.get('/', requireAuth, c => {
      contextUser = c.get('user')
      contextSession = c.get('session')
      return c.text('ok')
    })

    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(contextUser).toEqual(mockSession.user)
    expect(contextSession).toEqual(mockSession.session)
  })
})
