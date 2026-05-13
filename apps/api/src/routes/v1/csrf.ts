import { SUCCESS } from '@zentro/constants/success'
import { Hono } from 'hono'
import { csrfIssuer } from '@/middleware/csrf'

const app = new Hono().get('/', csrfIssuer, c => {
  return c.text(SUCCESS.ok.message, SUCCESS.ok.statusCode)
})

export default app
