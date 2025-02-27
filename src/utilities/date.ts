import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import isYesterday from 'dayjs/plugin/isYesterday'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import toObject from 'dayjs/plugin/toObject'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import calendar from 'dayjs/plugin/calendar'
import minmax from 'dayjs/plugin/minMax'

const date = dayjs

date.extend(duration)
date.extend(relativeTime)
date.extend(isBetween)
date.extend(isSameOrAfter)
date.extend(isSameOrBefore)
date.extend(isToday)
date.extend(isTomorrow)
date.extend(isYesterday)
date.extend(timezone)
date.extend(advancedFormat)
date.extend(utc)
date.extend(toObject)
date.extend(customParseFormat)
date.extend(calendar)
date.extend(minmax)

export default date
