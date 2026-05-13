import type { ContentfulStatusCode } from './api'

export const HTTP_ERRORS = {
  unknown: {
    statusCode: 500,
    type: 'UNKNOWN',
    message: 'Unknown error',
  },
  networkError: {
    statusCode: 500,
    type: 'NETWORK_ERROR',
    message: 'Network error',
  },
  notFound: {
    statusCode: 404,
    type: 'NOT_FOUND',
    message: 'Resource not found',
  },
  payloadTooLarge: {
    statusCode: 413,
    type: 'PAYLOAD_TOO_LARGE',
    message: 'Payload too large',
  },
  unauthorized: {
    statusCode: 401,
    type: 'UNAUTHORIZED',
    message: 'Unauthorized',
  },
  forbidden: {
    statusCode: 403,
    type: 'FORBIDDEN',
    message: 'Forbidden',
  },
  badRequest: {
    statusCode: 400,
    type: 'BAD_REQUEST',
    message: 'Bad request',
  },
  validationError: {
    statusCode: 422,
    type: 'VALIDATION_ERROR',
    message: 'Validation error',
  },
  requestTimeout: {
    statusCode: 408,
    type: 'REQUEST_TIMEOUT',
    message: 'Request timeout',
  },
  conflict: {
    statusCode: 409,
    type: 'CONFLICT',
    message: 'Resource conflict',
  },
  gone: {
    statusCode: 410,
    type: 'GONE',
    message: 'Resource is gone',
  },
  unprocessableEntity: {
    statusCode: 422,
    type: 'UNPROCESSABLE_ENTITY',
    message: 'Unprocessable entity',
  },
  tooManyRequests: {
    statusCode: 429,
    type: 'TOO_MANY_REQUESTS',
    message: 'Too many requests',
  },
  internalError: {
    statusCode: 500,
    type: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  },
  notImplemented: {
    statusCode: 501,
    type: 'NOT_IMPLEMENTED',
    message: 'Not implemented',
  },
  serviceUnavailable: {
    statusCode: 503,
    type: 'SERVICE_UNAVAILABLE',
    message: 'Service unavailable',
  },
  gatewayTimeout: {
    statusCode: 504,
    type: 'GATEWAY_TIMEOUT',
    message: 'Gateway timeout',
  },
} as const

export interface FieldError {
  field: string
  message: string
}

export type ErrorType = (typeof HTTP_ERRORS)[keyof typeof HTTP_ERRORS]['type']

export interface ResponseError {
  statusCode: ContentfulStatusCode
  type: ErrorType
  message: string
  details?: string
  errors?: FieldError[]
}
