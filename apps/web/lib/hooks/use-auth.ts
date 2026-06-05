import { useQueryClient } from '@tanstack/react-query'
import { AUTH } from '@zentro/constants/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteAccount, signOut } from '@/lib/mutations/auth'
import { authClient } from '@/lib/services/auth-client'
import { deleteCsrfToken } from '@/lib/utils/csrf'

export const useSignOut = () => {
  const qc = useQueryClient()
  const { refresh } = useRouter()

  const handleSignOut = async () => {
    try {
      const res = await signOut()
      if (res.data?.success) {
        qc.removeQueries()
        deleteCsrfToken()
        refresh()
      }
      return res
    } catch {
      toast.error(AUTH.errors.failedSignOut.message)
    }
  }

  return { signOut: handleSignOut }
}

export const useDeleteAccount = () => {
  const qc = useQueryClient()
  const { refresh } = useRouter()

  const handleDeleteAccount = async () => {
    const res = await deleteAccount()

    if (res.error && 'code' in res.error) {
      if (res.error.code === 'SESSION_EXPIRED') {
        toast.error('Session expired, please log in again to delete your account')
      } else {
        toast.error('Could not delete account, try again later')
      }

      return res
    }

    if (res.data?.success) {
      qc.removeQueries()
      authClient.clearLastUsedLoginMethod()
      deleteCsrfToken()
      refresh()
    }
    return res
  }

  return { deleteAccount: handleDeleteAccount }
}

export const useDeleteAnonymousAccount = () => {
  const qc = useQueryClient()
  const { refresh } = useRouter()

  const handleDeleteAnonymousAccount = async () => {
    const res = await authClient.deleteAnonymousUser()
    if (res.error) {
      toast.error(AUTH.errors.failedDeleteAccount.message)
      return res
    }

    qc.removeQueries()
    deleteCsrfToken()
    refresh()
    return res
  }

  return { deleteAnonymousAccount: handleDeleteAnonymousAccount }
}
