import {
	ReservationContextProps,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { ComponentType } from 'react'
import date from '@archipress/utilities/date'
import { to24HourTime } from '@archipress/utilities/functions'

export default function ReservationDateTime({
	element = 'span',
	format = 'YYYY/MM/DD h:mm A',
}: {
	element?: ComponentType | keyof JSX.IntrinsicElements
	format: string
}) {
	const { state } = useReservationContext() as ReservationContextProps
	const Wrapper = element
	const datetime = date(
		`${state.updatedReservation?.date} ${to24HourTime(
			state.updatedReservation?.arrival_time
		)}`
	).format(format)

	return (
		<Wrapper className="sevenrooms-reservation-datetime">{datetime}</Wrapper>
	)
}
