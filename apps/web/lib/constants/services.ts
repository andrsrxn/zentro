import { envClient } from '@/lib/config/env-client'

export const SERVICES = {
  analytics: 'https://va.vercel-scripts.com',
  media: 'https://res.cloudinary.com',
  avatars: ['https://lh3.googleusercontent.com', 'https://avatars.githubusercontent.com'],
  api: envClient.NEXT_PUBLIC_API_URL,
}
