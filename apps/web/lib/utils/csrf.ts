import { COOKIES } from '@zentro/constants/cookies'
import { apiClient } from '@/lib/services/api-client'

const CSRF_COOKIE = COOKIES.csrf.name

export const getCsrfToken = (): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]+)`, 'u'))
  return match?.[1] ?? null
}

export const deleteCsrfToken = () => {
  // biome-ignore lint/suspicious/noDocumentCookie: client cookie deletion
  document.cookie = `${CSRF_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

export const ensureCsrfToken = async () => {
  if (getCsrfToken()) {
    return
  }

  try {
    await apiClient.csrf.$get()
  } catch {}
}
