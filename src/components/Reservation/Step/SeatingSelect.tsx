import VenueTitle from '@archipress/components/Venue/Title'

import {
	ReservationContextProps,
	ReservationContextState,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { faCalendarAlt } from '@fortawesome/pro-duotone-svg-icons'
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/pro-regular-svg-icons'
import { faStar, faUsers } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Slide } from '@mui/material'
import { useEffect, useState } from 'react'
import style from '@styles/components/Reservation/Step/SeatingSelect.module.scss'
import {
	SevenRoomsVenuePrograms,
	SevenRoomsVenueAvailability,
	SeatingArea,
	SevenRoomsVenueAvailabilityTime,
	SevenroomsVenue,
} from '@archipress/utilities/venueInterfaces'
import ReservationDateTime from '@archipress/components/Reservation/DateTime'
import ReservationPartySize from '@archipress/components/Reservation/PartySize'
import day from '@archipress/utilities/date'
import SpinnerRipple from '@archipress/components/Effects/SpinnerRipple'
import NavigationLink from '@archipress/components/Links/Navigation'
import { getWeekDays, to24HourTime } from '@archipress/utilities/functions'
import { militaryTime } from '@archipress/constants/times'

export default function ReservationStepSeatingSelect({
	venues,
}: {
	venues?: SevenroomsVenue[]
}) {
	const { state, updateState, actions } =
		useReservationContext() as ReservationContextProps

	// Filter related code
	const [time, updateTime] = useState({
		selectedDate: day(state.updatedReservation?.date).format('YYYY/MM/DD'),
		selectedMonth: day(state.updatedReservation?.date).format('MMMM, YYYY'),
		selectedWeek: day(state.updatedReservation?.date)
			.startOf('week')
			.format('YYYY/MM/DD'),
		week: [],
	})

	const [loading, setLoading] = useState(false)

	const venue = state.venue

	const [reservationData, setReservationData] = useState<{
		availability?: { date: string; items: SevenRoomsVenueAvailability[] }[]
		programs?: {
			date: string
			item: { note?: string; programs: SevenRoomsVenuePrograms[] }
		}[]
	}>({
		availability: [],
		programs: [],
	})

	const [dailyProgram, setDailyProgram] = useState<SevenRoomsVenuePrograms[]>()

	const party_size = state.updatedReservation?.max_guests?.toString()

	function parsePrograms(programs: string) {
		if (!programs || programs === null || typeof programs !== 'string') return
		if (programs.startsWith('{') && programs.endsWith('}'))
			return JSON.parse(programs)
	}

	async function GetAvailable(date?: string) {
		if (!loading) {
			setLoading(true)

			try {
				const args = {
					...getWeekDays(date).reduce((acc, cur, i) => {
						acc[`date${i + 1}`] = cur.split('/').join('-')
						return acc
					}, {} as Record<string, any>),
					venue_id: venue?.id,
					start_time: '00:00',
					end_time: '23:59',
					party_size,
				}

				const { data } = await actions.getVenueAvailability({ variables: args })

				return data
			} catch (error) {
				console.error(`failed fetching ${date}`, error)
			}
		}

		return null

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}

	/*
	Builds array of objects based on seating areas and their available times
	Works based on type book or request - see above defines
*/
	function getTimes(
		datetime: string,
		type: string,
		avails?: { date: string; items: SevenRoomsVenueAvailability[] }[]
	) {
		if (avails && !avails?.some(item => item.date === datetime)) return []
		if (
			!avails &&
			!reservationData.availability?.some(item => item.date === datetime)
		)
			return []

		const times = (avails || reservationData.availability)
			.find(item => item.date === datetime)
			?.items?.filter(shifts => {
				const start = militaryTime?.find(
					item =>
						item.label?.toLowerCase() === shifts.times?.[0]?.time?.toLowerCase()
				)?.value

				const end = militaryTime?.find(
					item =>
						item.label?.toLowerCase() ===
						shifts?.times?.[shifts.times?.length - 1]?.time?.toLowerCase()
				)?.value

				const selected = militaryTime?.find(
					item =>
						item.label?.toLowerCase() ===
						state.updatedReservation?.arrival_time?.toLowerCase()
				)?.value

				if (start && end && selected <= end && selected >= start) return true
			})
			?.flatMap(shifts =>
				shifts.times.map(t => ({
					...t,
					shift_persistent_id: shifts.shift_persistent_id,
				}))
			)
			?.filter(t => t && t.type === type)

		if (times.length <= 0) {
			const closest = [
				...((avails || reservationData.availability).find(
					item => item.date === datetime
				)?.items ?? []),
			]
				?.sort((a: any, b: any) => {
					const startA = a.times?.[0]?.time?.toLowerCase()
					const startB = b.times?.[0]?.time?.toLowerCase()
					return startA - startB
				})
				?.filter(shifts => {
					const start = militaryTime?.find(
						item =>
							item.label?.toLowerCase() ===
							shifts.times?.[0]?.time?.toLowerCase()
					)?.value

					const selected = militaryTime?.find(
						item =>
							item.label?.toLowerCase() ===
							state.updatedReservation?.arrival_time?.toLowerCase()
					)?.value

					if (selected <= start) return true
				})
				?.flatMap(shifts =>
					shifts.times.map(t => ({
						...t,
						shift_persistent_id: shifts.shift_persistent_id,
					}))
				)
				?.filter(t => t && t.type === type)

			return closest as Partial<SevenRoomsVenueAvailabilityTime[]>
		}

		// Forces return of FALSE if times are empty - used down in template for easy checking
		return times as Partial<SevenRoomsVenueAvailabilityTime[]>
	}

	// Bookables and Requestables
	const [slots, setSlots] = useState({
		bookables: getTimes(time.selectedDate, 'book'),
		requestables: getTimes(time.selectedDate, 'request'),
	})

	function dateHasPrograms(datetime: string) {
		if (
			reservationData.programs?.some(
				item => item.date === datetime && item.item?.programs?.length > 0
			)
		) {
			return true
		}

		return false
	}

	function isSelectedDate(datetime: string) {
		return day(time?.selectedDate).isSame(datetime, 'date')
	}

	function dateHasTimes(datetime: string) {
		if (!reservationData.availability?.some(item => item.date === datetime))
			return false
		const availdate =
			reservationData.availability?.find(item => item.date === datetime)
				?.items ?? []
		const times = availdate?.flatMap(service => service.times)
		return !!times.length
	}

	const monthInput = {
		get: () => time?.selectedDate.replace(/\//g, '-'),
		set: (v: any) => {
			const selectedDate = !v
				? day().startOf('day').format('YYYY/MM/DD')
				: day(v.replace(/-/g, '/')).startOf('day').format('YYYY/MM/DD')

			// If they changed input past the current week - we need to API in new dates
			if (
				!reservationData.availability?.some(
					item => item.date === day(v).startOf('week').format('YYYY/MM/DD')
				) &&
				venue
			)
				if (!v) {
					updateTime({
						...time,
						selectedDate,
						selectedMonth: day().format('MMMM, YYYY'),
						selectedWeek: day().startOf('week').format('YYYY/MM/DD'),
					})
				} else {
					updateTime({
						...time,
						selectedDate,
						selectedMonth: day(v.replace(/-/g, '/')).format('MMMM, YYYY'),
						selectedWeek: day(v.replace(/-/g, '/'))
							.startOf('week')
							.format('YYYY/MM/DD'),
					})
				}
		},
	}

	useEffect(() => {
		const days = getWeekDays(time.selectedDate) as string[]

		updateTime({
			...time,
			week: days,
		})

		updateState((items: ReservationContextState) => ({
			...items,
			updatedReservation: {
				...items.updatedReservation,
				date: time.selectedDate,
			},
		}))

		GetAvailable(time.selectedDate).then(data => {
			let a: {
				date: string
				items: SevenRoomsVenueAvailability[]
			}[] = []
			let p: {
				date: string
				item: {
					note?: string
					programs: SevenRoomsVenuePrograms[]
				}
			}[] = []

			for (let i = 0; i < days.length; i++) {
				if (data?.[`date${i + 1}`]?.length > 0) {
					a.push({
						date: days[i],
						items: state.existingReservation
							? data?.[`date${i + 1}`]
							: data?.[`date${i + 1}`]?.filter(
									(av: any) =>
										!state.reservations?.some(
											res =>
												day(res.date).format('YYYY/MM/DD') === days[i] &&
												res.status !== 'CANCELED' &&
												res.shift_persistent_id === av.shift_persistent_id
										)
							  ),
					})
				}

				const parsed = parsePrograms(data?.[`programs${i + 1}`])

				const programs: any = parsed ? Object.values(parsed)?.[0] : null

				const sorted = programs?.programs

				if (sorted) {
					p.push({ date: days[i], item: { programs: sorted } })
				}
			}

			setSlots({
				bookables: getTimes(time.selectedDate, 'book', a),
				requestables: getTimes(time.selectedDate, 'request', a),
			})

			const program =
				p?.find(item => item.date === time.selectedDate)?.item?.programs ||
				reservationData.programs?.find(item => item.date === time.selectedDate)
					?.item?.programs

			setDailyProgram(program)

			setReservationData({
				...reservationData,
				availability: a || reservationData.availability,
				programs: p || reservationData.programs,
			})

			setLoading(false)
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time.selectedDate])

	/*
	Only fetch API results if the Availability doesn't
	contain the next set of dates. Avoid extraneous API and traffic
*/
	function selectPreviousWeek() {
		setSlots({
			bookables: [],
			requestables: [],
		})

		const selectedDate = day(time?.selectedDate).subtract(1, 'week')

		updateTime({
			...time,
			selectedMonth: selectedDate.format('MMMM, YYYY'),
			selectedWeek: selectedDate.startOf('week').format('YYYY/MM/DD'),
			selectedDate: selectedDate.format('YYYY/MM/DD'),
		})
	}

	function selectNextWeek() {
		setSlots({
			bookables: [],
			requestables: [],
		})

		const selectedDate = day(time?.selectedDate).add(1, 'week')

		updateTime({
			...time,
			selectedMonth: selectedDate.format('MMMM, YYYY'),
			selectedWeek: selectedDate.startOf('week').format('YYYY/MM/DD'),
			selectedDate: selectedDate.format('YYYY/MM/DD'),
		})
	}

	function getSeatingAreas(timeSlots: SevenRoomsVenueAvailabilityTime[]) {
		const seatingAreas = timeSlots.map<SeatingArea>(t => ({
			name: t.public_description_title,
			desc: t.public_time_slot_description,
			photo: t.public_photo,
			times: [],
			type: t.type,
		}))

		for (const area of seatingAreas) {
			area.times = timeSlots.filter(
				t => t.public_description_title === area.name
			)
		}

		const areas = {} as any

		return seatingAreas.filter(a => {
			if (areas[a.name]) return false
			areas[a.name] = true
			return true
		})
	}

	function getFormattedDate(datetime: string, format: string) {
		return day(datetime).format(format)
	}

	// Pushing selected date time and seating area if applicable to reservation
	function selectTime(
		time: string,
		iso: string,
		apid?: string | null,
		shift_persistent_id?: string
	) {
		if (!state) return
		updateState((items: ReservationContextState) => ({
			...items,
			updatedReservation: {
				...items.updatedReservation,
				apid: apid,
				arrival_time: time,
				date: day.tz(iso.replace(/ /g, 'T')).format('YYYY/MM/DD'),
				shift_persistent_id,
			},
			step: items.step + 1,
		}))
	}

	function isSelectedTime(time: string, apid?: string | null) {
		if (apid)
			return (
				state.updatedReservation?.date ===
					day.tz(time.replace(/ /g, 'T')).format('YYYY/MM/DD') &&
				state.existingReservation?.access_persistent_id === apid
			)
		return state.updatedReservation?.date === time
	}

	function updateSelectedDate(datetime: string) {
		updateTime({
			...time,
			selectedDate: datetime,
		})

		updateState((items: ReservationContextState) => ({
			...items,
			updatedReservation: {
				...items.updatedReservation,
				date: day(
					`${datetime} ${to24HourTime(items.updatedReservation?.arrival_time)}`
				).format('MM-DD-YYYY'),
			},
		}))
	}

	const reservations = state.reservations
		?.filter(res => {
			return (
				day(res.date).format('YYYY/MM/DD') ===
					day(state.updatedReservation?.date).format('YYYY/MM/DD') &&
				res.status !== 'CANCELED' &&
				res.venue_id === state.venue?.id
			)
		})
		.map(res => ({
			reservation: res,
			venue: venues?.find(v => v.id === res?.venue_id),
		}))

	return (
		<Slide direction="left" in={true}>
			<div className={`step ${style.step}`}>
				<div className="left">
					<div className="details">
						{reservations?.length > 0 && !state.existingReservation ? (
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

						<ReservationDateTime format="dddd, MMMM D, YYYY" />

						<ReservationDateTime format="h:mm a" />

						<ReservationPartySize />
					</div>

					<p>
						Please choose from the following availability or choose a different
						date:
					</p>

					<Button
						className="back-button ghost"
						onClick={() => actions.goBack()}
					>
						<span>Back</span>
					</Button>
				</div>

				<div className="divider" />

				<div className="right">
					<div className="week-select">
						<Button className="icon" onClick={selectPreviousWeek}>
							<FontAwesomeIcon icon={faChevronLeft} />
						</Button>

						<h3 className="selected-month">
							{time?.selectedMonth}
							<FontAwesomeIcon icon={faCalendarAlt} />
							<input
								value={monthInput.get()}
								onChange={v => monthInput.set(v.target.value)}
								type="date"
							/>
						</h3>

						<Button className="icon" onClick={selectNextWeek}>
							<FontAwesomeIcon icon={faChevronRight} />
						</Button>
					</div>

					<div className="date-select">
						{time.week.map(datetime => {
							return (
								<div key={datetime}>
									<div className="date">
										<Button
											className={`icon ghost ${
												isSelectedDate(datetime) ? 'selected-day' : ''
											}`}
											onClick={() => updateSelectedDate(datetime)}
											disabled={!dateHasTimes(datetime)}
										>
											{getFormattedDate(datetime, 'D')}
										</Button>

										<div className="day">
											{getFormattedDate(datetime, 'ddd')}
											{dateHasPrograms(datetime) ? (
												<FontAwesomeIcon icon={faStar} />
											) : null}
										</div>
									</div>
								</div>
							)
						})}
					</div>

					{loading && !actions.availabilityError ? (
						<div className="loading">
							<SpinnerRipple />
							<h3>Fetching Available Seating...</h3>
						</div>
					) : (
						<>
							<div className="seating-select">
								{dailyProgram?.length > 0 ? (
									<div className="daily-programs">
										{dailyProgram?.map(program => {
											return (
												<div key={program.id} className="program">
													<h3 className="program-title">{program.title}</h3>
													<p className="program-description">
														{program.description}
													</p>
												</div>
											)
										})}
									</div>
								) : null}

								{slots.bookables?.length || slots.requestables?.length ? (
									<div className="area-select">
										<>
											{slots.bookables?.length ? (
												<div className="seating-area">
													{getSeatingAreas(slots.bookables).map(area => {
														return (
															<div className="seating" key={area.name}>
																<div className="info">
																	<div className="right-side">
																		{area.name ? (
																			<h3 className="name">{area.name}</h3>
																		) : null}

																		{area.desc ? (
																			<div
																				className="description"
																				dangerouslySetInnerHTML={{
																					__html: area.desc,
																				}}
																			/>
																		) : null}
																	</div>
																</div>

																{area.times.map((time, i) => {
																	return (
																		<div key={i} className="times">
																			<>
																				<Button
																					className={`time ghost${
																						isSelectedTime(
																							time.time_iso,
																							time.access_persistent_id
																						)
																							? 'selected-time'
																							: ''
																					}`}
																					onClick={() =>
																						selectTime(
																							time.time,
																							time.time_iso,
																							time.access_persistent_id,
																							time.shift_persistent_id
																						)
																					}
																				>
																					{time.time}
																				</Button>
																			</>
																		</div>
																	)
																})}
															</div>
														)
													})}
												</div>
											) : null}

											{slots.requestables?.length ? (
												<div className="waiting-list">
													<h3>Wait List Available</h3>

													<p>
														Please select a time below to join the wait list for
														this day.
													</p>

													<div className="waiting">
														{slots.requestables?.map((time, i) => {
															return (
																<div key={i} className="times">
																	<div>
																		<Button
																			className={`time ghost ${
																				isSelectedTime(time.time_iso)
																					? 'selected-time'
																					: ''
																			}`}
																			onClick={() =>
																				selectTime(
																					time.time,
																					time.time_iso,
																					time?.access_persistent_id,
																					time?.shift_persistent_id
																				)
																			}
																		>
																			{time.time}
																		</Button>
																	</div>
																</div>
															)
														})}
													</div>
												</div>
											) : null}
										</>
									</div>
								) : (
									<p className="not-available">
										We apologize but there are currently no times available for
										this date. Please feel free to select another date to
										search.
									</p>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</Slide>
	)
}
