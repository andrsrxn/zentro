/** biome-ignore-all lint/style/noMagicNumbers: cookie days */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'Lax',
  path: '/',
  secure: true,
}

export const COOKIES = {
  csrf: {
    name: 'csrf_token',
    maxAge: 60 * 60 * 24, // 1 day
  },
  geolocation: {
    name: 'geolocation',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
} as const
