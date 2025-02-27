import NavigationLink from '@archipress/components/Links/Navigation'
import ReservationCancelModal from '@archipress/components/Reservation/CancelModal'
import VenueTitle from '@archipress/components/Venue/Title'
import { militaryTime } from '@archipress/constants/times'
import date from '@archipress/utilities/date'

import {
	useReservationContext,
	ReservationContextProps,
	ReservationContextState,
} from '@archipress/utilities/ReservationContext'
import { SevenRoomsReservationData } from '@archipress/utilities/reservationInterfaces'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '@mui/material'
import style from '@styles/components/Reservation/DetailsModal.module.scss'

export default function ReservationDetailsModal({
	modify = false,
	existingReservation,
}: {
	modify?: boolean
	existingReservation?: SevenRoomsReservationData
}) {
	const { state, actions, updateState } =
		useReservationContext() as ReservationContextProps

	const reservation = existingReservation || state.existingReservation

	if (!reservation) return null

	const opened = state.openDetails

	const restrictions = state.tags?.client_tags
		?.filter(t => t.group === 'Dietary restrictions')
		.map(t => t.tag)
		.join(', ')

	const notes = reservation.client_requests ?? ''

	return (
		<>
			<Modal open={opened} className={style.modal} hideBackdrop={true}>
				<>
					<div
						className="close"
						onClick={() =>
							actions.toggleReservationDetailsModalOpen(false, null)
						}
					>
						<FontAwesomeIcon icon={faTimes} />
					</div>

					<div className="details">
						<VenueTitle element="h1" />

						<span className="date">
							{date(reservation.date).format('dddd, MMMM DD, YYYY')}
						</span>

						<span className="time">
							{reservation.arrival_time?.toLowerCase()}
						</span>

						<span className="party-size">
							Party of {reservation.max_guests}
						</span>

						{restrictions?.length ? (
							<div className="restrictions">
								<h2>Your Dietary Restrictions</h2>
								<div className="host">
									<span>{restrictions}</span>
								</div>
							</div>
						) : null}

						{notes?.length ? (
							<>
								<div className="notes">
									<h2>Special Requests</h2>
									<span>{notes}</span>
								</div>
							</>
						) : null}

						{modify ? (
							<>
								<NavigationLink
									href="/dining"
									onClick={() =>
										updateState((items: ReservationContextState) => ({
											...items,
											openProcess: false,
											openDetails: false,
											step: 0,
											updatedReservation: {
												...items.updatedReservation,
												client_requests: '',
												max_guests: 1,
												date: date().format('YYYY/MM/DD'),
												arrival_time: militaryTime[48]?.label,
											},
										}))
									}
									className="accent-color"
								>
									My Reservations
								</NavigationLink>
							</>
						) : null}
					</div>
				</>
			</Modal>

			{modify ? (
				<>
					<ReservationCancelModal />
				</>
			) : null}
		</>
	)
}
