import { gql, useMutation } from '@apollo/client'
import { appQuery } from '@archipress/utilities/AppContext'
import { useEffect } from 'react'

const LOG_OUT = gql`
	mutation logOut {
		logout(input: {}) {
			status
		}
	}
`
export default function Logout(): void {
	const [logout, { data, loading, error, called }] = useMutation(LOG_OUT, {
		refetchQueries: [
			{
				query: appQuery,
			},
		],
		awaitRefetchQueries: true,
	})
	useEffect(() => {
		if (data?.logout.status) window.location.replace('https://www.unionleague.org/includes/member-logout.php')
		if (loading || error || called) return null
		logout()
	})

	return null
}
