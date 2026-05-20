import UAParser from 'ua-parser-js'

export const formatUserAgent = (userAgent: string) => {
  const parser = new UAParser(userAgent)
  const result = parser.getResult()
  const versionMajor = result.browser.version?.split('.')[0]
  const versionMajorOs = result.os.version?.split('.')[0]

  return {
    browser: `${result.browser.name} ${versionMajor}`.trim(),
    os: `${result.os.name} ${versionMajorOs}`.trim(),
    deviceType: result.device.type,
    deviceVendor: result.device.vendor,
  }
}
