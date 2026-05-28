import type { AuthProvider } from '@zentro/constants/auth'
import { HTTP_ERRORS } from '@zentro/constants/errors'
import { toast } from 'sonner'
import { envClient } from '@/lib/config/env-client'
import { authClient } from '@/lib/services/auth-client'

export const signInWith = async (provider: AuthProvider) => {
  try {
    await authClient.signIn.social({
      provider,
      callbackURL: envClient.NEXT_PUBLIC_BASE_URL,
      errorCallbackURL: envClient.NEXT_PUBLIC_BASE_URL,
    })
  } catch {
    toast.error(HTTP_ERRORS.internalError.message)
  }
}
