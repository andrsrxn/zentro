import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { ERRORS } from '@/constants/errors'
import { SERVICES } from '@/constants/services'
import { getGeolocation } from '@/utils/geolocation'
import { server } from '../setup'

describe('getGeolocation', () => {
  it('returns geolocation data on success', async () => {
    const mockData = {
      ip: '8.8.8.8',
      isp: { asn: '', org: '', isp: '' },
      location: {
        country: 'United States',
        country_code: 'US',
        city: 'Mountain View',
        state: 'California',
        zipcode: '94035',
        latitude: 37.386,
        longitude: -122.0838,
        timezone: 'America/Los_Angeles',
        localtime: '2023-10-10 10:00:00',
      },
      risk: {
        is_mobile: false,
        is_vpn: false,
        is_tor: false,
        is_proxy: false,
        is_datacenter: false,
        risk_score: 0,
      },
    }

    server.use(
      http.get(`${SERVICES.geolocation}/8.8.8.8`, () => {
        return HttpResponse.json(mockData)
      })
    )

    const result = await getGeolocation({ ip: '8.8.8.8' })
    expect(result.error).toBeNull()
    expect(result.data).toEqual(mockData)
  })

  it('returns internal error if response is not ok', async () => {
    server.use(
      http.get(`${SERVICES.geolocation}/8.8.8.8`, () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const result = await getGeolocation({ ip: '8.8.8.8' })
    expect(result.data).toBeNull()
    expect(result.error).toEqual({
      statusCode: ERRORS.geolocation.internalError.statusCode,
      type: ERRORS.geolocation.internalError.type,
      message: ERRORS.geolocation.internalError.message,
    })
  })

  it('returns unknown ip error if location data is empty', async () => {
    const mockData = {
      ip: '127.0.0.1',
      isp: { asn: '', org: '', isp: '' },
      location: {
        country: '',
        country_code: '',
        city: '',
        state: '',
        zipcode: '',
        latitude: 0,
        longitude: 0,
        timezone: '',
        localtime: '',
      },
      risk: {
        is_mobile: false,
        is_vpn: false,
        is_tor: false,
        is_proxy: false,
        is_datacenter: false,
        risk_score: 0,
      },
    }

    server.use(
      http.get(`${SERVICES.geolocation}/127.0.0.1`, () => {
        return HttpResponse.json(mockData)
      })
    )

    const result = await getGeolocation({ ip: '127.0.0.1' })
    expect(result.data).toBeNull()
    expect(result.error).toEqual({
      statusCode: ERRORS.geolocation.unknownIp.statusCode,
      type: ERRORS.geolocation.unknownIp.type,
      message: ERRORS.geolocation.unknownIp.message,
    })
  })

  it('returns internal error if fetch throws', async () => {
    server.use(
      http.get(`${SERVICES.geolocation}/8.8.8.8`, () => {
        return HttpResponse.error()
      })
    )

    const result = await getGeolocation({ ip: '8.8.8.8' })
    expect(result.data).toBeNull()
    expect(result.error).toEqual({
      statusCode: ERRORS.geolocation.internalError.statusCode,
      type: ERRORS.geolocation.internalError.type,
      message: ERRORS.geolocation.internalError.message,
    })
  })
})
