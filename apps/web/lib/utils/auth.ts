import type { AuthProvider } from '@zentro/constants/auth'
import { envClient } from '@/lib/config/env-client'
import { authClient } from '@/lib/services/auth-client'

export const signInWith = async (provider: AuthProvider) => {
  await authClient.signIn.social({
    provider,
    callbackURL: envClient.NEXT_PUBLIC_BASE_URL,
    errorCallbackURL: envClient.NEXT_PUBLIC_BASE_URL,
  })
}
