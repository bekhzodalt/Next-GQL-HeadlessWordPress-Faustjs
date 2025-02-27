import {
	gql,
	LazyQueryExecFunction,
	OperationVariables,
	useLazyQuery,
	useMutation,
} from '@apollo/client'
import date from '@archipress/utilities/date'

import {
	CreateReservationInput,
	CreateReservationRequestInput,
	SevenroomsCreateReservationResponse,
	SevenRoomsReservationData,
	Tag,
} from '@archipress/utilities/reservationInterfaces'
import {
	SevenroomsVenue,
	DiningVenue,
} from '@archipress/utilities/venueInterfaces'

import { useContext, createContext, useState, ReactNode } from 'react'

export const ReservationContext = createContext({})

export const useReservationContext = () => useContext(ReservationContext)

export interface ReservationContextState {
	venue?: SevenroomsVenue
	diningVenue?: DiningVenue
	existingReservation?: SevenRoomsReservationData | null
	updatedReservation?: {
		apid?: string
		arrival_time?: string
		date?: string
		max_guests?: number
		client_requests?: string
		shift_persistent_id?: string
	}
	reservations?: SevenRoomsReservationData[]
	step?: number
	openProcess?: boolean
	openCancel?: boolean
	openDetails?: boolean
	completed?: boolean
	error?: {
		message?: string
	}
	client: any
	collected7RData?: {
		email: string
		phone: string
	}
	tags?: {
		client_tags: Tag[]
		initial_tags: Tag[]
	}
	calendarData?: {
		types: string[]
		message: string
		title: string
	}
	ACTUpdateSettings?: {
		confirmationMessage: string
		subject: string
		templateName: string
		toEmailAddress: string
		toName: string
	}
}

