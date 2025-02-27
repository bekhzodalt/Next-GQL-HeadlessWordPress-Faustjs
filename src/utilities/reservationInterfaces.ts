export interface SevenroomsCreateReservationData {
	venue_id: string
	date: string
	arrival_time: string
	max_guests: string
	notes: string
	phone_number: string
	first_name: string
	last_name: string
	email: string
	access_persistent_id: string
}

export interface CreateReservationInput {
	access_persistent_id: string
	date: string
	email: string
	first_name: string
	notes: string
	last_name: string
	party_size: string
	phone: string
	time: string
	venue_id: string
}

export interface CreateReservationRequestInput
	extends Omit<CreateReservationInput, 'access_persistent_id'> {}

export interface SevenroomsCreateReservationResponse {
	id: string
	venue_id: string
	date: string
	arrival_time: string
	max_guests: string
	notes: string
	phone_number: string
	first_name: string
	last_name: string
	client_id?: string
	email: string
	access_persistent_id: string
	shift_persistent_id?: string
	status: string
	status_display: string
	status_simple: string
	table_numbers: string
}

export interface SevenroomsCreateReservationRequestData
	extends Omit<SevenRoomsReservationData, 'access_persistent_id'> {}

export interface SevenroomsCreateReservationRequestResponse {
	request_id: string
}

export interface SevenRoomsReservationData {
	access_persistent_id: string
	client_id?: string
	client_reference_code?: string
	client_requests?: string
	date: string
	max_guests: number
	arrival_time: string
	id: string
	reference_code?: string
	status?: string
	venue_id: string
	venue_seating_area_name?: string
	shift_persistent_id?: string
	email?: string
	tags?: Tag[]
}

export interface ActualID {
	is_major?: boolean
	problem_name?: string
}

export interface Problems {
	'[actual_id]'?: ActualID
}

export interface Tag {
	group?: string
	tag?: string
}

/**
 * Information about the Reservation's auto-assigned table(s).
 */
export interface AutoAssignments {
	is_reassigned?: boolean
	name?: string
	sort_order?: number
	table_codes?: string[]
	table_ids?: string[]
}

export interface CustomField {
	display_order?: number
	name?: string
	system_name?: string
	value?: string
}

export interface Item {
	name?: string
	price?: number
	quantity?: number
}

export interface PosTicket {
	''?: string
	admin_fee?: number
	business_id?: number
	code?: number
	employee_name?: string
	end_time?: string
	items?: Item[]
	local_pos_ticket_id?: string
	service_charge?: number
	start_time?: string
	status?: string
	subtotal?: number
	table_no?: string
	tax?: number
	total?: number
}

export interface SevenRoomsReservationRawData {
	access_persistent_id: string
	address: string
	address_2: string
	arrival_time: string
	arrived_guests: number
	auto_assignments: AutoAssignments
	booked_by: string
	check_numbers: string
	city: string
	client_id: string
	client_reference_code: string
	client_requests: string
	comps: number
	comps_price_type: string
	cost_option: number
	country: string
	created: string
	custom_fields: CustomField[]
	date: string
	deleted: string
	duration: number
	email: string
	external_client_id: string
	external_id: string
	external_reference_code: string
	external_user_id: string
	first_name: string
	id: string
	is_vip: boolean
	last_name: string
	left_time: string
	loyalty_rank: number
	loyalty_tier: string
	max_guests: number
	mf_ratio_female: number
	mf_ratio_male: number
	min_price: number
	modify_reservation_link: string
	notes: string
	onsite_payment: number
	paid_by: string
	phone_number: string
	policy: string
	pos_tickets: PosTicket[]
	postal_code: string
	prepayment: number
	problems: Problems
	rating: number
	reference_code: string
	reservation_sms_opt_in: boolean
	reservation_type: string
	seated_time: string
	send_reminder_email: boolean
	send_reminder_sms: boolean
	served_by: string
	shift_category: string
	shift_persistent_id: string
	source_client_id: string
	state: string
	status: string
	status_display: string
	status_simple: string
	table_numbers: string[]
	tags: Tag[]
	total_payment: number
	updated: string
	user: {
		id?: string
		name?: string
	}
	venue_group_client_id: string
	venue_group_id: string
	venue_id: string
	venue_seating_area_id: string
	venue_seating_area_name: string
	internal_notes: string
	time_slot_iso: string
}
