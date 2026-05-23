import { TZDate } from '@date-fns/tz'
import type { TimeZone } from '@zentro/constants/countries'
import { format } from 'date-fns'

export const formatDate = ({
  includeWeekDay,
  date,
  includeTime,
  timeZone,
}: {
  includeWeekDay?: boolean
  date: string | Date
  includeTime?: boolean
  timeZone?: TimeZone
}) => {
  const formatString = includeWeekDay ? 'EEEE, PP' : 'PP'
  const timezonedDate = timeZone ? new TZDate(date.toString(), timeZone) : date
  const formatted = format(timezonedDate, includeTime ? `${formatString}p` : formatString)
  return formatted
}
