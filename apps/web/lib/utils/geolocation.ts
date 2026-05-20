import { COUNTRIES, type CountryCode } from '@zentro/constants/countries'

export const getCountryName = (countryCode: CountryCode) => {
  const country = COUNTRIES.find(country => country.code === countryCode)

  return country
    ? {
        name: country.name,
        nativeName: country.nativeName,
      }
    : null
}
