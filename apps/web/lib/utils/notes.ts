import { NOTES, type NoteBackgroundColor } from '@zentro/constants/notes'

export const getNoteForegroundColor = (color: NoteBackgroundColor) => {
  return Object.entries(NOTES.colors).find(([_, value]) => value.background === color)?.[1]
    .foreground
}
