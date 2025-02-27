import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import style from '@archipress/styles/components/Reservation/CalendarLink.module.scss'

/**
 * @param {string} start_date: ISO Date RFC 3339 String 2020-01-0100:00:00T
 * @param {string} end_date: ISO Dat RFC 3339 String 2020-01-0100:00:00T
 * @param {string} title: Event Title
 * @param {string} summary: Event Summary
 * @param {string} description: Event Description
 * @param {string} location: Event Location
 * @param {string} timezone: Timezone
 * @param {string} url: Event URL
 * @param {string} filename: Filename
 */
export interface CalendarFields {
	start_date: string
	end_date: string
	title: string
	description: string
	location: string
	filename?: string
	timezone?: string
}

export type CalendarTypes = 'google' | 'outlook' | 'apple'

interface CalendarLinkProps {
	calendarType?: CalendarTypes
	label?: string
	fields?: CalendarFields
}

/**
 *
 * @warning Make sure to pass the start and end date in RFC 3339 format. Google calendar link will automatically have separators removed
 */
export default function ReservationCalendarLink({
	calendarType = 'google',
	label = 'Add to Calendar',
	fields,
}: CalendarLinkProps) {
	const { start_date, end_date, title, description, location } = fields ?? {}

	const [link, setLink] = useState('')

	function getICS() {
		if (calendarType === 'google') {
			const start = start_date.replace(/[-:/]/g, '')
			const end = end_date.replace(/[-:/]/g, '')
			const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${title}&dates=${start}/${end}&details=${description}&location=${location}&sf=true&output=xml`

			setLink(url)
		} else if (calendarType === 'apple') {
			const start = start_date.replace(/\//g, '-')
			const end = end_date.replace(/\//g, '-')
			const url = `https://www.sevenrooms.com/direct/calendar/?arrival_time=${start}&end_time=${end}&event_desc=${description}&event_location=${location}&event_title=${title}`

			setLink(url)
		} else if (calendarType === 'outlook') {
			const url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${start_date}&enddt=${end_date}&subject=${title}&body=${description}&location=${location}`
			setLink(url)
		}
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => getICS(), [])
	return (
		<Typography variant="subtitle1" className={style.link}>
			<a href={link} target="_blank" rel="noreferrer">
				{label}
			</a>
		</Typography>
	)
}
