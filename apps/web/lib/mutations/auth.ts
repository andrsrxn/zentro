import { HTTP_ERRORS } from '@zentro/constants/errors'
import { authClient } from '@/lib/services/auth-client'

export const signOut = async () => {
  try {
    const session = await authClient.signOut()
    return session
  } catch {
    return {
      data: null,
      error: {
        type: HTTP_ERRORS.networkError.type,
        message: HTTP_ERRORS.networkError.message,
        statusCode: HTTP_ERRORS.networkError.statusCode,
      },
    }
  }
}
