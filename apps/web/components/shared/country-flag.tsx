import { COUNTRIES, COUNTRY_CODES, type CountryCode } from '@zentro/constants/countries'

export const HeaderCountryFlag = ({ countryCode }: { countryCode: string }) => {
  if (!COUNTRY_CODES.includes(countryCode as CountryCode)) {
    return null
  }

  // biome-ignore lint/style/noNonNullAssertion: already checked if the country code is valid
  const country = COUNTRIES.find(country => country.code === countryCode)!

  return (
    <img
      src={`/flags/${countryCode.toLowerCase()}.svg`}
      className='w-7 rounded-sm border object-contain'
      title={country?.nativeName ?? 'Flag'}
      alt={country?.nativeName ?? 'Flag'}
    />
  )
}
