import { SUCCESS } from '@zentro/constants/success'
import { testClient } from 'hono/testing'
import { describe, expect, it } from 'vitest'
import { routes } from '../src/index'

describe('V1 Main Routes', () => {
  const client = testClient(routes).v1

  it('GET / should return welcome message', async () => {
    const res = await client.$get()
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.data).toContain('Welcome to')
    expect(body.error).toBeNull()
  })

  it('GET /health should return ok message', async () => {
    const res = await client.health.$get()
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.data).toBe(SUCCESS.ok.message)
    expect(body.error).toBeNull()
  })
})
