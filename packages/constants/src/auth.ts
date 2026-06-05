import { HTTP_ERRORS } from './errors'

export const AUTH = {
  cacheTime: {
    minutes: 5,
  },
  tags: {
    session: ['auth', 'session'],
  },
  providers: {
    google: 'google',
    github: 'github',
    anonymous: 'anonymous',
  },
  errors: {
    failedSignIn: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to sign in',
    },
    failedSignOut: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to sign out',
    },
    failedAnonymousSignIn: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to sign in as Guest',
    },
    failedDeleteAccount: {
      ...HTTP_ERRORS.internalError,
      message: 'Failed to delete account',
    },
  },
} as const

export type AuthProvider = (typeof AUTH.providers)[keyof typeof AUTH.providers]
