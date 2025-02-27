import { CarouselSlide } from '@archipress/components/Carousels/Carousel'

export interface SevenroomsVenue {
	id: string
	name: string
	venue_group_name: string
	venue_group_id: string
	venue_url_key: string
	times: {
		time: string
		type: string
	}
	address: string
	[key: string | symbol]: any
}

export interface SevenRoomsVenuePrograms {
	price_point: string
	description: string
	shift_categories_display: string
	spend_policy: string
	child_policy: string
	id: string
	table_holding_policy: string
	cuisine: string
	venue_id: string
	title: string
	created?: string
	dress_code: string
}

export interface SevenRoomsVenueAvailability {
	is_closed: boolean
	name: string
	shift_category: string
	shift_id: string
	shift_persistent_id: string
	times: SevenRoomsVenueAvailabilityTime[]
	programs?: SevenRoomsVenuePrograms[]
	upsell_categories: string[]
}

export interface SevenRoomsVenueAvailabilityTime {
	sort_order: number
	time: string
	time_iso: string
	type: string
	access_persistent_id: string | null
	access_seating_area_id?: string
	cancellation_policy?: string
	cc_party_size_min?: number
	cc_payment_rule?: string
	charge_type?: string
	cost?: number
	duration?: number
	gratuity?: number
	is_held?: boolean
	is_using_shift_upsells?: boolean
	pacing_covers_remaining?: number
	pacing_limit?: number
	policy?: string
	public_description_title?: string
	public_long_form_description?: string
	public_photo?: string
	public_time_slot_description?: string
	real_datetime_of_slot?: string
	require_credit_card?: boolean
	reservation_tags?: string[]
	shift_persistent_id?: string
	tax_rate?: number
	upsell_categories?: string[]
}

export type SevenRoomsVenueAvailabilityTimeWithShift =
	SevenRoomsVenueAvailabilityTime & { shift: SevenRoomsVenueAvailability }

export interface SevenRoomsVenueRawData {
	phone_number: string
	neighborhood: string
	venue_class: string
	municipality: string
	venue_group_name: string
	external_venue_id: string
	postal_code: string
	unique_confirmation_prefix: string
	id?: string
	secondary_color: string
	grid_enabled: boolean
	venue_group_id: string
	internal_name: string
	policy: string
	primary_color: string
	website: string
	photos: any[]
	address: string
	venue_url_key: string
	name: string
	cross_street?: any
	membership_enabled: boolean
	full_dining_backend: boolean
	municipality_id: string
	currency_code: string
}

export interface SeatingArea {
	name?: string
	desc?: string
	photo?: string
	times: SevenRoomsVenueAvailabilityTime[]
}

export interface DiningVenue {
	name: string
	title?: string
	content?: string
	details?: {
		label: string
		url: string
		content: string
	}[]
	status: 'open' | 'closed' | 'private'
	type: 'Restaurant' | 'Venue'
	slug: string
	party_size: number
	slides?: any[]
	venueSlides?: CarouselSlide[]
	logo: string
	featuredImage?: string
}
