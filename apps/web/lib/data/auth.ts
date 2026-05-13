import { AUTH } from '@zentro/constants/auth'
import { HTTP_ERRORS } from '@zentro/constants/errors'
import { headers } from 'next/headers'
import { cache } from 'react'
import { authClient } from '@/lib/services/auth-client'

export const getSession = cache(async () => {
  try {
    const session = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
        next: {
          tags: [...AUTH.tags.session],
          revalidate: AUTH.cacheTime.minutes * 60,
        },
      },
    })
    return session
  } catch (error) {
    console.error(error)
    return {
      data: null,
      error: {
        type: HTTP_ERRORS.networkError.type,
        message: HTTP_ERRORS.networkError.message,
        statusCode: HTTP_ERRORS.networkError.statusCode,
      },
    }
  }
})
