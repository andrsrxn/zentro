import { timingSafeEqual as nodeSafeEqual } from 'node:crypto'

export const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false
  }
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  return nodeSafeEqual(bufA, bufB)
}
