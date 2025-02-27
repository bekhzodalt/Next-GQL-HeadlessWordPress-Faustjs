import { SevenRoomsReservationData } from '@archipress/utilities/reservationInterfaces'
import date from '@archipress/utilities/date'
import style from '@styles/components/Reservation/Card.module.scss'
import ReservationActions from '@archipress/components/Reservation/Actions'
import {
	DiningVenue,
	SevenroomsVenue,
} from '@archipress/utilities/venueInterfaces'

export default function ReservationCard({
	reservation,
	venue,
	diningVenue,
}: {
	reservation: SevenRoomsReservationData
	venue?: SevenroomsVenue
	diningVenue?: DiningVenue
}) {
	return (
		<div className={style.card}>
			<div className={style.details}>
				<span className={style.venueTitle}>{venue?.name}</span>
				<span className="date">
					{date(reservation?.date).format('dddd, MMMM DD, YYYY')}
				</span>
				<span className="time">{reservation?.arrival_time?.toLowerCase()}</span>
				<span className="party-size">Party of {reservation?.max_guests}</span>
			</div>

			<ReservationActions
				reservation={reservation}
				diningVenue={diningVenue}
				venue={venue}
			/>
		</div>
	)
}
