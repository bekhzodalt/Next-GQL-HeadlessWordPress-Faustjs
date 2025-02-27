import { useMutation, gql } from '@apollo/client'
import { appQuery } from '@archipress/utilities/AppContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
const LOG_IN = gql`
	mutation loginWithToken($token: String) {
		loginWithToken(input: { token: $token }) {
			code
		}
	}
`
export default function Legacy(): void {
	const router = useRouter()
	const token = router.query?.token
	const redirect = router.query?.redirect_uri?.toString()
	const [logIn, { data, error, loading }] = useMutation(LOG_IN, {
		refetchQueries: [
			{
				query: appQuery,
			},
		],
		awaitRefetchQueries: true,
	})
	useEffect(() => {
		if (!token) return null
		logIn({
			variables: {
				token,
			},
		})
		return null
	}, [token, logIn])

	if (error || loading) return null

	if (data?.loginWithToken?.code) {
		if (redirect.startsWith('/sso/admin')) {
			top.location.href = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin`
		} else {
			router.replace(redirect.toString())
		}
	}

	return null
}
