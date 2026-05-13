import type { ApiResponseSuccess } from '@zentro/constants/api'
import { NOTES, type Note } from '@zentro/constants/notes'
import { SUCCESS } from '@zentro/constants/success'
import { AppError } from '@zentro/utils/errors'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '@/db/drizzle'
import { notes } from '@/db/schema'
import { csrfValidator } from '@/middleware/csrf'
import { validateNoteCreationData, validateNoteUpdateData } from '@/middleware/fields'
import { requireAuth } from '@/middleware/require-auth'

const app = new Hono()
  .use(requireAuth)

  .get('/', async c => {
    const user = c.get('user')

    const userNotes = await db.select().from(notes).where(eq(notes.userId, user.id))

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

    const [note] = await db
      .insert(notes)
      .values({
        ...input,
        userId: user.id,
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

    return c.body(null, SUCCESS.noContent.statusCode)
  })

export default app
