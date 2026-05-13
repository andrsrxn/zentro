export const SUCCESS = {
  ok: {
    statusCode: 200,
    type: 'OK',
    message: 'OK',
  },
  created: {
    statusCode: 201,
    type: 'CREATED',
    message: 'Created',
  },
  accepted: {
    statusCode: 202,
    type: 'ACCEPTED',
    message: 'Accepted',
  },
  noContent: {
    statusCode: 204,
    type: 'NO_CONTENT',
    message: 'No content',
  },
} as const

export type SuccessType = (typeof SUCCESS)[keyof typeof SUCCESS]['type']
