import type { ApiResponseSuccess } from '@zentro/constants/api'
import { NOTES, type Note } from '@zentro/constants/notes'
import { SUCCESS } from '@zentro/constants/success'
import { AppError } from '@zentro/utils/errors'
import { and, asc, count, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '@/db/drizzle'
import { notes } from '@/db/schema'
import { csrfValidator } from '@/middleware/csrf'
import {
  validateNoteCreationData,
  validateNoteOrderData,
  validateNoteUpdateData,
} from '@/middleware/fields'
import { requireAuth } from '@/middleware/require-auth'

const app = new Hono()
  .use(requireAuth)

  .get('/', async c => {
    const user = c.get('user')

    const userNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, user.id))
      .orderBy(asc(notes.order))

    return c.json<ApiResponseSuccess<Note[]>>({
      data: userNotes.map(note => ({
        ...note,
        content: note.content ?? undefined,
      })),
      error: null,
    })
  })

  .get('/:id', async c => {
    const user = c.get('user')
    const id = c.req.param('id')

    const [note] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))

    if (!note) {
      throw new AppError(NOTES.errors.notFound.statusCode, {
        type: NOTES.errors.notFound.type,
        message: NOTES.errors.notFound.message,
      })
    }

    return c.json<ApiResponseSuccess<Note>>({
      data: { ...note, content: note.content ?? undefined },
      error: null,
    })
  })

  .post('/', csrfValidator, validateNoteCreationData, async c => {
    const user = c.get('user')
    const input = c.req.valid('json')

    const [currentNotes] = await db
      .select({ count: count(notes.id) })
      .from(notes)
      .where(eq(notes.userId, user.id))

    if (currentNotes && currentNotes.count >= NOTES.limits.maxNotes) {
      throw new AppError(NOTES.errors.maxNotesReached.statusCode, {
        type: NOTES.errors.maxNotesReached.type,
        message: NOTES.errors.maxNotesReached.message,
      })
    }

    const [lastNote] = await db
      .select({ order: notes.order })
      .from(notes)
      .where(eq(notes.userId, user.id))
      .orderBy(desc(notes.order))
      .limit(1)

    const newOrder = lastNote ? lastNote.order + NOTES.orderStep : NOTES.orderStep

    const [note] = await db
      .insert(notes)
      .values({
        ...input,
        userId: user.id,
        order: newOrder,
      })
      .returning()

    if (!note) {
      throw new AppError(NOTES.errors.createFailed.statusCode, {
        type: NOTES.errors.createFailed.type,
        message: NOTES.errors.createFailed.message,
        critical: true,
      })
    }

    return c.json<ApiResponseSuccess<Note>>(
      {
        data: { ...note, content: note.content ?? undefined },
        error: null,
      },
      SUCCESS.created.statusCode
    )
  })

  .patch('/:id', csrfValidator, validateNoteUpdateData, async c => {
    const user = c.get('user')
    const id = c.req.param('id')
    const input = c.req.valid('json')

    const [existing] = await db
      .select({ id: notes.id })
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))

    if (!existing) {
      throw new AppError(NOTES.errors.notFound.statusCode, {
        type: NOTES.errors.notFound.type,
        message: NOTES.errors.notFound.message,
      })
    }

    const [updated] = await db
      .update(notes)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning()

    if (!updated) {
      throw new AppError(NOTES.errors.updateFailed.statusCode, {
        type: NOTES.errors.updateFailed.type,
        message: NOTES.errors.updateFailed.message,
        critical: true,
      })
    }

    return c.json<ApiResponseSuccess<Note>>({
      data: { ...updated, content: updated.content ?? undefined },
      error: null,
    })
  })

  .patch('/:id/order', csrfValidator, validateNoteOrderData, async c => {
    const user = c.get('user')
    const id = c.req.param('id')
    const { toIndex } = c.req.valid('json')

    const allNotes = await db
      .select({ id: notes.id, order: notes.order })
      .from(notes)
      .where(eq(notes.userId, user.id))
      .orderBy(asc(notes.order))

    const movedNote = allNotes.find(n => n.id === id)

    if (!movedNote) {
      throw new AppError(NOTES.errors.notFound.statusCode, {
        type: NOTES.errors.notFound.type,
        message: NOTES.errors.notFound.message,
      })
    }
    // Fractional order indexing

    // Remove the moved note to find its new neighbors
    const otherNotes = allNotes.filter(n => n.id !== id)

    // Since `toIndex` is the exact 0-based index where the item belongs in the final array,
    // we can insert it exactly at `toIndex` inside `otherNotes`.
    const insertAt = toIndex

    const before = otherNotes[insertAt - 1]
    const after = otherNotes[insertAt]

    let newOrder: number

    if (!before && after) {
      // Moving to the first position
      newOrder = after.order / 2
    } else if (before && !after) {
      // Moving to the last position
      newOrder = before.order + NOTES.orderStep
    } else if (before && after) {
      // Moving between two notes — fractional midpoint
      newOrder = (before.order + after.order) / 2
    } else {
      // Single note, nothing to do
      newOrder = movedNote.order
    }

    const [updated] = await db
      .update(notes)
      .set({
        order: newOrder,
        updatedAt: new Date(),
      })
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning()

    if (!updated) {
      throw new AppError(NOTES.errors.updateOrderFailed.statusCode, {
        type: NOTES.errors.updateOrderFailed.type,
        message: NOTES.errors.updateOrderFailed.message,
        critical: true,
      })
    }

    return c.json<ApiResponseSuccess<Note>>({
      data: { ...updated, content: updated.content ?? undefined },
      error: null,
    })
  })

  .delete('/:id', csrfValidator, async c => {
    const user = c.get('user')
    const id = c.req.param('id')

    const [deleted] = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning({ id: notes.id })

    if (!deleted) {
      throw new AppError(NOTES.errors.notFound.statusCode, {
        type: NOTES.errors.notFound.type,
        message: NOTES.errors.notFound.message,
      })
    }

    return c.json<ApiResponseSuccess<{ id: string }>>({
      data: { id },
      error: null,
    })
  })

export default app
