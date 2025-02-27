import ReservationCard from '@archipress/components/Reservation/Card'
import style from '@styles/components/DropDown/Reservations.module.scss'
import { SevenRoomsReservationData } from '@archipress/utilities/reservationInterfaces'

import date from '@archipress/utilities/date'
import {
	DiningVenue,
	SevenroomsVenue,
} from '@archipress/utilities/venueInterfaces'
import { findVenue, to24HourTime } from '@archipress/utilities/functions'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'

export default function DropDownReservations({
	label,
	type = 'upcoming',
	venues,
	diningVenues,
	reservations,
}: {
	label: string
	type?: 'upcoming' | 'past' | 'canceled'
	venues?: SevenroomsVenue[]
	diningVenues?: DiningVenue[]
	reservations?: SevenRoomsReservationData[]
}) {
	// const [open, setOpen] = useState(type === 'upcoming')

	const reservationsSorted = {
		upcoming: [] as SevenRoomsReservationData[],
		past: [] as SevenRoomsReservationData[],
		canceled: [] as SevenRoomsReservationData[],
	}

	const { state: appState } = useAppContext() as AppContextProps

	const timezone = appState.generalSettings?.timezone

	const today = date()
		.tz(timezone ?? 'America/New_York')
		.format('YYYY/MM/DD HH:mm')

	reservations?.filter(reservation => {
		if (!reservation) return

		const reservationDate = date(
			`${reservation.date} ${
				reservation?.arrival_time ? to24HourTime(reservation?.arrival_time) : ''
			}`
		).format('YYYY/MM/DD HH:mm')

		if (reservation.status !== 'CANCELED' && reservationDate >= today) {
			return reservationsSorted.upcoming.push(reservation)
		}
		if (reservation.status !== 'CANCELED' && reservationDate <= today)
			return reservationsSorted.past.push(reservation)

		if (reservation.status === 'CANCELED')
			return reservationsSorted.canceled.push(reservation)
	})

	const sorted =
		reservationsSorted[type]?.length > 0
			? reservationsSorted[type]?.sort(
					(a, b) => date(a.date).unix() - date(b.date).unix()
			  )
			: 'No Reservations'

	return (
		<div className={style.reservations}>
			<div className={style.label}>
				<h3>{label}</h3>
			</div>

			<div className={style.dropper}>
				{typeof sorted === 'string' ? (
					<span className={style.content}>{sorted}</span>
				) : (
					<span className={style.content}>
						{sorted.map((item, i) => {
							const venue = findVenue(item, venues)
							const diningVenue = diningVenues.find(
								v => v.slug === venue?.venue_url_key
							)

							return (
								<ReservationCard
									reservation={item}
									venue={venue}
									diningVenue={diningVenue}
									key={i}
								/>
							)
						})}
					</span>
				)}
			</div>
		</div>
	)
}
