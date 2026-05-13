import { headers } from 'next/headers'

// headers that must never be forwarded — they're request-specific
// and will conflict with the new outgoing request
const EXCLUDED_HEADERS = new Set([
  'content-length', // ← main culprit — old body length != new body length
  'content-type', // ← hono client sets this correctly for the new body
  'host', // ← must reflect the API host, not Next.js host
  'connection', // ← hop-by-hop, must not be forwarded
  'transfer-encoding', // ← hop-by-hop
  'keep-alive', // ← hop-by-hop
  'upgrade', // ← hop-by-hop
  'proxy-authorization',
  'te',
])

export const getRequestHeaders = async (): Promise<Record<string, string>> => {
  const headersList = await headers()

  return Object.fromEntries(
    [...headersList.entries()].filter(([key]) => !EXCLUDED_HEADERS.has(key.toLowerCase()))
  )
}
