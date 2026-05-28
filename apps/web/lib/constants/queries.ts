/** biome-ignore-all lint/style/noMagicNumbers: miliseconds calculation */
import { NOTES } from '@zentro/constants/notes'

export const QUERIES = {
  staleTime: 1000 * 60 * NOTES.cacheTime.minutes,
  gcTime: 1000 * 60 * NOTES.cacheTime.minutes,
  maxRetries: 3,
} as const
