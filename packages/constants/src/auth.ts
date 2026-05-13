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
  },
} as const

export type AuthProvider = (typeof AUTH.providers)[keyof typeof AUTH.providers]
