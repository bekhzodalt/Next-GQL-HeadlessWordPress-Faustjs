import { gql, useLazyQuery } from '@apollo/client'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

export const StaffContext = createContext({})

export const useStaffContext = () => useContext(StaffContext)

export type ActUserSorted = Record<string, ActUserMeta[]>

export interface ActUserMeta {
	profile_image: string
	display_name: string
	work_phone: string
	work_job_title: string
	work_company_name: string
	user_email: string
}

export interface StaffContextState {
	staff: ActUserMeta[]
	sorted: ActUserSorted
}

export interface StaffContextProps {
	state: StaffContextState
	updateState: ({ ...args }) => void
	actions: {
		GetPublicStaff: (limit?: number) => Promise<ActUserMeta[]>
		GetPrivateStaff: (limit?: number) => Promise<ActUserMeta[]>
		GetByDepartments: (items: ActUserMeta[]) => ActUserSorted
	}
}

export function StaffContextProvider({ children }: { children: ReactNode }) {
	const [state, updateState] = useState<StaffContextState>({
		staff: [],
		sorted: {},
	})

	// define queries
	const [
		getStaff,
		{
			loading: getPublicStaffLoading,
			data: getPublicStaffData,
			error: getPublicStaffError,
		},
	] = useLazyQuery(StaffQuery)

	// define functions

	/**
	 * Gets all the staff that are publicly accessible
	 * @param limit optional limit to the return size
	 * @default 150
	 * @param mergeDepartment optional var that determines if we will merge the staff by department
	 * @returns
	 */
	async function GetStaff(limit = 150, mergeDepartment = true) {
		try {
			const { data } = await getStaff({
				variables: {
					number: limit,
				},
			})

			const meta = data?.unionLeagueStaffDirectory?.metaFields as ActUserMeta[]

			if (mergeDepartment) {
				const items = GetByDepartments(meta)
				return items
			}

			return meta
		} catch (error) {
			console.error('Failed to get public staff users:', error)
		}
	}

	useEffect(() => {
		if (getPublicStaffError || getPublicStaffLoading) return

		GetStaff(110).then(data => {
			if (Array.isArray(data)) {
				updateState(() => ({
					...state,
					staff: data,
				}))
			} else {
				updateState(() => ({
					...state,
					sorted: data,
				}))
			}
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getPublicStaffData])

	function GetByDepartments(items: ActUserMeta[]) {
		let sorted: ActUserSorted = {}

		items.forEach((user, i) => {
			if (!user.work_company_name) return
			if (Object.keys(sorted).includes(user.work_company_name)) {
				const key = user.work_company_name as keyof ActUserSorted
				sorted[key]?.push(user)
			} else {
				const key = user.work_company_name as keyof ActUserSorted
				sorted[key] = [user]
			}
		})

		return sorted
	}

	const actions = {
		GetStaff,
		GetByDepartments,
	}

	return (
		<StaffContext.Provider value={{ state, updateState, actions }}>
			{children}
		</StaffContext.Provider>
	)
}

export const StaffQuery = gql`
	query GetStaff($number: Int) {
		unionLeagueStaffDirectory(number: $number) {
			metaFields {
				profile_image
				display_name
				work_phone
				work_job_title
				work_company_name
				user_email
			}
		}
	}
`
