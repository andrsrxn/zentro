import { AUTH, type AuthProvider } from '@zentro/constants/auth'
import { toast } from 'sonner'
import { envClient } from '@/lib/config/env-client'
import { authClient } from '@/lib/services/auth-client'

export const signOut = async () => {
  try {
    const res = await authClient.signOut()
    return res
  } catch {
    toast.error(AUTH.errors.failedSignOut.message)
    return {
      data: undefined,
      error: AUTH.errors.failedSignOut,
    }
  }
}

export const deleteAccount = async () => {
  try {
    const res = await authClient.deleteUser({
      callbackURL: '/',
    })
    return res
  } catch {
    toast.error(AUTH.errors.failedDeleteAccount.message)
    return {
      data: undefined,
      error: AUTH.errors.failedDeleteAccount,
    }
  }
}

export const signInWith = async (provider: AuthProvider) => {
  try {
    const res = await authClient.signIn.social({
      provider,
      callbackURL: envClient.NEXT_PUBLIC_BASE_URL,
      errorCallbackURL: envClient.NEXT_PUBLIC_BASE_URL,
    })
    return res
  } catch {
    toast.error(AUTH.errors.failedSignIn.message)
    return {
      data: undefined,
      error: AUTH.errors.failedSignIn,
    }
  }
}

export const signInAnonymous = async () => {
  try {
    const res = await authClient.signIn.anonymous()
    return res
  } catch {
    toast.error(AUTH.errors.failedAnonymousSignIn.message)
    return {
      data: undefined,
      error: AUTH.errors.failedAnonymousSignIn,
    }
  }
}
