import { AppError } from '@zentro/utils/errors'
import { createMiddleware } from 'hono/factory'
import { ERRORS } from '@/constants/errors'
import { auth } from '@/utils/auth'

export interface RequireAuthVariables {
  user: typeof auth.$Infer.Session.user
  session: typeof auth.$Infer.Session.session
}

// biome-ignore lint/style/useNamingConvention: Hono convention
export const requireAuth = createMiddleware<{ Variables: RequireAuthVariables }>(
  async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session) {
      throw new AppError(ERRORS.api.requireAuth.statusCode, {
        message: ERRORS.api.requireAuth.message,
        type: ERRORS.api.requireAuth.type,
      })
    }

    c.set('user', session.user)
    c.set('session', session.session)

    await next()
  }
)
