import ReservationStepSearch from '@archipress/components/Reservation/Step/Search'
import ReservationStepConfirm from '@archipress/components/Reservation/Step/Confirm'
import ReservationStepNotes from '@archipress/components/Reservation/Step/Notes'

import {
	ReservationContextProps,
	ReservationContextState,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, Slide } from '@mui/material'
import style from '@styles/components/Reservation/Modal.module.scss'
import ReservationStepSeatingSelect from '@archipress/components/Reservation/Step/SeatingSelect'
import ReservationCollectData from '@archipress/components/Reservation/Step/CollectData'
import day from '@archipress/utilities/date'
import ReservationCalendarLink, {
	CalendarTypes,
} from '@archipress/components/Reservation/CalendarLink'
import ReservationStepRestrictions from '@archipress/components/Reservation/Step/Restrictions'
import NavigationLink from '@archipress/components/Links/Navigation'
import { OperationVariables, ApolloQueryResult } from '@apollo/client'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { SevenroomsVenue } from '@archipress/utilities/venueInterfaces'
import { to24HourTime } from '@archipress/utilities/functions'

export default function ReservationModal({
	actUpdateSettings,
	reservationSteps,
	calendarData,
	refetch,
	venues,
	open,
}: {
	actUpdateSettings?: any
	reservationSteps?: { show: boolean; name: string }[]
	calendarData?: {
		types: string[]
		message: string
		title: string
	}
	refetch?: (
		variables?: Partial<OperationVariables>
	) => Promise<ApolloQueryResult<any>>
	venues?: SevenroomsVenue[]
	open?: boolean
}) {
	const { state: appState } = useAppContext() as AppContextProps
	const { state, actions } = useReservationContext() as ReservationContextProps

	const reservation = state.existingReservation
	const step = state.step
	const error = state.error
	const opened = typeof open === 'undefined' ? state.openProcess : open
	const date = state.updatedReservation?.date
	const startTime = state.updatedReservation?.arrival_time
	const startDate = day(`${date} ${to24HourTime(startTime)}`).format(
		'YYYY/MM/DD HH:mm:ss'
	)
	const endDate = day(`${date} ${to24HourTime(startTime)}`)
		.add(2, 'hour')
		.format('YYYY/MM/DD HH:mm:ss')
	const calendarType = calendarData?.types || ['Apple', 'Google', 'Outlook']
	const calendarMessage = calendarData?.message ?? ''
	const calendarTitle = calendarData?.title ?? ''
	const order = reservationSteps
		?.filter(step => step.show)
		?.map(step => step.name.split(' ').join('')) || [
		'Search',
		'Seating',
		'DietaryRestrictions',
		'Notes',
	]

	const stepMap = {
		Search: <ReservationStepSearch key={1} venues={venues} />,
		Seating: <ReservationStepSeatingSelect key={2} venues={venues} />,
		DietaryRestrictions: <ReservationStepRestrictions key={3} />,
		Notes: <ReservationStepNotes key={4} />,
	}

	const components =
		state.client && state.client !== null
			? [
					...order.map(
						item => Object.entries(stepMap).find(([k, v]) => k === item)[1]
					),
					<ReservationStepConfirm
						key={Object.entries(stepMap).length + 1}
						actUpdateSettings={actUpdateSettings}
						refetch={refetch}
					/>,
			  ]
			: [
					<ReservationCollectData key={0} />,
					...order.map(
						item => Object.entries(stepMap).find(([k, v]) => k === item)[1]
					),
					<ReservationStepConfirm
						key={Object.entries(stepMap).length + 2}
						actUpdateSettings={actUpdateSettings}
						refetch={refetch}
					/>,
			  ]

	return (
		<Modal open={opened} className={style.modal} hideBackdrop={true}>
			<>
				<div
					className="close"
					onClick={() => actions.toggleReservationModalOpen(false)}
				>
					<FontAwesomeIcon icon={faTimes} />
				</div>

				{!state.completed && !error ? (
					<>
						<>{components[step]}</>
					</>
				) : (
					<>
						{state.updatedReservation?.apid && !error ? (
							<>
								<div className="completed step">
									<h1>Thank You</h1>
									<p>
										You will receive your confirmation details at
										<span className="email">
											{' '}
											{reservation?.email ||
												state.client?.email ||
												appState.viewer?.email}
										</span>
									</p>

									{startDate && endDate && date ? (
										<>
											{calendarType.map((type, i) => {
												return (
													<ReservationCalendarLink
														key={i}
														calendarType={type.toLowerCase() as CalendarTypes}
														fields={{
															start_date:
																type === 'Outlook'
																	? day(startDate).toISOString()
																	: startDate,
															end_date:
																type === 'Outlook'
																	? day(endDate).toISOString()
																	: endDate,
															title: calendarTitle,
															description: calendarMessage,
															location: state.venue?.address ?? '',
														}}
														label={`Add to ${type} Calendar`}
													/>
												)
											})}
										</>
									) : null}
								</div>
							</>
						) : null}

						{!state.updatedReservation?.apid && !error ? (
							<div className="requested">
								<h1>Wait List Request Received</h1>
								<p>
									We have received your request for the wait list and will
									contact you soon.
								</p>
								<p>
									If a reservation is created you will be notified and you will
									find your reservation in&nbsp;
									<NavigationLink href="/dining">
										My Reservations
									</NavigationLink>
								</p>
							</div>
						) : null}

						{error ? (
							<div className="error">
								<h1>
									Something went wrong while trying to create your reservation.{' '}
									<br />
									Please try again later or contact member services.
								</h1>
								{error.message ? <h2>error: {error.message}</h2> : null}
							</div>
						) : null}
					</>
				)}
			</>
		</Modal>
	)
}
