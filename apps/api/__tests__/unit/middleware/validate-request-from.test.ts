import type { AppError } from '@zentro/utils/errors'
import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'
import { ERRORS } from '@/constants/errors'
import { validateRequestFrom } from '@/middleware/validate-request-from'

describe('validateRequestFrom', () => {
  it('allows requests without Sec-Fetch-Dest header', async () => {
    const app = new Hono()
    app.use('*', validateRequestFrom)
    app.get('/', c => c.text('ok'))

    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('ok')
  })

  it('allows requests with allowed Sec-Fetch-Dest header', async () => {
    const app = new Hono()
    app.use('*', validateRequestFrom)
    app.get('/', c => c.text('ok'))

    const req = new Request('http://localhost/', {
      headers: { 'Sec-Fetch-Dest': 'document' },
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('ok')
  })

  it('blocks requests from disallowed Sec-Fetch-Dest (iframe)', async () => {
    const app = new Hono()

    // Custom error handler to catch AppError
    app.onError((err, c) => {
      return c.json({ error: (err as AppError).type }, (err as AppError).statusCode)
    })

    app.use('*', validateRequestFrom)
    app.get('/', c => c.text('ok'))

    const req = new Request('http://localhost/', {
      headers: { 'Sec-Fetch-Dest': 'iframe' },
    })
    const res = await app.request(req)
    expect(res.status).toBe(ERRORS.api.dest.statusCode)
    const json = (await res.json()) as { error: string }
    expect(json.error).toBe(ERRORS.api.dest.type)
  })

  it('blocks requests from disallowed Sec-Fetch-Dest (embed)', async () => {
    const app = new Hono()

    app.onError((err, c) => {
      return c.json({ error: (err as AppError).type }, (err as AppError).statusCode)
    })

    app.use('*', validateRequestFrom)
    app.get('/', c => c.text('ok'))

    const req = new Request('http://localhost/', {
      headers: { 'Sec-Fetch-Dest': 'embed' },
    })
    const res = await app.request(req)
    expect(res.status).toBe(ERRORS.api.dest.statusCode)
  })
})
