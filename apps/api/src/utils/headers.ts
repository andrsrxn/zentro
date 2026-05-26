import { NODE_ENV } from '@zentro/constants/env'
import { env } from '@/config/env'

const parseIPV6Regex = /for="?\[(?<ip>[^\]]+)\]"?/iu

const parseIPV4Regex = /for="?(?<ip>[^;,"\s\]]+)"?/iu

function parseForwardedHeader(value: string): string | null {
  // IPv6: for=[2001:db8::1] or for="[2001:db8::1]"
  const ipv6 = parseIPV6Regex.exec(value)?.groups?.ip
  if (ipv6) {
    return ipv6
  }

  // IPv4 / hostname: for=1.2.3.4 or for="1.2.3.4"
  const ipv4 = parseIPV4Regex.exec(value)?.groups?.ip
  return ipv4 ?? null
}

export const getIP = (fn?: (key: string) => string | null) => {
  if (env.NODE_ENV === NODE_ENV.dev) {
    if (!env.DEV_IP) {
      throw new Error('DEV_IP is not defined')
    }
    return env.DEV_IP
  }

  if (!fn) {
    return null
  }

  return (
    fn('cf-connecting-ip') ?? // Cloudflare
    fn('x-forwarded-for')?.split(',')[0]?.trim() ?? // Standard proxy chain
    fn('x-real-ip')?.trim() ?? // nginx / simple reverse proxies
    fn('x-client-ip')?.trim() ?? // Apache mod_remoteip
    fn('x-cluster-client-ip')?.trim() ?? // Rackspace, some load balancers
    parseForwardedHeader(fn('forwarded') ?? '') ?? // RFC 7239 formal header
    null
  )
}
