/** biome-ignore-all lint/suspicious/noNonNullAssertedOptionalChain: false positive */
/** biome-ignore-all lint/style/noNonNullAssertion: false positive */

import type { ApiResponse } from '@zentro/constants/api'
import { NOTES, type Note } from '@zentro/constants/notes'
import type { AppError } from '@zentro/utils/errors'
import { eq, type InferSelectModel } from 'drizzle-orm'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/db/drizzle'
import { notes as notesTable, users } from '@/db/schema'
import app from '@/routes/v1/notes'
import { auth } from '@/utils/auth'

vi.mock('@/utils/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

vi.mock('@/utils/csrf', async importOriginal => {
  const actual = await importOriginal<typeof import('@/utils/csrf')>()
  return {
    ...actual,
    validateCsrfToken: vi.fn().mockReturnValue(true), // Bypass CSRF for tests
  }
})

describe('Notes Routes', () => {
  let testUser: InferSelectModel<typeof users>

  beforeAll(async () => {
    // We expect the database to be clean or we just insert a new user for tests
    const [user] = await db
      .insert(users)
      .values({
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
      })
      .returning()
    testUser = user!
  })

  // biome-ignore lint/suspicious/useAwait: API convention
  beforeEach(async () => {
    vi.clearAllMocks()
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: testUser,
      session: {
        id: 'test-session',
        userId: testUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: '192.168.1.1',
        userAgent: 'test-user-agent',
        expiresAt: new Date(Date.now() + 100_000),
        token: 'token',
      },
    })
  })

  afterEach(async () => {
    // Clean up notes for this user after each test
    await db.delete(notesTable).where(eq(notesTable.userId, testUser.id))
  })

  describe('GET /', () => {
    it('returns empty array if user has no notes', async () => {
      const res = await app.request('/')
      expect(res.status).toBe(200)
      const json = (await res.json()) as ApiResponse<Note[]>
      expect(json.data).toEqual([])
    })

    it('returns user notes ordered by order ascending', async () => {
      await db.insert(notesTable).values([
        { title: 'Note 2', userId: testUser.id, order: 2000 },
        { title: 'Note 1', userId: testUser.id, order: 1000 },
      ])

      const res = await app.request('/')
      const json = (await res.json()) as ApiResponse<Note[]>
      expect(json.data).toHaveLength(2)
      expect(json.data?.[0]?.title).toBe('Note 1')
      expect(json.data?.[1]?.title).toBe('Note 2')
    })
  })

  describe('GET /:id', () => {
    it('returns a specific note', async () => {
      const [note] = await db
        .insert(notesTable)
        .values({
          title: 'Specific Note',
          userId: testUser.id,
          order: 1000,
        })
        .returning()

      const res = await app.request(`/${note?.id}`)
      expect(res.status).toBe(200)
      const json = (await res.json()) as ApiResponse<Note>
      expect(json.data?.id).toBe(note?.id)
      expect(json.data?.title).toBe('Specific Note')
    })

    it('returns 404 if note does not exist', async () => {
      // Mock the error handler to catch the thrown AppError
      app.onError((err, c) => {
        return c.json({ type: (err as AppError).type }, (err as AppError).statusCode)
      })

      const res = await app.request('/invalid-id')
      expect(res.status).toBe(NOTES.errors.notFound.statusCode)
    })
  })

  describe('POST /', () => {
    it('creates a new note', async () => {
      const req = new Request('http://localhost/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Note' }),
      })

      const res = await app.request(req)
      expect(res.status).toBe(201)
      const json = (await res.json()) as ApiResponse<Note>
      expect(json.data?.title).toBe('New Note')
      expect(json.data?.order).toBe(NOTES.orderStep) // First note gets orderStep
    })

    it('enforces max notes limit', async () => {
      // Insert max notes
      const notesToInsert = Array.from({ length: NOTES.limits.maxNotes }).map((_, i) => ({
        title: `Note ${i}`,
        userId: testUser.id,
        order: (i + 1) * NOTES.orderStep,
      }))

      // Batch insert is limited by parameters, so we chunk it or just lower the limit for testing.
      // Assuming maxNotes is small or we can bypass it by mocking count, but let's just insert them.
      // If maxNotes is e.g. 50, it should be fine.
      await db.insert(notesTable).values(notesToInsert)

      app.onError((err, c) => {
        return c.json({ type: (err as AppError).type }, (err as AppError).statusCode)
      })

      const req = new Request('http://localhost/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'One too many' }),
      })

      const res = await app.request(req)
      expect(res.status).toBe(NOTES.errors.maxNotesReached.statusCode)
    })
  })

  describe('PATCH /:id', () => {
    it('updates an existing note', async () => {
      const [note] = await db
        .insert(notesTable)
        .values({
          title: 'Old Title',
          userId: testUser.id,
          order: 1000,
        })
        .returning()

      const req = new Request(`http://localhost/${note?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Title' }),
      })

      const res = await app.request(req)
      expect(res.status).toBe(200)
      const json = (await res.json()) as ApiResponse<Note>
      expect(json.data?.title).toBe('New Title')
    })
  })

  describe('PATCH /:id/order', () => {
    it('updates the order of a note correctly between two notes', async () => {
      // Insert 3 notes
      const [_note1, _note2, note3] = await db
        .insert(notesTable)
        .values([
          { title: 'Note 1', userId: testUser.id, order: 1000 },
          { title: 'Note 2', userId: testUser.id, order: 2000 },
          { title: 'Note 3', userId: testUser.id, order: 3000 },
        ])
        .returning()

      // Move note3 to position 1 (between note1 and note2)
      // Array currently: note1 (pos 0), note2 (pos 1), note3 (pos 2)
      // Moving to toIndex = 1
      const req = new Request(`http://localhost/${note3?.id}/order`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toIndex: 1 }),
      })

      const res = await app.request(req)
      expect(res.status).toBe(200)
      const json = (await res.json()) as ApiResponse<Note>

      // Expected new order: (1000 + 2000) / 2 = 1500
      expect(json.data?.order).toBe(1500)
    })
  })

  describe('DELETE /:id', () => {
    it('deletes an existing note', async () => {
      const [note] = await db
        .insert(notesTable)
        .values({
          title: 'To Delete',
          userId: testUser.id,
          order: 1000,
        })
        .returning()

      const req = new Request(`http://localhost/${note?.id}`, {
        method: 'DELETE',
      })

      const res = await app.request(req)
      expect(res.status).toBe(200)

      // Verify deletion
      const remaining = await db.select().from(notesTable).where(eq(notesTable.id, note?.id!))
      expect(remaining).toHaveLength(0)
    })
  })
})