export interface ReservationContextProps {
	state: ReservationContextState
	updateState: ({ ...args }) => void
	actions: {
		toggleReservationModalOpen: (
			open?: boolean,
			reservation?: SevenRoomsReservationData,
			diningVenue?: DiningVenue,
			venue?: SevenroomsVenue
		) => void
		toggleReservationCancelModalOpen: (
			open?: boolean,
			reservation?: SevenRoomsReservationData,
			venue?: DiningVenue
		) => void
		toggleReservationDetailsModalOpen: (
			open?: boolean,
			reservation?: SevenRoomsReservationData,
			venue?: DiningVenue
		) => void
		goBack: () => void
		goForward: () => void
		CreateReservation: (
			args: CreateReservationInput,
			tags?: { client_tags: Tag[]; initial_tags: Tag[] }
		) => Promise<{
			data: SevenroomsCreateReservationResponse
			msg: string
			status: number
		}>
		CreateReservationRequest: (
			args: CreateReservationRequestInput,
			tags: {
				client_tags: Tag[]
				initial_tags: Tag[]
			},
			clientId?: string
		) => Promise<{
			data: SevenroomsCreateReservationResponse
			msg: string
			status: number
		}>
		CancelReservation: (args: { reservation_id: string }) => Promise<{
			data: SevenroomsCreateReservationResponse
			msg: string
			status: number
		}>
		UpdateDietaryTags: (
			tags?: Tag[],
			clientId?: string
		) => Promise<{
			status: string
		}>
		getVenueAvailability: LazyQueryExecFunction<any, OperationVariables>
		reservationsLoading: boolean
		reservationsData: boolean
		reservationsError: boolean
		createReservationLoading: boolean
		createReservationData: boolean
		createReservationError: boolean
		createReservationRequestLoading: boolean
		createReservationRequestData: boolean
		createReservationRequestError: boolean
		cancelReservationLoading: boolean
		cancelReservationData: boolean
		cancelReservationError: boolean
		venuesLoading: boolean
		venuesError: boolean
		availabilityLoading: boolean
		availabilityError: boolean
	}
}

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
	const [
		createReservations,
		{
			loading: createReservationLoading,
			data: createReservationData,
			error: createReservationError,
		},
	] = useMutation(CreateReservationFragment)

	const [
		createReservationRequest,
		{
			loading: createReservationRequestLoading,
			data: createReservationRequestData,
			error: createReservationRequestError,
		},
	] = useMutation(CreateReservationRequestFragment)

	const [
		cancelReservation,
		{
			loading: cancelReservationLoading,
			data: cancelReservationData,
			error: cancelReservationError,
		},
	] = useMutation(CancelReservationFragment)

	const [updateClient] = useMutation(UpdateClientFragment)

	// Reservation Context State
	const [state, updateState] = useState<ReservationContextState>({
		openProcess: false,
		openDetails: false,
		openCancel: false,
		step: 0,
		completed: false,
		tags: {
			client_tags: [],
			initial_tags: [],
		},
		client: null,
	})

	/**
	 * Creates a reservation in 7R
	 * @param {CreateReservationInput} args
	 * @returns reservation response data, message, and status of the request
	 */
	async function CreateReservation(
		args: CreateReservationInput,
		tags?: { client_tags: Tag[]; initial_tags: Tag[] }
	) {
		try {
			const {
				data: { createSevenroomsReservation },
			} = await createReservations({
				variables: args,
			})

			const data =
				createSevenroomsReservation?.data as SevenroomsCreateReservationResponse
			const msg: string = createSevenroomsReservation?.msg
			const status: number = createSevenroomsReservation?.status

			if (status === 200) await UpdateDietaryTags(data?.client_id, tags)

			return {
				data,
				msg,
				status,
			}
		} catch (error) {
			console.error('Failed to create a reservation:', error)
		}
	}

	/**
	 * Creates a reservation request in 7R
	 * @param {CreateReservationInput} args
	 * @returns reservation response data(request id), message, and status of the request
	 */
	async function CreateReservationRequest(
		args: CreateReservationRequestInput,
		tags: {
			client_tags: Tag[]
			initial_tags: Tag[]
		},
		clientId?: string
	) {
		try {
			const {
				data: { createSevenroomsReservationRequest },
			} = await createReservationRequest({ variables: args })

			const data = createSevenroomsReservationRequest?.data as {
				request_id: string
			}

			const msg: string = createSevenroomsReservationRequest?.msg
			const status: number = createSevenroomsReservationRequest?.status

			if (status === 200) await UpdateDietaryTags(clientId, tags)

			return {
				data,
				msg,
				status,
			}
		} catch (error) {
			console.error('Failed to create reservation request:', error)
		}
	}

	/**
	 * Cencels a reservation by reservation_id
	 * @param args
	 * @returns reservation cancellation response data(request id)
	 */
	async function CancelReservation(args: { reservation_id: string }) {
		try {
			const {
				data: { cancelSevenroomsReservation },
			} = await cancelReservation({ variables: args })

			const data =
				cancelSevenroomsReservation?.data as SevenroomsCreateReservationResponse
			const msg: string = cancelSevenroomsReservation?.msg
			const status: number = cancelSevenroomsReservation?.status

			return {
				data,
				msg,
				status,
			}
		} catch (error) {
			console.error('Failed to cancel a reservation:', error)
		}
	}

	/**
	 * Update the current client tags in sevenrooms(Add or Remove)
	 * @param tags optional array of tags to add or remove
	 * @param id optional client id
	 * @returns result of our tag update
	 */
	async function UpdateDietaryTags(
		clientId?: string,
		tags?: { client_tags: Tag[]; initial_tags: Tag[] }
	) {
		try {
			const client_id = clientId

			if (!client_id) return

			const add_tags = tags.client_tags
				?.filter(tag => !tags.initial_tags?.some(t => t.tag === tag.tag))
				.map(tag => `${tag.group}:${tag.tag}`)
				.join(',')

			const remove_tags = tags.initial_tags
				?.filter(i => !tags.client_tags?.some(c => c.tag === i.tag))
				.map(t => `${t.group}:${t.tag}`)
				.join(',')

			if (add_tags.length <= 0 && remove_tags.length <= 0)
				return { status: '400' }

			await updateClient({
				variables: { add_tags, remove_tags, client_id },
			})
		} catch (error) {
			console.error('Failed to update dietary tags', error)
		}
	}

	function toggleReservationModalOpen(
		open?: boolean,
		reservation?: SevenRoomsReservationData,
		diningVenue?: DiningVenue,
		venue?: SevenroomsVenue
	) {
		if ((typeof open === 'boolean' && !open) || state.openProcess === true) {
			updateState((items: ReservationContextState) => ({
				...items,
				openProcess: typeof open !== 'undefined' ? open : !items.openProcess,
				existingReservation: null,
				updatedReservation: null,
				step: 0,
				reservationCompleted: false,
				reservationRequested: false,
				error: null,
				diningVenue: diningVenue ?? items.diningVenue,
				venue,
				completed: false,
			}))
		} else {
			updateState((items: ReservationContextState) => ({
				...items,
				openProcess: typeof open !== 'undefined' ? open : !items.openProcess,
				existingReservation: reservation ?? items.existingReservation,
				updatedReservation: {
					max_guests: reservation?.max_guests || 1,
					date: reservation?.date || date().format('YYYY-MM-DD'),
					arrival_time: reservation?.arrival_time,
					client_requests: reservation?.client_requests || '',
				},
				diningVenue: diningVenue ?? items.diningVenue,
				venue,
			}))
		}
	}

	function toggleReservationCancelModalOpen(
		open?: boolean,
		reservation?: SevenRoomsReservationData,
		venue?: DiningVenue
	) {
		updateState((items: ReservationContextState) => ({
			...items,
			openCancel: typeof open !== 'undefined' ? open : !items.openCancel,
			existingReservation: reservation,
			diningVenue: venue || items.diningVenue,
		}))
	}

	function toggleReservationDetailsModalOpen(
		open?: boolean,
		reservation?: SevenRoomsReservationData,
		venue?: DiningVenue
	) {
		updateState((items: ReservationContextState) => ({
			...items,
			openDetails: typeof open !== 'undefined' ? open : !items.openDetails,
			existingReservation: reservation,
			diningVenue: venue ?? items.diningVenue,
		}))
	}

	function goBack() {
		updateState((items: ReservationContextState) => ({
			...items,
			step: items.step - 1,
		}))
	}

	function goForward() {
		updateState((items: ReservationContextState) => ({
			...items,
			step: items.step + 1,
		}))
	}

	const [
		getVenueAvailability,
		{ loading: availabilityLoading, error: availabilityError },
	] = useLazyQuery(AvailabilityQuery(true))

	const actions = {
		toggleReservationModalOpen,
		toggleReservationCancelModalOpen,
		toggleReservationDetailsModalOpen,
		goBack,
		goForward,
		CreateReservation,
		CreateReservationRequest,
		CancelReservation,
		UpdateDietaryTags,
		getVenueAvailability,
		createReservationLoading,
		createReservationData,
		createReservationError,
		createReservationRequestLoading,
		createReservationRequestData,
		createReservationRequestError,
		cancelReservationLoading,
		cancelReservationData,
		cancelReservationError,
		availabilityLoading,
		availabilityError,
	}

	return (
		<ReservationContext.Provider value={{ state, updateState, actions }}>
			{children}
		</ReservationContext.Provider>
	)
}

