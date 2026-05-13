import { isProductionEnv } from '@zentro/utils/env'
import { type NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/config/env'
import { SERVICES } from '@/lib/constants/services'

export default function proxy(request: NextRequest) {
  let workerSrc = "'self'"
  let scriptSrc = `'self' 'unsafe-inline' ${SERVICES.analytics}`
  const connectSrc = `'self' ${SERVICES.analytics} ${SERVICES.media} ${SERVICES.api}`
  const imgSrc = `'self' blob: data: ${SERVICES.media} ${SERVICES.avatars.join(' ')}`
  const mediaSrc = `'self' ${SERVICES.media}`
  const styleSrc = "'self' 'unsafe-inline'"

  if (!isProductionEnv(env.NODE_ENV)) {
    scriptSrc += " 'unsafe-eval'"
    workerSrc += ' blob:'
  }

  const cspHeaderParts: string[] = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    "object-src 'none'",
    `img-src ${imgSrc}`,
    `media-src ${mediaSrc}`,
    "font-src 'self'",
    `worker-src ${workerSrc}`,
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "script-src-attr 'none'",
    `connect-src ${connectSrc}`,
  ]

  if (isProductionEnv(env.NODE_ENV)) {
    cspHeaderParts.push('upgrade-insecure-requests')
  }

  const cspHeader = `${cspHeaderParts.join('; ')};`
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim()

  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  })

  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')

  if (isProductionEnv(env.NODE_ENV)) {
    response.headers.set('Origin-Agent-Cluster', '?1')
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|url|.*\\..*).*)'],
}
