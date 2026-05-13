import type { ContentfulStatusCode } from '@zentro/constants/api'
import type { ErrorType, FieldError } from '@zentro/constants/errors'

export type NormalizedCause = string

export const normalizeCause = (cause: unknown): NormalizedCause | undefined => {
  if (!cause) {
    return
  }

  if (cause instanceof Error) {
    return cause.toString()
  }

  if (typeof cause === 'string') {
    return cause
  }

  if (typeof cause === 'object') {
    return JSON.stringify(cause)
  }

  return String(cause)
}

export interface AppErrorOptions {
  type: ErrorType
  message: string
  details?: string
  errors?: FieldError[]
  critical?: boolean
  cause?: unknown
}

export interface AppErrorJSON {
  name: string
  message: string
  stack?: string
  type: ErrorType
  statusCode: ContentfulStatusCode
  details?: string
  errors?: FieldError[]
  critical: boolean
  cause?: NormalizedCause
}

export class AppError extends Error {
  readonly type: ErrorType
  readonly statusCode: ContentfulStatusCode
  readonly details?: string
  readonly errors?: FieldError[]
  readonly critical: boolean
  readonly cause?: NormalizedCause // ← always normalized, never raw unknown

  constructor(statusCode: ContentfulStatusCode, options: AppErrorOptions) {
    super(options.message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = 'AppError'
    this.type = options.type
    this.statusCode = statusCode
    this.details = options.details
    this.errors = options.errors
    this.critical = options.critical ?? false
    this.cause = normalizeCause(options.cause)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toJSON(): AppErrorJSON {
    return {
      name: this.name,
      message: this.message,
      stack: this.cause ? undefined : this.stack,
      type: this.type,
      statusCode: this.statusCode,
      details: this.details,
      errors: this.errors,
      critical: this.critical,
      cause: this.cause,
    }
  }

  static is(error: unknown): error is AppError {
    return error instanceof AppError
  }

  static from(
    error: unknown,
    fallback: AppErrorOptions & { statusCode: ContentfulStatusCode }
  ): AppError {
    if (AppError.is(error)) {
      return error
    }
    return new AppError(fallback.statusCode, { ...fallback, cause: error })
  }
}
