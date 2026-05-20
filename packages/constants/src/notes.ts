import { HTTP_ERRORS } from './errors'
import { SUCCESS } from './success'

export const NOTES = {
  cacheTime: {
    minutes: 5,
  },
  orderStep: 1000,
  tags: {
    all: () => ['notes'],
    single: (id: string) => ['notes', `note-${id}`],
  },
  defaultNoteColor: {
    background: '#FFD700',
    foreground: '#3D2E00',
  },
  limits: {
    maxNotes: 30,
  },
  colors: {
    yellow: { background: '#FFD700', foreground: '#3D2E00' },
    blue: { background: '#ADD8E6', foreground: '#0D2B3E' },
    green: { background: '#90EE90', foreground: '#1A3D1A' },
    pink: { background: '#FFB6C1', foreground: '#3D0A14' },
    purple: { background: '#E6E6FA', foreground: '#1E0A4A' },
    orange: { background: '#FFDAB9', foreground: '#3D1A00' },
    white: { background: '#FFFFFF', foreground: '#1A1A1A' },
    black: { background: '#000000', foreground: '#F0F0F0' },
  },
  success: {
    created: {
      ...SUCCESS.created,
      message: 'Note created successfully',
    },
    updated: {
      ...SUCCESS.ok,
      message: 'Note updated successfully',
    },
    deleted: {
      ...SUCCESS.noContent,
      message: 'Note deleted successfully',
    },
  },
  errors: {
    notFound: {
      ...HTTP_ERRORS.notFound,
      message: 'Note not found',
    },
    maxNotesReached: {
      ...HTTP_ERRORS.badRequest,
      message: 'Maximum number of notes reached',
    },
    default: {
      ...HTTP_ERRORS.internalError,
      message: 'Could not load notes',
    },
    getAllFailed: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to get notes',
    },
    getByIdFailed: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to get note',
    },
    invalidFields: {
      ...HTTP_ERRORS.badRequest,
      message: 'One or more fields are invalid',
    },

    createFailed: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to create note',
    },

    updateFailed: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to update note',
    },
    invalidOrder: {
      ...HTTP_ERRORS.badRequest,
      message: 'Invalid note order',
    },
    updateOrderFailed: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to update note order',
    },

    deleteFailed: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to delete note',
    },
  },
} as const

export const noteBackgroundColors = Object.values(NOTES.colors).map(color => color.background)
export const noteForegroundColors = Object.values(NOTES.colors).map(color => color.foreground)

export type NoteBackgroundColor = (typeof noteBackgroundColors)[number]
export type NoteForegroundColor = (typeof noteForegroundColors)[number]

export interface Note {
  id: string
  title: string
  content?: string
  color: NoteBackgroundColor
  positionX: number
  positionY: number
  order: number
  userId: string
  createdAt: Date
  updatedAt: Date
}
