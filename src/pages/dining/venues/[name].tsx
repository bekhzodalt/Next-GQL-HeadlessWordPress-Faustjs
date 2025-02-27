import DiningLayout from '@archipress/components/Layouts/Dining'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { useRouter } from 'next/router'
import { ReservationProvider } from '@archipress/utilities/ReservationContext'
import apolloClient from '@archipress/utilities/ApolloClient'
import { gql } from '@apollo/client'

export default function VenuePage() {
	const { state } = useAppContext() as AppContextProps
	const loading = !state?.generalSettings
	const router = useRouter()

	if (!state?.loggedIn && !loading) {
		top.location.replace(
			`https://www.unionleague.org/members.php?redirect_uri=${router.asPath}`
		)
	}

	const { name } = router.query

	return (
		<>
			{!loading ? (
				<ReservationProvider>
					<DiningLayout
						page="venues"
						venueName={Array.isArray(name) ? name[0] : name}
					/>
				</ReservationProvider>
			) : null}
		</>
	)
}

export async function getStaticProps(ctx: any) {
	return { props: {}, revalidate: 600 }
}

export async function getStaticPaths() {
	const venues = await apolloClient.query({
		query: gql`
			query venueMenu {
				menu(id: "venues", idType: LOCATION) {
					id
					menuItems(first: 30) {
						nodes {
							path
						}
					}
				}
			}
		`,
	})
	const paths = []
	if (!venues.loading && venues?.data?.menu?.menuItems?.nodes)
		paths.push(
			...venues?.data?.menu?.menuItems?.nodes
				?.filter(
					(node: any) => node.path.startsWith('/') && node.path !== '/dining'
				)
				.map((node: any) => node.path)
		)
	return {
		paths: paths as any,
		fallback: 'blocking',
	}
}
