export interface Tax {
	count: string
	description: string
	filter: string
	name: string
	parent: string
	slug: string
	taxonomy: string
	term_group: string
	term_id: string
	term_taxonomy_id: string
	children?: Tax[]
}

export interface Addon {
	addon_id: string
	addon_type: string
	available: string
	cost: string
	event_id: string
	max: string
	min: string
	purchase_mode: string
	required: string
	row_id: string
	sold: string
}

export interface EventSettings {
	all_day: string
	allow_guests: string
	capacity: string
	capacity_used: string
	display_guests: string
	enable_waitlist: string
	end_date: string
	end_date_display: string
	end_time: string
	end_time_display: string
	location_restricted: string
	max_guests: string
	min_guests: string
	recurring: string
	recurring_advanced: string
	recurring_advanced_interval: string
	recurring_advanced_type: string
	recurring_begin: string
	recurring_end: string
	recurring_friday: string
	recurring_interval: string
	recurring_monday: string
	recurring_saturday: string
	recurring_sunday: string
	recurring_thursday: string
	recurring_tuesday: string
	recurring_type: string
	recurring_wednesday: string
	reservation_end_date: string
	reservation_end_time: string
	reservation_form_id: string
	reservation_start_date: string
	reservation_start_time: string
	start_date: string
	start_date_display: string
	start_time: string
	start_time_display: string
	waitlist_mode: string
}

export interface TimeSlot {
	capacity: string
	capacity_used: string
	end_date: string
	end_date_display: string
	row_id: string
	start_date: string
	start_date_display: string
	start_time: string
	start_time_display: string
	title: string
}

export interface FormFieldOption {
	label: string
	slug: string
}

export interface FormField {
	options: FormFieldOption[]
}

export interface FormData {
	fields: FormField[]
}
export interface EventType {
	featured_image: string
	post_content: string
	post_excerpt: string
	post_parent: string
	post_title: string
	post_id: string
	addons: Addon[]
	categories: Tax[]
	locations: Tax[]
	policies: Tax[]
	tags: Tax[]
	event_settings: EventSettings
	time_slots: TimeSlot[]
	form: FormData
}
