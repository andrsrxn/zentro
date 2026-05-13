import { HTTP_ERRORS } from '@zentro/constants/errors'

export const ERRORS = {
  api: {
    requireAuth: {
      ...HTTP_ERRORS.unauthorized,
      message: 'You must be authenticated to access this resource',
    },
    cors: {
      ...HTTP_ERRORS.forbidden,
      message: 'Request origin not allowed',
    },
    csrfToken: {
      ...HTTP_ERRORS.forbidden,
      message: 'CSRF token missing or invalid',
    },
    csrfOrigin: {
      ...HTTP_ERRORS.forbidden,
      message: 'CSRF origin not allowed',
    },
    bodyLimit: {
      ...HTTP_ERRORS.payloadTooLarge,
      message: 'Request body too large',
    },
    dest: {
      ...HTTP_ERRORS.forbidden,
      message: 'Direct browser navigation not allowed',
    },
    origin: {
      ...HTTP_ERRORS.forbidden,
      message: 'Request origin not allowed',
    },
    timeout: {
      ...HTTP_ERRORS.requestTimeout,
      message: 'Operation timed out. Please try again later.',
    },
  },
  geolocation: {
    unknownIp: {
      ...HTTP_ERRORS.badRequest,
      message: 'Unknown IP address',
    },
    internalError: {
      ...HTTP_ERRORS.internalError,
      message: 'Error getting geolocation data',
    },
  },
} as const
