import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { envClient } from '@/lib/config/env-client'

export const authClient = createAuthClient({
  baseURL: `${envClient.NEXT_PUBLIC_API_URL}/v1/auth`,
  plugins: [
    inferAdditionalFields({
      user: {
        countryCode: {
          type: 'string',
        },
        timeZone: {
          type: 'string',
        },
      },
    }),
  ],
})
