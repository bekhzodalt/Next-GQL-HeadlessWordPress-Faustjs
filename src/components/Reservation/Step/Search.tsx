import VenueTitle from '@archipress/components/Venue/Title'
import {
	ReservationContextProps,
	ReservationContextState,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import {
	faCalendarAlt,
	faClock,
	faUsers,
} from '@fortawesome/pro-duotone-svg-icons'
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Slide } from '@mui/material'
import { useRef, useState } from 'react'
import style from '@styles/components/Reservation/Step/Search.module.scss'
import { militaryTime } from '@archipress/constants/times'
import { to24HourTime, toStandardTime } from '@archipress/utilities/functions'
import day from '@archipress/utilities/date'
import { SevenroomsVenue } from '@archipress/utilities/venueInterfaces'
import NavigationLink from '@archipress/components/Links/Navigation'
import { useRouter } from 'next/router'

export default function ReservationStepSearch({
	venues,
}: {
	venues?: SevenroomsVenue[]
}) {
	const router = useRouter()

	const { state, updateState, actions } =
		useReservationContext() as ReservationContextProps

	const [date, setDate] = useState(
		state.updatedReservation?.date
			? day(state.updatedReservation.date).format('YYYY/MM/DD')
			: day().format('YYYY/MM/DD')
	)

	const maxGuest = useRef(state.diningVenue?.party_size ?? 8)

	const reservations = state.reservations
		?.filter(res => {
			return (
				day(res.date).format('YYYY/MM/DD') ===
					day(state.updatedReservation?.date).format('YYYY/MM/DD') &&
				res.status !== 'CANCELED' &&
				res.venue_id !== state.venue?.id
			)
		})
		.map(res => ({
			reservation: res,
			venue: venues?.find(v => v.id === res?.venue_id),
		}))

	function hasReservation(time: string) {
		const res = reservations?.some(res => {
			const start_time = day(
				`12/12/12 ${to24HourTime(res.reservation?.arrival_time)}`
			)
				.subtract(2, 'hour')
				.format('HH:mm')
			const end_time = day(
				`12/12/12 ${to24HourTime(res.reservation?.arrival_time)}`
			)
				.add(2, 'hour')
				.format('HH:mm')

			return time >= start_time && time <= end_time
		})

		return res
	}

	const military = militaryTime.filter(item => !hasReservation(item.value))

	const dateInput = {
		get: () => date.replace(/\//g, '-'),
		set: (v: any) => {
			if (!v || v === '') setDate(day().format('YYYY/MM/DD'))
			else setDate(v.replace(/-/g, '/'))
			updateState((items: ReservationContextState) => ({
				...items,
				updatedReservation: {
					...items.updatedReservation,
					date: v,
				},
			}))

			// updateVenueAvailability(v)
		},
	}

	async function adjustDay(op = 'next') {
		const dateDay =
			op === 'prev'
				? day(date).subtract(1, 'day').format('YYYY-MM-DD')
				: day(date).add(1, 'day').format('YYYY-MM-DD')

		if (op === 'prev' && dateDay < day().format('YYYY-MM-DD')) return

		dateInput.set(dateDay)
	}

	const guestInput = {
		get: () => filters.guest,
		set: (v: number) => {
			const guest = v > maxGuest.current ? maxGuest.current : v < 1 ? 1 : v
			updateFilters({ ...filters, guest })
			// updateVenueAvailability(date, guest)
		},
	}

	const guestOptions = () => {
		const size = []

		for (let i = 1; i <= maxGuest.current; i++) size.push(i)

		return size
	}

	const [filters, updateFilters] = useState({
		index: state.updatedReservation?.arrival_time?.toLowerCase()
			? militaryTime.findIndex(
					time =>
						time.label.toLowerCase() ===
						state.updatedReservation?.arrival_time?.toLowerCase()
			  ) || 0
			: 0,
		displayTime: state.updatedReservation?.arrival_time?.toLowerCase() || null,
		guest: state.updatedReservation?.max_guests,
	})

	function handleChange(value: any | number) {
		const index =
			typeof value === 'string'
				? military.findIndex(time => time.value === value)
				: value

		if (index >= 0 && index < military.length) {
			updateFilters({
				...filters,
				index,
				displayTime: toStandardTime(military[index]?.value),
			})

			updateState((items: ReservationContextState) => ({
				...items,
				updatedReservation: {
					...items.updatedReservation,
					arrival_time: military[index]?.label,
				},
			}))
		}
	}

	function adjustTime(op = 'next') {
		if (op === 'next') {
			if (filters.index >= military.length - 1) return

			updateFilters({
				...filters,
				index: filters.index + 1,
				displayTime: toStandardTime(military[filters.index + 1]?.value),
			})

			updateState((items: ReservationContextState) => ({
				...items,
				updatedReservation: {
					...items.updatedReservation,
					arrival_time: military[filters.index + 1]?.label,
				},
			}))
		} else {
			if (filters.index <= 0) return
			updateFilters({
				...filters,
				index: filters.index - 1,
				displayTime: toStandardTime(military[filters.index - 1]?.value),
			})

			updateState((items: ReservationContextState) => ({
				...items,
				updatedReservation: {
					...items.updatedReservation,
					arrival_time: military[filters.index - 1]?.label,
				},
			}))
		}
	}

	function updateSearchFields() {
		updateState((items: ReservationContextState) => ({
			...items,
			step: items.step + 1,
			updatedReservation: {
				...items.updatedReservation,
				max_guests: filters.guest,
				date: day(date).format('MM/DD/YYYY'),
				arrival_time: filters.displayTime,
			},
		}))
	}

	return (
		<Slide direction="left" in={true}>
			<div className={`step ${style.step}`}>
				<div className="left">
					{reservations?.length > 0 ? (
						<div className="reservations">
							<h3 className="reservation-title">
								You already have
								{reservations?.length > 1
									? ' reservations '
									: ' a reservation '}
								for this date
							</h3>

							<div className="reservation-details">
								{reservations?.map((res, i) => {
									return (
										<div className="detail" key={i}>
											<span className="title">{res?.venue?.name}</span>
											<span>
												{' '}
												- {res?.reservation?.arrival_time} -{' '}
												<FontAwesomeIcon icon={faUsers} />{' '}
												{res?.reservation?.max_guests}
											</span>
										</div>
									)
								})}
							</div>

							<NavigationLink href="/dining" className="accent-color">
								View Reservations
							</NavigationLink>
						</div>
					) : null}

					<VenueTitle element="h1" />

					<p>
						Please provide your reservation details and we will check
						availability:
					</p>
				</div>

				<div className="divider" />

				<div className="right">
					<div className="week-select">
						<Button className="icon" onClick={() => adjustDay('prev')}>
							<FontAwesomeIcon icon={faChevronLeft} />
						</Button>

						<h3 className="selected-month">
							{day(date).format('ddd, MMMM D')}
							<FontAwesomeIcon icon={faCalendarAlt} />
							<input
								type="date"
								min={day().format('YYYY-MM-DD')}
								value={dateInput.get()}
								style={{
									fontSize: '0.5em',
								}}
								onChange={e => dateInput.set(e.currentTarget.value)}
							/>
						</h3>

						<Button className="icon" onClick={() => adjustDay()}>
							<FontAwesomeIcon icon={faChevronRight} />
						</Button>
					</div>

					<div className="guest-input">
						<Button
							className="icon"
							onClick={() => guestInput.set(filters.guest - 1)}
						>
							<FontAwesomeIcon icon={faChevronLeft} />
						</Button>

						<h3 className="party-size">
							<span>
								{guestInput.get()}
								<FontAwesomeIcon icon={faUsers} />
							</span>
							<span>Party Size</span>
							<select
								value={guestInput.get()}
								onChange={v => guestInput.set(parseInt(v.currentTarget.value))}
							>
								{guestOptions()?.map(opt => {
									return (
										<option key={opt} value={opt}>
											{opt}
										</option>
									)
								})}
							</select>
						</h3>

						<Button
							className="icon"
							onClick={() => guestInput.set(filters.guest + 1)}
						>
							<FontAwesomeIcon icon={faChevronRight} />
						</Button>
					</div>

					<div className="time-input">
						<Button
							className="icon"
							onClick={() =>
								!filters.displayTime
									? handleChange('18:45')
									: adjustTime('prev')
							}
						>
							<FontAwesomeIcon icon={faChevronLeft} />
						</Button>

						<h3 className="desired-time">
							<>
								{filters.displayTime || 'Select a Time'}
								<select
									value={
										filters.displayTime
											? military[filters.index]?.value
											: '19:00'
									}
									onChange={(v: any) => handleChange(v.target?.value)}
									onClick={() =>
										!filters.displayTime ? handleChange('19:00') : null
									}
									disabled={actions.availabilityLoading}
								>
									<option disabled hidden value="select"></option>
									{military.map(time => {
										return (
											<option
												key={time.value}
												value={hasReservation(time.value) ? '' : time.value}
												disabled={hasReservation(time.value)}
											>
												{time.label}
											</option>
										)
									})}
								</select>
								<FontAwesomeIcon icon={faClock} />
							</>
						</h3>

						<Button
							className="icon"
							onClick={() =>
								!filters.displayTime
									? handleChange('19:15')
									: adjustTime('next')
							}
						>
							<FontAwesomeIcon icon={faChevronRight} />
						</Button>
					</div>

					<Button
						className="ghost next-button"
						onClick={updateSearchFields}
						disabled={filters.displayTime === null}
					>
						Next
					</Button>
				</div>
			</div>
		</Slide>
	)
}
