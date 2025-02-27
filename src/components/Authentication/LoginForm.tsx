import Link from 'next/link'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const LOG_IN = gql`
	mutation logIn($login: String!, $password: String!) {
		loginWithCookies(input: { login: $login, password: $password }) {
			status
		}
	}
`

export default function LoginForm() {
	const router = useRouter()
	const [logIn, { loading, error }] = useMutation(LOG_IN, {
		refetchQueries: ['appQuery'],
		awaitRefetchQueries: true,
	})

	const errorMessage = error?.message || ''
	const isUsernameValid =
		!errorMessage.includes('empty_email') &&
		!errorMessage.includes('empty_username') &&
		!errorMessage.includes('invalid_email') &&
		!errorMessage.includes('invalid_username')
	const isPasswordValid =
		!errorMessage.includes('empty_password') &&
		!errorMessage.includes('incorrect_password')

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const data = new FormData(event.currentTarget)
		const { username, password } = Object.fromEntries(data)
		logIn({
			variables: {
				login: username,
				password,
			},
		})
			.then(res => {
				if (res.errors && !res.data) return null
				router.query?.redirect_uri
					? router.replace(`${router.query?.redirect_uri}`)
					: router.replace('/')
				return null
			})
			.catch(error => {
				console.error(error)
			})
	}

	return (
		<form method="post" onSubmit={handleSubmit}>
			<fieldset disabled={loading} aria-busy={loading}>
				<label htmlFor="log-in-username">Username</label>
				<input
					id="log-in-username"
					type="text"
					name="username"
					autoComplete="username"
					required
				/>
				<label htmlFor="log-in-password">Password</label>
				<input
					id="log-in-password"
					type="password"
					name="password"
					autoComplete="current-password"
					required
				/>
				<Link href="/forgot-password">
					<a className="forgot-password-link">Forgot password?</a>
				</Link>
				{!isUsernameValid || !isPasswordValid ? (
					<p className="error-message">
						Invalid Credentials. Please try again.
					</p>
				) : null}
				<button type="submit" disabled={loading}>
					{loading ? 'Logging in...' : 'Log in'}
				</button>
			</fieldset>
		</form>
	)
}
