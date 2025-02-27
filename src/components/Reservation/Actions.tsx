import { Button } from '@mui/material'
import date from '@archipress/utilities/date'
import {
	ReservationContextProps,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { SevenRoomsReservationData } from '@archipress/utilities/reservationInterfaces'
import { useState } from 'react'
import CaretEffect from '@archipress/components/Effects/Caret'
import style from '@styles/components/Reservation/Actions.module.scss'
import {
	DiningVenue,
	SevenroomsVenue,
} from '@archipress/utilities/venueInterfaces'
import { to24HourTime } from '@archipress/utilities/functions'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'

export default function ReservationActions({
	reservation,
	diningVenue,
	venue,
}: {
	reservation: SevenRoomsReservationData
	diningVenue?: DiningVenue
	venue?: SevenroomsVenue
}) {
	const { actions } = useReservationContext() as ReservationContextProps
	const { state: appState } = useAppContext() as AppContextProps
	const datetime = date(
		`${reservation?.date} ${to24HourTime(reservation?.arrival_time)}`
	).format('YYYY-MM-DD')

	const timezone = appState.generalSettings?.timezone ?? 'America/New_York'

	const today = date().tz(timezone).format('YYYY-MM-DD')
	
	const canModify = !date(today).isSameOrAfter(datetime)

	const [show, setShow] = useState(false)

	return (
		<div className={`${style.actions} ${show ? style.opened : ''}`}>
			<div className="btn" onClick={() => setShow(!show)}>
				<CaretEffect opened={show} onClick={() => setShow(!show)} />
				<span>Actions</span>
			</div>

			<div className="action-items">
				<Button
					className="action accent-color"
					onClick={() => {
						setShow(!show)
						actions.toggleReservationDetailsModalOpen(
							true,
							reservation,
							diningVenue
						)
					}}
				>
					View
				</Button>

				{canModify && reservation?.status !== 'CANCELED' ? (
					<>
						<Button
							className="action accent-color"
							onClick={() => {
								setShow(!show)
								actions.toggleReservationModalOpen(
									true,
									reservation,
									diningVenue,
									venue
								)
							}}
						>
							Modify
						</Button>

						<Button
							className="action accent-color"
							onClick={() => {
								setShow(!show)
								actions.toggleReservationCancelModalOpen(
									true,
									reservation,
									diningVenue
								)
							}}
						>
							Cancel
						</Button>
					</>
				) : null}
			</div>
		</div>
	)
}
