import type { ApiResponseSuccess } from '@zentro/constants/api'
import { SUCCESS } from '@zentro/constants/success'
import { Hono } from 'hono'
import { API } from '@/constants/api'
import auth from '@/routes/v1/auth'
import csrf from '@/routes/v1/csrf'
import notes from '@/routes/v1/notes'

const app = new Hono()
  .get('/', c =>
    c.json<ApiResponseSuccess<string>>({
      data: `Welcome to ${API.name}! Check the API Documentation V1 for more information.`,
      error: null,
    })
  )
  .get('/health', c =>
    c.json<ApiResponseSuccess<string>>({
      data: SUCCESS.ok.message,
      error: null,
    })
  )
  .route('/auth', auth)
  .route('/notes', notes)
  .route('/csrf', csrf)

export default app
