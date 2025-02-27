import { ApolloProvider, gql, useQuery } from '@apollo/client'
import apolloClient from '@archipress/utilities/ApolloClient'
import {
	startTracker,
	setTrackerUserId,
} from '@archipress/utilities/OpenReplayTracker'
import { createContext, useContext, useEffect, useState } from 'react'
import { SevenRoomsReservationData } from './reservationInterfaces'
import { BlogInfoFragment } from '@archipress/fragments/GeneralSettings'

export const AppContext = createContext({})

export const useAppContext = () => useContext(AppContext)

export interface Viewer {
	databaseId: number
	username: string
	name: string
	firstName: string
	lastName: string
	email: string
	locale: string
	capabilities: string[]
	unionLeagueProfileMeta: {
		member_number: string
		first_name: string
		last_name: string
		profile_image: string
		mobile_phone: string
		home_phone: string
		work_phone: string
	}
	sevenroomsClient?: {
		email: string
		phone_number: string
	}
	sevenroomsReservations: SevenRoomsReservationData[]
}
/**
 * State interface that contains all the sub states for our App Context
 */
export interface AppState {
	loggedIn: boolean
	viewer?: Viewer
	generalSettings?: {
		dateFormat: string
		description: string
		language: string
		startOfWeek: string
		timeFormat: string
		timezone: string
		title: string
		url: string
	}
}

export interface LoginOptions {
	username: FormDataEntryValue
	password: FormDataEntryValue
}

export interface AppActions {
	loading: boolean
}

/**
 * App Context Props interface. Should contain our App state, a function/functions to update our state, and other relevant methods/variables
 */
export interface AppContextProps {
	state: AppState
	updateState: ({ ...args }) => void
	actions: AppActions
}

export const appQuery = gql`
	${BlogInfoFragment}
	query appQuery {
		viewer {
			id
			databaseId
			username
			name
			firstName
			lastName
			email
			locale
			capabilities
			unionLeagueProfileMeta {
				member_number
				first_name
				last_name
				profile_image
				mobile_phone
				home_phone
				work_phone
			}
		}
		generalSettings {
			...BlogInfoFragment
		}
	}
`
/**
 * App Context Provider will allow us to manage different component states
 * @param children will be the Node that we wrap our context provider around
 * @note Keep the code clean! If you add any functionality please document well.
 */

export const AppContextProvider = ({ children }: { children: JSX.Element }) => {
	const { data, loading, error } = useQuery(appQuery, {
		client: apolloClient,
	})

	const [state, updateState] = useState<AppState>({
		generalSettings: data?.generalSettings,
		viewer: data?.viewer,
		loggedIn: Boolean(data?.viewer),
	})

	useEffect(() => {
		startTracker()
		if (error) {
			console.error(`APPCON ERROR - ${error}`)
			return
		}
		if (!data) return
		if (data?.viewer)
			setTrackerUserId(data.viewer.unionLeagueProfileMeta?.member_number)
		updateState({
			...state,
			generalSettings: data?.generalSettings,
			viewer: data?.viewer,
			loggedIn: Boolean(data?.viewer),
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, error])

	const actions = {
		loading,
	}

	return (
		<AppContext.Provider value={{ state, actions }}>
			<ApolloProvider client={apolloClient}>{children}</ApolloProvider>
		</AppContext.Provider>
	)
}
