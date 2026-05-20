import type { CountryCode } from '@zentro/constants/countries'
import type { ComponentProps } from 'react'
import { getCountryName } from '@/lib/utils/geolocation'
import { cn } from '@/lib/utils/theme'

export const HeaderCountryFlag = ({
  countryCode,
  className,
  ...props
}: { countryCode: string } & ComponentProps<'img'>) => {
  const country = getCountryName(countryCode as CountryCode)

  if (!country) {
    return null
  }

  return (
    <img
      src={`/flags/${countryCode.toLowerCase()}.svg`}
      className={cn('w-7 rounded-sm border object-contain', className)}
      title={country?.nativeName ?? 'Flag'}
      alt={country?.nativeName ?? 'Flag'}
      {...props}
    />
  )
}
