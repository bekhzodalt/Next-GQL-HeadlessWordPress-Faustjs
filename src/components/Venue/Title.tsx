import {
	ReservationContextProps,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { ComponentType } from 'react'

export default function VenueTitle({
	element = 'h1',
}: {
	element: ComponentType | keyof JSX.IntrinsicElements
}) {
	const { state } = useReservationContext() as ReservationContextProps

	const venue = state.diningVenue

	const Wrapper = element

	const title = venue?.name ?? '[unkown venue title]'

	return <Wrapper>{title}</Wrapper>
}
