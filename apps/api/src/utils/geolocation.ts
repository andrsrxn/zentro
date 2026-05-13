/** biome-ignore-all lint/style/useNamingConvention: API response */

import type { ApiResponse } from '@zentro/constants/api'
import { ERRORS } from '@/constants/errors'
import { SERVICES } from '@/constants/services'

interface GeolocationData {
  ip: string
  isp: {
    asn: string
    org: string
    isp: string
  }
  location: {
    country: string
    country_code: string
    city: string
    state: string
    zipcode: string
    latitude: number
    longitude: number
    timezone: string
    localtime: string
  }
  risk: {
    is_mobile: boolean
    is_vpn: boolean
    is_tor: boolean
    is_proxy: boolean
    is_datacenter: boolean
    risk_score: number
  }
}

type GeolocationResponse = ApiResponse<GeolocationData>

export const getGeolocation = async ({ ip }: { ip: string }): Promise<GeolocationResponse> => {
  try {
    const response = await fetch(`${SERVICES.geolocation}/${ip}`)

    if (!response.ok) {
      return {
        data: null,
        error: {
          statusCode: ERRORS.geolocation.internalError.statusCode,
          type: ERRORS.geolocation.internalError.type,
          message: ERRORS.geolocation.internalError.message,
        },
      }
    }

    const data = (await response.json()) as GeolocationData

    if (
      data.location.country === '' ||
      data.location.country_code === '' ||
      data.location.timezone === ''
    ) {
      return {
        data: null,
        error: {
          statusCode: ERRORS.geolocation.unknownIp.statusCode,
          type: ERRORS.geolocation.unknownIp.type,
          message: ERRORS.geolocation.unknownIp.message,
        },
      }
    }

    return { data, error: null }
  } catch {
    return {
      data: null,
      error: {
        statusCode: ERRORS.geolocation.internalError.statusCode,
        type: ERRORS.geolocation.internalError.type,
        message: ERRORS.geolocation.internalError.message,
      },
    }
  }
}
