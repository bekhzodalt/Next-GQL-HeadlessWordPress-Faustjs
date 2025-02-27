import { PasswordChangePayload } from '@archipress/pages/api/account/changepassword'
import { MenuItemPartial } from '@archipress/utilities/MenuContext'
import { Tax } from '@archipress/utilities/interfaces'
import { SevenRoomsReservationData } from '@archipress/utilities/reservationInterfaces'
import { SevenroomsVenue } from '@archipress/utilities/venueInterfaces'
import day from 'dayjs'

/**
 * Pass any text and get back a slugified string
 * @param {string} text
 * @returns {string} slugified string
 * @example const slug = slugify('This is a test') // outputs 'this-is-a-test'
 */
export function slugify(text: string) {
	if (typeof text !== 'string' || !text) return
	const slugged = text?.toLowerCase().split(' ').join('-')
	return slugged
}

/**
 * Scroll to a specified element by id
 */
export function useScrollTo() {
	return (id: string | Element) => {
		if (typeof window === 'undefined') return
		if (typeof id === 'string') {
			const el = document.querySelector(id)

			if (el) {
				el.scrollIntoView()
			}
		} else id.scrollIntoView()
	}
}

/**
 * Scroll to a specified element by layout
 */
export function useLayoutScrollTo() {
	return (element: string | Element, offset = 150) => {
		if (typeof window === 'undefined') return
		const parent = document.querySelector('.layout')

		if (typeof element === 'string') {
			if (!element.length) return console.info('Selector is empty')
			const target = document.querySelector(element)
			if (parent && target) {
				parent.scrollTo(
					0,
					window.scrollY +
						parent.scrollTop +
						target.getBoundingClientRect().top -
						offset
				)
			}
		} else {
			if (parent && element) {
				parent.scrollTo(
					0,
					window.scrollY +
						parent.scrollTop +
						element.getBoundingClientRect().top -
						offset
				)
			}
		}
	}
}

/**
 * Converts 24 hour time to 12 hour time
 *
 * @example
 * const time = toStandardTime('00:00') //returns output: 12:00 AM
 * @param {string} time 24 hour time
 * @return {string} 12 hour time as string
 */
export function toStandardTime(inputTime: string) {
	// Remove spaces and convert to lowercase for easier matching
	const cleanedTime = inputTime.replace(/\s+/g, '').toLowerCase()

	// Use regular expressions to match and extract the hours, minutes, and am/pm
	const standard = cleanedTime.match(/(\d{1,2}):(\d{2})\s*([apm]{2})/)
	const military = cleanedTime.match(/^(\d{2}:\d{2})$/)

	if (standard) {
		let hours = parseInt(standard[1], 10)
		const minutes = roundToNearest15Minutes(parseInt(standard[2]))
		const ampm = standard[3]

		// Convert to a standard 12-hour time format without leading zeros
		const formattedHours =
			hours === 0
				? 12
				: hours < 10
				? `${hours}`
				: hours > 12
				? hours % 12
				: hours
		const standard12HourTime = `${formattedHours}:${minutes} ${ampm.toUpperCase()}`
		return standard12HourTime
	} else if (military) {
		const parts = military[1].split(':')
		if (parts?.length !== 2) return null

		const hours = parseInt(parts[0], 10)
		const minutes = roundToNearest15Minutes(parseInt(parts[1]))

		const ampm = hours >= 12 && hours < 24 ? 'pm' : 'am'
		const formattedHours = hours % 12 || 12 // Convert 0 to 12 for 12 AM
		return `${formattedHours}:${minutes} ${ampm}`
	}

	return null // Return null for invalid input
}

export function to24HourTime(time: string) {
	if (!time) return
	var hours = Number(time.match(/^(\d+)/)?.[1])
	var minutes = Number(time.match(/:(\d+)/)?.[1])
	var AMPM = time.match(/\s*(am|pm)$/i)?.[1]
	if (AMPM.toLowerCase() === 'pm' && hours < 12) hours = hours + 12
	if (AMPM.toLowerCase() === 'am' && hours == 12) hours = hours - 12
	var sHours = hours.toString()
	var sMinutes = minutes.toString()
	if (hours < 10) sHours = '0' + sHours
	if (minutes < 10) sMinutes = '0' + sMinutes
	return sHours + ':' + sMinutes
}

/**
 * Converts a flat menu item array into a nested array
 * @param items
 * @returns
 */
export function nestArray(items: MenuItemPartial[]) {
	type ReMapped = {
		parentId?: string
		id?: string
		path: string
		label: string
		target?: string
		childItems?: {
			nodes: ReMapped[]
		}
		cssClasses?: string[]
	}

	let mapped: ReMapped[] = []

	items?.forEach(node => {
		const item: ReMapped = {
			...node,
			childItems: node.childItems,
		}

		if (mapped.some(m => m.id === item.parentId)) {
			const removed = mapped.filter(m => m.id !== item.parentId)
			const parent = mapped.find(m => m.id === item.parentId)
			const origNodes = parent.childItems?.nodes ?? []
			const merged: ReMapped = {
				...parent,
				childItems: {
					nodes: [...origNodes, item],
				},
			}
			const result = [...removed, merged]
			mapped = result
		} else {
			mapped.push(item)
		}
	})

	return mapped
}

export function findVenue(
	reservation: SevenRoomsReservationData,
	venues: SevenroomsVenue[]
) {
	return venues?.find(v => v.id === reservation.venue_id)
}

export async function changePassword(payload: PasswordChangePayload) {
	try {
		const body = JSON.stringify(payload)

		const res = await fetch('/api/account/changepassword', {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body,
		})

		return res
	} catch (error) {
		console.error(`Failed to change password: ${error}`)
	}
}

