import {
	ReservationContextProps,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { ComponentType } from 'react'

export default function ReservationPartySize({
	element = 'span',
}: {
	element?: ComponentType | keyof JSX.IntrinsicElements
}) {
	const { state } = useReservationContext() as ReservationContextProps
	const Wrapper = element

	return (
		<Wrapper className="sevenrooms-reservation-party-size">
			Party of {state.updatedReservation?.max_guests}
		</Wrapper>
	)
}