export const CreateReservationFragment = gql`
	mutation createReservation(
		$access_persistent_id: String
		$date: String
		$email: String
		$first_name: String
		$notes: String
		$last_name: String
		$party_size: String
		$phone: String
		$time: String
		$venue_id: String
	) {
		createSevenroomsReservation(
			input: {
				access_persistent_id: $access_persistent_id
				date: $date
				email: $email
				first_name: $first_name
				notes: $notes
				last_name: $last_name
				party_size: $party_size
				phone: $phone
				time: $time
				venue_id: $venue_id
			}
		) {
			data {
				id
				venue_id
				date
				arrival_time
				max_guests
				notes
				phone_number
				first_name
				last_name
				client_id
				email
				access_persistent_id
				status
				status_display
				status_simple
				table_numbers
			}
			msg
			status
		}
	}
`

export const CreateReservationRequestFragment = gql`
	mutation createReservationRequest(
		$date: String
		$email: String
		$first_name: String
		$notes: String
		$last_name: String
		$party_size: String
		$phone: String
		$time: String
		$venue_id: String
	) {
		createSevenroomsReservationRequest(
			input: {
				date: $date
				email: $email
				first_name: $first_name
				notes: $notes
				last_name: $last_name
				party_size: $party_size
				phone: $phone
				time: $time
				venue_id: $venue_id
			}
		) {
			data {
				request_id
			}
			msg
			status
		}
	}
`

export const CancelReservationFragment = gql`
	mutation cancelReservation($reservation_id: String) {
		cancelSevenroomsReservation(input: { reservation_id: $reservation_id }) {
			data {
				id
				venue_id
				date
				arrival_time
				max_guests
				notes
				phone_number
				first_name
				last_name
				email
				access_persistent_id
				status
				status_display
				status_simple
				table_numbers
			}
			status
			msg
		}
	}
`

export const UpdateClientFragment = gql`
	mutation updateClient(
		$add_tags: String
		$remove_tags: String
		$client_id: String
	) {
		updateSevenroomsClient(
			input: {
				add_tags: $add_tags
				remove_tags: $remove_tags
				client_id: $client_id
			}
		) {
			status
		}
	}
`
export const AvailabilityQuery = (withPrograms = false) => {
	let query = ''

	for (let d = 0; d < 7; d++) {
		query += `
		${
			withPrograms
				? `
		programs${d + 1}: sevenroomsVenueDailyPrograms(
			end_date: $date${d + 1}
			start_date: $date${d + 1}
			venue_id: $venue_id
		)
			`
				: ''
		}
		date${d + 1}: sevenroomsVenueAvailability(
			date: $date${d + 1}
			end_time: $end_time
			party_size: $party_size
			start_time: $start_time
			venue_id: $venue_id
		) {
			is_closed
			name
			shift_category
			shift_id
			shift_persistent_id
			upsell_categories
			times {
				sort_order
				time
				time_iso
				type
				access_persistent_id
				access_seating_area_id
				cancellation_policy
				cc_party_size_min
				cc_payment_rule
				charge_type
				cost
				duration
				gratuity
				is_held
				is_using_shift_upsells
				pacing_covers_remaining
				pacing_limit
				policy
				public_description_title
				public_long_form_description
				public_photo
				public_time_slot_description
				real_datetime_of_slot
				require_credit_card
				reservation_tags
				tax_rate
				upsell_categories
			}
		}
		`
	}

	return gql`
		query getVenueAvailability(
			$end_time: String
			$party_size: String
			$start_time: String
			$venue_id: String
			$date1: String
			$date2: String
			$date3: String
			$date4: String
			$date5: String
			$date6: String
			$date7: String
		) {
			${query}
		}
	`
}