export function getWeekDays(date: string | day.Dayjs) {
	const startDate = day(date).startOf('week')
	const days = []

	for (let d = 0; d < 7; d++) {
		const next = day(startDate).add(d, 'day').format('YYYY/MM/DD')
		days.push(next)
	}

	return days
}

/**
 * Takes array of wordpress taxonmoies and nests them based on parent id
 * @param tax the array of flattened tax items to structure
 */
export function nestTaxonomies(taxonomies: Tax[], parent: string = '0'): Tax[] {
	const nestedTaxonomies: Tax[] = []

	taxonomies.forEach(tax => {
		if (tax.parent === parent) {
			const children = nestTaxonomies(taxonomies, tax.term_id)
			if (children.length) {
				const nestedTaxonomy: Tax = { ...tax, children }
				nestedTaxonomies.push(nestedTaxonomy)
			} else {
				nestedTaxonomies.push({ ...tax })
			}
		}
	})

	return nestedTaxonomies
}

/**
 * Checks if a taxonomy is a child of another taxonomy within the nested structure
 * @param nestedTaxonomies the nested taxonomy structure
 * @param parentTaxonomyId the ID of the parent taxonomy
 * @param childTaxonomyId the ID of the child taxonomy
 */
export function isChildOf(
	nestedTaxonomies: Tax[],
	parentTaxonomyId: string,
	childTaxonomyId: string
): boolean {
	for (const taxonomy of nestedTaxonomies) {
		if (taxonomy.term_id === parentTaxonomyId) {
			return !!taxonomy.children?.some(
				child => child.term_id === childTaxonomyId
			)
		}
		if (taxonomy.children) {
			if (isChildOf(taxonomy.children, parentTaxonomyId, childTaxonomyId)) {
				return true
			}
		}
	}
	return false
}

/**
 * Gets the base parent of the passed taxonomy
 * @param terms the array of flattened terms to search through
 * @param tax the tax to get the base parent for
 * @returns
 */
export function getParent(terms: Tax[], tax: Tax): any {
	if (tax.parent === '0') return tax

	const parent = terms?.find(item => item.term_id === tax.parent)

	if (!parent) return tax

	if (parent?.parent === '0') {
		return parent
	} else {
		return getParent(terms, parent)
	}
}
/**
 * Joins an array of strings using an Oxford comma. ie.(1, 2, and 3)
 * @param array the array of strings to join
 * @returns
 */
export function OxfordComma(array: string[]) {
	if (array.length <= 1) {
		return array.join('')
	} else {
		if (array.length == 2) {
			// if the array is 2 items, the we can just return the two items seperated by 'and'
			return `${array[0]} and ${array[1]}`
		}

		const lastItem = array.pop() // Remove the last item from the array
		const joinedItems = array.join(', ')
		return `${joinedItems}, and ${lastItem}`
	}
}

/**
 * Gets the rounded time within a 15 minute interval
 * @param time military time string
 * @returns
 */
export function roundToNearest15Minutes(militaryMinutes: number) {
	const lastTwoDigits = (militaryMinutes ?? 0) % 100

	if (lastTwoDigits === 0) {
		return '00' // Special case: 00 remains as is
	}
	return (
		Math.round(lastTwoDigits / 15) * 15 +
		Math.floor(militaryMinutes / 100) * 100
	)
}

/**
 * Checks if the provided date is formatted correctly
 * @param inputDate string date in ISO 8601 format. i.e. 2023-08-31
 * @returns
 */
export function isValidDate(inputDate: string) {
	if (inputDate?.length !== 10) return false

	const parts = inputDate?.split('-')

	if (parts?.length !== 3) return false

	const year = parts?.[0]
	const month = parts?.[1]
	const day = parts?.[2]

	if (year?.length !== 4 || month?.length !== 2 || day?.length !== 2)
		return false

	if (/^\d+$/.test(`${year}${month}${day}`)) {
		// if parts are numeric then we return true
		return true
	} else {
		return false
	}
}

/**
 * Checks if the provided time is formatted correctly
 * @param time string time in 24 hour format. i.e. 14:30 is the same as 2:30pm
 */
export function isValidTime(time: string) {
	if (!time) {
		console.error('TIME UNDEFINED ERROR: Undefined is not a valid time')
		return {
			valid: false,
			type: null,
		}
	}

	// convert time to lower case
	const t = time?.toLowerCase()

	// if the time length is invalid then return
	if (t.length < 5 || t.length > 7) {
		console.error(
			'TIME FORMAT ERROR: The length of the provided time is not valid'
		)
		return {
			valid: false,
			type: null,
		}
	}

	// if the colon is missing, then we return
	if (!t?.includes(':')) {
		console.error('TIME FORMAT ERROR: Missing ":" in provided time')
		return {
			valid: false,
			type: null,
		}
	}

	const parts = time?.split(':')

	if (parts?.length === 2) {
		// if military time is detected, then we will test that it is valid
		if (t.length === 5) {
			const hour = parts?.[0]
			const minutes = parts?.[1]

			if (hour?.length !== 2 || minutes.length !== 2)
				return {
					valid: false,
					type: null,
				}

			if (/^\d+$/.test(`${hour}${minutes}`)) {
				return {
					valid: true,
					type: 'military',
				}
			} else {
				return {
					valid: false,
					type: 'military',
				}
			}
		}

		// if standard time detected then we will convert to 24 hour time
		if (
			(t.length === 6 || t.length === 7) &&
			(t.includes('am') || t.includes('pm'))
		) {
			const m = to24HourTime(t)
			return m
				? {
						valid: true,
						type: 'standard',
				  }
				: {
						valid: false,
						type: 'standard',
				  }
		}
	}
}
