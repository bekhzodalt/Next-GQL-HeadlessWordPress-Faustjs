import ReservationDateTime from '@archipress/components/Reservation/DateTime'
import ReservationPartySize from '@archipress/components/Reservation/PartySize'
import SpinnerRipple from '@archipress/components/Effects/SpinnerRipple'
import VenueTitle from '@archipress/components/Venue/Title'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import {
	ReservationContextProps,
	ReservationContextState,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { Button, Modal } from '@mui/material'
import { useState } from 'react'
import style from '@styles/components/Reservation/CancelModal.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { militaryTime } from '@archipress/constants/times'
import date from '@archipress/utilities/date'
import { ApolloQueryResult, OperationVariables } from '@apollo/client'
import { to24HourTime } from '@archipress/utilities/functions'

export default function ReservationCancelModal({
	refetch,
}: {
	refetch?: (
		variables?: Partial<OperationVariables>
	) => Promise<ApolloQueryResult<any>>
}) {
	const { state, actions, updateState } =
		useReservationContext() as ReservationContextProps
	const { state: appState } = useAppContext() as AppContextProps

	const reservation = state.existingReservation

	const [cancelling, setCancelling] = useState(false)

	if (!reservation) return null

	const opened = state.openCancel ?? false

	async function cancelReservation() {
		setCancelling(true)

		try {
			const { data } = await actions.CancelReservation({
				reservation_id: reservation.id,
			})

			const filtered = state.reservations?.filter(
				res => res.id !== reservation.id
			)

			if (refetch) refetch()

			updateState((items: ReservationContextState) => ({
				...items,
				reservationNote: '',
				reservationPartySize: 1,
				reservationDate: date().format('YYYY/MM/DD'),
				reservationTime: militaryTime[48]?.label,
				reservations: data
					? [
							...filtered,
							{
								...data,
								client_requests: reservation.client_requests,
							},
					  ]
					: items?.reservations,
			}))
		} catch (error) {
			console.error('Reservation cancel error:', error)
			setCancelling(false)
		}

		setCancelling(false)
		actions.toggleReservationModalOpen(false)
		actions.toggleReservationCancelModalOpen(false)
	}

	return (
		<Modal open={opened} className={style.modal} hideBackdrop={true}>
			<>
				<div
					className="close"
					onClick={() => actions.toggleReservationCancelModalOpen(false, null)}
				>
					<FontAwesomeIcon icon={faTimes} />
				</div>

				{cancelling ? (
					<>
						<SpinnerRipple />
						<h2>Canceling the reservation...</h2>
					</>
				) : (
					<>
						<h2>Would you like to proceed with canceling your reservation?</h2>

						<div className="content">
							<VenueTitle element="span" />

							<span className="date">
								{date(
									`${reservation?.date} ${to24HourTime(
										reservation?.arrival_time
									)}`
								).format('dddd, MMMM DD, YYYY')}
							</span>

							<span className="time">
								{date(
									`${reservation?.date} ${to24HourTime(
										reservation?.arrival_time
									)}`
								).format('h:mm a')}
							</span>

							<span className="party-size">
								Party of {reservation.max_guests}
							</span>
						</div>

						<Button className="next-button" onClick={() => cancelReservation()}>
							Cancel the reservation
						</Button>

						<Button
							className="accent-color"
							onClick={() =>
								actions.toggleReservationCancelModalOpen(false, null)
							}
						>
							keep the reservation
						</Button>
					</>
				)}
			</>
		</Modal>
	)
}
