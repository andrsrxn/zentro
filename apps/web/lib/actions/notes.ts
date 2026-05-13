// lib/actions/notes.ts
'use server'

import type { ApiResponse } from '@zentro/constants/api'
import { COOKIES } from '@zentro/constants/cookies'
import { HTTP_ERRORS } from '@zentro/constants/errors'
import { HEADERS } from '@zentro/constants/headers'
import { NOTES, type Note } from '@zentro/constants/notes'
import { type CreateNoteInput, createNoteSchema, updateNoteSchema } from '@zentro/schemas/notes'
import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { getSession } from '@/lib/data/auth'
import { apiClient } from '@/lib/services/api-client'
import { getRequestHeaders } from '@/lib/utils/headers'

export const createNote = async (input: CreateNoteInput): Promise<ApiResponse<Note>> => {
  const session = await getSession()
  if (!session.data) {
    return {
      data: null,
      error: {
        statusCode: HTTP_ERRORS.unauthorized.statusCode,
        type: HTTP_ERRORS.unauthorized.type,
        message: HTTP_ERRORS.unauthorized.message,
      },
    }
  }
  const data = createNoteSchema.safeParse(input)
  if (!data.success) {
    return {
      data: null,
      error: {
        statusCode: NOTES.errors.invalidFields.statusCode,
        type: NOTES.errors.invalidFields.type,
        message: NOTES.errors.invalidFields.message,
        errors: data.error.issues.map(issue => ({
          field: issue.path[0]?.toString() ?? '',
          message: issue.message,
        })),
      },
    }
  }
  const userId = session.data.user.id

  try {
    const cookieStore = await cookies()
    const csrfToken = cookieStore.get(COOKIES.csrf.name)?.value

    const res = await apiClient.notes.$post(
      { json: data.data },
      {
        headers: { ...(await getRequestHeaders()), [HEADERS.csrf]: csrfToken ?? '' },
      }
    )
    const note = await res.json()

    if (note.error) {
      return {
        data: null,
        error: note.error,
      }
    }

    revalidateTag(`notes-${userId}`, 'max')

    return {
      data: {
        ...note.data,
        updatedAt: new Date(note.data.updatedAt),
        createdAt: new Date(note.data.createdAt),
      },
      error: null,
    }
  } catch (error) {
    console.error('Error creating note: ', error)
    return {
      data: null,
      error: {
        statusCode: NOTES.errors.createFailed.statusCode,
        type: NOTES.errors.createFailed.type,
        message: NOTES.errors.createFailed.message,
      },
    }
  }
}

export const updateNote = async (
  userId: string,
  id: string,
  input: Partial<CreateNoteInput>
): Promise<ApiResponse<Note>> => {
  const data = updateNoteSchema.safeParse(input)

  if (!data.success) {
    return {
      data: null,
      error: {
        statusCode: NOTES.errors.invalidFields.statusCode,
        type: NOTES.errors.invalidFields.type,
        message: NOTES.errors.invalidFields.message,
        errors: data.error.issues.map(issue => ({
          field: issue.path[0]?.toString() ?? '',
          message: issue.message,
        })),
      },
    }
  }

  try {
    const res = await apiClient.notes[':id'].$patch(
      { param: { id }, json: data.data },
      { headers: Object.fromEntries(await headers()) }
    )
    const note = await res.json()

    if (note.error) {
      return {
        data: null,
        error: note.error,
      }
    }

    revalidateTag(`note-${id}`, 'max')
    revalidateTag(`notes-${userId}`, 'max')
    revalidatePath('/')

    return {
      data: {
        ...note.data,
        updatedAt: new Date(note.data.updatedAt),
        createdAt: new Date(note.data.createdAt),
      },
      error: null,
    }
  } catch (error) {
    console.error('Error updating note: ', error)
    return {
      data: null,
      error: {
        statusCode: NOTES.errors.updateFailed.statusCode,
        type: NOTES.errors.updateFailed.type,
        message: NOTES.errors.updateFailed.message,
      },
    }
  }
}

export const deleteNote = async (userId: string, id: string): Promise<ApiResponse<undefined>> => {
  try {
    const res = await apiClient.notes[':id'].$delete(
      { param: { id } },
      { headers: Object.fromEntries(await headers()) }
    )

    if (!res.ok) {
      return {
        data: null,
        error: {
          statusCode: NOTES.errors.deleteFailed.statusCode,
          type: NOTES.errors.deleteFailed.type,
          message: NOTES.errors.deleteFailed.message,
        },
      }
    }

    revalidateTag(`notes-${userId}`, 'max')

    return {
      data: undefined,
      error: null,
    }
  } catch (error) {
    console.error('Error deleting note: ', error)
    return {
      data: null,
      error: {
        statusCode: NOTES.errors.deleteFailed.statusCode,
        type: NOTES.errors.deleteFailed.type,
        message: NOTES.errors.deleteFailed.message,
      },
    }
  }
}
