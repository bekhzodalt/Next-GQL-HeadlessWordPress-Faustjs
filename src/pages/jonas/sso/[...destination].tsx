import { gql, useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function SSO(): JSX.Element {
	const router = useRouter()
	const [fetchSSO, { error }] = useLazyQuery(JONAS)

	useEffect(() => {
		const { destination } = router.query
		if (!destination) return null
		fetchSSO({
			variables: {
				destination: Array.isArray(destination) ? destination[0] : destination,
			},
		}).then(res => {
			if (res?.data.viewer?.jonasSSO) {
				top.location.replace(res.data.viewer.jonasSSO)
				return null
			}
		})
	}, [router, fetchSSO])

	if (error) router.replace('/')
	return null
}

const JONAS = gql`
	query jonasSSO($destination: String) {
		viewer {
			jonasSSO(destination: $destination)
		}
	}
`
